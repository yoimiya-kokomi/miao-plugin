import fs from 'node:fs'
import path from 'node:path'
import moment from '../../components/Moment.js'

export const POOLS = [
  { key: 'GachaType_AvatarUp', type: '11', name: '角色活动跃迁' },
  { key: 'GachaType_EquipmentUp', type: '12', name: '光锥活动跃迁' },
  { key: 'GachaType_CollabAvatarUp', type: '21', name: '联动角色跃迁' },
  { key: 'GachaType_CollabEquipmentUp', type: '22', name: '联动光锥跃迁' },
  { key: 'GachaType_Newbie', type: '2', name: '新手跃迁' },
  { key: 'GachaType_Standard', type: '1', name: '常驻跃迁' }
]
export const POOL_LABEL = Object.fromEntries(POOLS.map(p => [p.type, p.name]))

const ITEM_TYPE = { ItemType_Avatar: '角色', ItemType_Equipment: '光锥' }
const PLACEHOLDER = { item_id: '20006', name: '智库', item_type: '光锥' }
const STANDARD_GACHA_ID = '1001'

export const SR_JSON_DIR = path.join(process.cwd(), 'data', 'srJson')
const DATA_DIR = path.join(process.cwd(), 'data', 'srGachaLog')
const UID_FIX = path.join(DATA_DIR, 'uid-fix.json')
export const POOL_CACHE = path.join(DATA_DIR, 'pools.json')

function readJson (file, strict = false) {
  try {
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8')) || {}
  } catch (err) {
    if (strict) throw err
  }
  return {}
}

function writeJson (file, data) {
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, JSON.stringify(data, null, 1))
  } catch (err) {
    logger.debug(`[星铁抽卡记录] 写入 ${path.basename(file)} 失败：${err.message}`)
  }
}

export function fixedUid (qq, uid) {
  if (!uid) return String(uid || '')
  let real = readJson(UID_FIX)[`${qq}:${uid}`]
  return real ? String(real) : String(uid)
}

export function saveUidFix (qq, uid, real) {
  if (!uid || !real || String(uid) === String(real)) return
  let all = readJson(UID_FIX)
  all[`${qq}:${uid}`] = String(real)
  writeJson(UID_FIX, all)
}

export function readPoolCache (strict = false) {
  return readJson(POOL_CACHE, strict)
}

export function savePoolCache (uid, type, pity) {
  let all = readPoolCache()
  let key = String(uid)
  all[key] = all[key] || {}
  let prev = all[key][String(type)] || {}
  all[key][String(type)] = {
    at: Date.now(),
    pity: pity === undefined ? prev.pity || 0 : Number(pity) || 0
  }
  writeJson(POOL_CACHE, all)
}

export function cachedPity (uid, type) {
  return Number(readPoolCache()[String(uid)]?.[String(type)]?.pity) || 0
}

const recordWrites = new Map()

export async function withRecordWrite (qq, uid, task) {
  let key = `${qq}:${uid}`
  let previous = recordWrites.get(key) || Promise.resolve()
  let current = previous.catch(() => {}).then(task)
  recordWrites.set(key, current)
  try {
    return await current
  } finally {
    if (recordWrites.get(key) === current) recordWrites.delete(key)
  }
}

export function idToTime (id) {
  let sec = Number(String(id).slice(0, 10))
  return sec ? moment.unix(sec).format('YYYY-MM-DD HH:mm:ss') : moment().format('YYYY-MM-DD HH:mm:ss')
}

export const big = id => {
  try {
    return BigInt(String(id).replace(/\D/g, '') || '0')
  } catch (err) {
    return 0n
  }
}

export function byIdDesc (a, b) {
  let x = big(a.id)
  let y = big(b.id)
  return y > x ? 1 : y < x ? -1 : 0
}

function logFile (qq, uid, type) {
  return path.join(SR_JSON_DIR, String(qq), String(uid), `${type}.json`)
}

export function readLocal (qq, uid, type) {
  let file = logFile(qq, uid, type)
  if (!fs.existsSync(file)) return []
  let raw = fs.readFileSync(file, 'utf8')
  if (!raw.trim()) return []
  let arr
  try {
    arr = JSON.parse(raw)
  } catch (err) {
    logger.error(`[星铁抽卡记录] ${file} 解析失败：${err.message}`)
    throw new Error('抽卡记录文件损坏，请稍后重试')
  }
  return Array.isArray(arr) ? arr : []
}

function writeLocal (qq, uid, type, list) {
  let file = logFile(qq, uid, type)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(`${file}.tmp`, JSON.stringify(list, '', '\t'))
  fs.renameSync(`${file}.tmp`, file)
}

export function newestUidDir (qq) {
  try {
    let dir = path.join(SR_JSON_DIR, String(qq))
    let subs = fs.readdirSync(dir).filter(d => /^\d+$/.test(d))
    let mtime = d => {
      try {
        let sub = path.join(dir, d)
        return fs.readdirSync(sub).filter(f => f.endsWith('.json'))
          .reduce((m, f) => Math.max(m, fs.statSync(path.join(sub, f)).mtimeMs), 0)
      } catch (err) {
        return 0
      }
    }
    return subs.map(d => ({ d, at: mtime(d) })).sort((a, b) => b.at - a.at)[0]?.d || ''
  } catch (err) {
    return ''
  }
}

function dedupeMini (list) {
  if (!Array.isArray(list) || list.length < 2) return list
  let realKeys = new Map()
  let bump = k => realKeys.set(k, (realKeys.get(k) || 0) + 1)
  for (let r of list) {
    if (r.xhh_ph || r.xhh_src === 'mini') continue
    bump(`${r.item_id}@${String(r.id).slice(0, 10)}`)
    if (r.time) bump(`${r.item_id}@${String(r.time).slice(0, 10)}`)
  }
  if (!realKeys.size) return list

  let batchTotal = new Map()
  for (let r of list) {
    if (r.xhh_src === 'mini') continue
    let b = String(r.id).slice(0, 10)
    batchTotal.set(b, (batchTotal.get(b) || 0) + 1)
  }

  let drop = new Set()
  let pendingPh = []
  for (let r of list) {
    if (String(r.rank_type) === '5') {
      if (r.xhh_src === 'mini') {
        let batch = String(r.id).slice(0, 10)
        let keys = [`${r.item_id}@${batch}`]
        if (r.time) keys.push(`${r.item_id}@${String(r.time).slice(0, 10)}`)
        let hit = keys.find(k => (realKeys.get(k) || 0) > 0)
        if (hit) {
          realKeys.set(hit, realKeys.get(hit) - 1)
          drop.add(r)
          for (let p of pendingPh) {
            if (String(p.id).slice(0, 10) === batch) drop.add(p)
          }
          pendingPh = []
          let fiveInBatch = list.filter(x => String(x.rank_type) === '5' && x.xhh_src !== 'mini' && String(x.id).slice(0, 10) === batch)
          let total = batchTotal.get(batch) || 0
          if (fiveInBatch.length === 1) {
            if (typeof r.is_up === 'boolean' && fiveInBatch[0].is_up === undefined) fiveInBatch[0].is_up = r.is_up
            if (total > 0 && Number(fiveInBatch[0].xhh_pity || 0) < total) fiveInBatch[0].xhh_pity = String(total)
          }
          continue
        }
      }
      pendingPh = []
    } else if (r.xhh_ph) {
      pendingPh.push(r)
    }
  }
  return list.filter(r => !drop.has(r))
}

export function toRecord (uid, type, node, gachaId) {
  let item = node.item
  return {
    uid: String(uid),
    gacha_id: node.gacha_id || gachaId || '',
    gacha_type: String(type),
    item_id: String(item.item_id),
    count: '1',
    time: node.time || idToTime(node.id),
    name: item.name,
    lang: 'zh-cn',
    item_type: ITEM_TYPE[item.item_type] || '角色',
    rank_type: String(item.rarity || 5),
    id: String(node.id),
    xhh_src: 'mini',
    ...(typeof node.is_up === 'boolean' ? { is_up: node.is_up } : {}),
    xhh_pity: String(node.gacha_count || '')
  }
}

function buildPlaceholders (uid, type, highId, lowId, count, usedIds, time, gachaId) {
  let out = []
  let cur = highId - 1n
  while (out.length < count && cur > lowId) {
    let id = String(cur)
    if (!usedIds.has(id)) {
      out.push({
        uid: String(uid),
        gacha_id: gachaId || '',
        gacha_type: String(type),
        item_id: PLACEHOLDER.item_id,
        count: '1',
        time,
        name: PLACEHOLDER.name,
        lang: 'zh-cn',
        item_type: PLACEHOLDER.item_type,
        rank_type: '3',
        id,
        xhh_ph: 1
      })
      usedIds.add(id)
    }
    cur -= 1n
  }
  return out
}

const dupKey = (itemId, id) => `${itemId}@${String(id).slice(0, 10)}`

const dupKeyBucket = (itemId, id) => {
  let s = String(id)
  if (s.length < 10) return ''
  let sec = Number(s.slice(0, 10))
  if (!Number.isFinite(sec) || sec <= 0) return ''
  return `${itemId}@${Math.floor(sec / 600)}`
}

function gachaOf (type, poolStat, itemId) {
  let mapped = poolStat?.byUpItem?.get?.(String(itemId))
  if (mapped) return mapped
  return String(type) === '1' ? STANDARD_GACHA_ID : ''
}

export function mergePool (qq, uid, type, remote, poolStat, { replace = false, persist = true } = {}) {
  let raw = replace ? [] : readLocal(qq, uid, type)
  let local = dedupeMini(raw)
  let real = local.filter(r => !r.xhh_ph)
  let usedIds = new Set(real.map(r => String(r.id)))

  let localGap = new Map()
  let seen = 0
  let prevFive = ''
  for (let r of local) {
    if (String(r.rank_type) === '5') {
      if (prevFive) localGap.set(prevFive, seen)
      prevFive = String(r.id)
      seen = 0
    }
    seen++
  }
  if (prevFive) localGap.set(prevFive, seen)

  let buckets = new Map()
  let bucketOf = k => {
    if (!buckets.has(k)) buckets.set(k, [])
    return buckets.get(k)
  }
  for (let r of real) {
    if (String(r.rank_type) !== '5') continue
    bucketOf(dupKey(r.item_id, r.id)).push(r)
    let bk = dupKeyBucket(r.item_id, r.id)
    if (bk) bucketOf(bk).push(r)
  }

  let stars = remote.list
  let added = []
  let notes = []
  let added5 = 0
  let addedPh = 0
  let skipped = 0
  let patched = 0

  let fullIds = real.filter(r => r.xhh_src !== 'mini' && !r.xhh_fid).map(r => big(r.id))
  let countFullIn = (lo, hi) => fullIds.reduce((n, id) => (id > lo && id < hi ? n + 1 : n), 0)

  let fillGap = ({ name, count, anchorId, prevId, gachaId, time }) => {
    let gap = Number(count) - 1
    if (gap <= 0) return
    let need = gap - countFullIn(prevId, anchorId)
    if (need <= 0) return
    let phs = buildPlaceholders(uid, type, anchorId, prevId, need, usedIds, time, gachaId)
    added.push(...phs)
    addedPh += phs.length
    if (phs.length < need) notes.push(`${name} 的占位只补到 ${phs.length}/${need} 条`)
  }

  let claimed = new Set()
  let takeFrom = key => {
    let arr = buckets.get(key)
    while (arr?.length) {
      let hit = arr.shift()
      if (!claimed.has(hit)) return hit
    }
    return null
  }
  let anchors = stars.map(s => {
    let hit = takeFrom(dupKey(s.item.item_id, s.id)) || takeFrom(dupKeyBucket(s.item.item_id, s.id))
    if (hit) claimed.add(hit)
    return { hit, anchorId: hit ? big(hit.id) : big(s.id) }
  })

  let finalCount = []
  let anchorTime = []
  for (let i = 0; i < stars.length; i++) {
    let s = stars[i]
    let { hit } = anchors[i]
    finalCount[i] = Number(s.gacha_count) || 0
    if (hit) {
      skipped++
      anchorTime[i] = hit.time
      let localNum = Number(localGap.get(String(hit.id))) || 0
      if (hit.xhh_origin) {
        finalCount[i] = Number(s.gacha_count) || localNum
        delete hit.xhh_origin
        patched++
      } else {
        finalCount[i] = Math.max(Number(s.gacha_count) || 0, localNum)
      }
      let fuller = String(finalCount[i])
      if (String(hit.xhh_pity || '') !== fuller) {
        hit.xhh_pity = fuller
        patched++
      }
    } else {
      let rec = toRecord(uid, type, s, gachaOf(type, poolStat, s.item.item_id))
      anchorTime[i] = rec.time
      added.push(rec)
      usedIds.add(String(s.id))
      added5++
    }
  }

  let legacy = real
    .filter(r => String(r.rank_type) === '5' && !claimed.has(r))
    .filter(r => r.xhh_src === 'mini' || Number(r.xhh_pity) > 0)
    .map(r => ({
      name: r.name,
      count: Math.max(Number(r.xhh_pity) || 0, Number(localGap.get(String(r.id))) || 0),
      anchorId: big(r.id),
      gachaId: r.gacha_id || '',
      time: r.time
    }))
  let chain = [
    ...stars.map((s, i) => ({
      name: s.item.name,
      count: finalCount[i],
      anchorId: anchors[i].anchorId,
      gachaId: s.gacha_id || gachaOf(type, poolStat, s.item.item_id),
      time: anchorTime[i]
    })),
    ...legacy
  ].sort((a, b) => (b.anchorId > a.anchorId ? 1 : b.anchorId < a.anchorId ? -1 : 0))
  for (let i = 0; i < chain.length; i++) {
    fillGap({ ...chain[i], prevId: chain[i + 1]?.anchorId ?? 0n })
  }

  if (remote.pity > 0) {
    let lastStarId = chain[0]?.anchorId ?? 0n
    let nowId = BigInt(Math.floor(Date.now() / 1000)) * 1000000000n
    let need = remote.pity - countFullIn(lastStarId, nowId)
    if (need > 0) {
      let phs = buildPlaceholders(uid, type, nowId, lastStarId, need, usedIds, moment().format('YYYY-MM-DD HH:mm:ss'), '')
      added.push(...phs)
      addedPh += phs.length
    }
  }

  let changed = replace || added.length > 0 || patched > 0 || local.length !== real.length || raw.length !== local.length
  if (!changed) return { added5, addedPh, skipped, patched, notes, changed, total: local.length, records: local }
  let merged = [...added, ...real].sort(byIdDesc)
  if (persist) writeLocal(qq, uid, type, merged)
  return { added5, addedPh, skipped, patched, notes, changed, total: merged.length, records: merged }
}

export function assignIds (records) {
  let times = records.map(r => Date.parse(String(r.time).replace(/-/g, '/'))).filter(Boolean)
  if (times.length > 1 && times[0] < times[times.length - 1]) records.reverse()
  let seq = new Map()
  let made = 0
  for (let r of records) {
    if (r.id) continue
    let ms = Date.parse(String(r.time).replace(/-/g, '/'))
    if (!ms) continue
    let sec = Math.floor(ms / 1000)
    let n = seq.has(sec) ? seq.get(sec) - 1 : 999999999
    seq.set(sec, n)
    r.id = String(BigInt(sec) * 1000000000n + BigInt(n))
    r.xhh_fid = 1
    made++
  }
  return made
}

function refillPlaceholders (qq, uid, type) {
  let list = readLocal(qq, uid, type)
  let cache = readPoolCache()[String(uid)]?.[String(type)]
  let newestFive = list.find(r => String(r.rank_type) === '5')
  let fresh = cache?.at && (!newestFive || (Date.parse(String(newestFive.time).replace(/-/g, '/')) || 0) < cache.at)
  mergePool(qq, uid, type, { list: [], pity: fresh ? Number(cache.pity) || 0 : 0 }, null)
}

export function mergeImport (qq, uid, records) {
  let byType = new Map()
  for (let r of records) {
    let t = String(r.gacha_type)
    if (!byType.has(t)) byType.set(t, [])
    byType.get(t).push({ ...r, uid: String(uid) })
  }

  let stat = { added: 0, skipped: 0, dropMini: 0, dropPh: 0, pools: [] }
  for (let [type, list] of byType) {
    let local = readLocal(qq, uid, type)
    let localReal = local.filter(r => !r.xhh_ph)
    let localNonMini = localReal.filter(r => r.xhh_src !== 'mini')
    let ids = new Set(localNonMini.map(r => String(r.id)))
    let keyOf = r => `${r.time}|${r.name}`
    let keyCount = new Map()
    for (let r of localNonMini) keyCount.set(keyOf(r), (keyCount.get(keyOf(r)) || 0) + 1)

    let add = []
    for (let r of list) {
      if (r.id && ids.has(String(r.id))) {
        stat.skipped++
        continue
      }
      let k = keyOf(r)
      if (keyCount.get(k) > 0) {
        keyCount.set(k, keyCount.get(k) - 1)
        stat.skipped++
        continue
      }
      add.push(r)
      if (r.id) ids.add(String(r.id))
    }

    let coverCount = new Map()
    let bump = k => coverCount.set(k, (coverCount.get(k) || 0) + 1)
    let addFive = new Map()
    for (let r of [...localNonMini, ...add]) {
      let bk = `b:${r.item_id}@${String(r.id).slice(0, 10)}`
      let dk = r.time ? `d:${r.item_id}@${String(r.time).slice(0, 10)}` : ''
      bump(bk)
      if (dk) bump(dk)
      if (String(r.rank_type) !== '5') continue
      if (!addFive.has(bk)) addFive.set(bk, r)
      if (dk && !addFive.has(dk)) addFive.set(dk, r)
    }
    let dropMini = 0
    let kept = localReal.filter(r => {
      if (r.xhh_src !== 'mini') return true
      let bk = `b:${r.item_id}@${String(r.id).slice(0, 10)}`
      let dk = r.time ? `d:${r.item_id}@${String(r.time).slice(0, 10)}` : ''
      let useKey = (coverCount.get(bk) || 0) > 0 ? bk : (dk && (coverCount.get(dk) || 0) > 0 ? dk : '')
      if (!useKey) return true
      coverCount.set(useKey, coverCount.get(useKey) - 1)
      let heir = addFive.get(useKey)
      if (heir && r.xhh_pity && !heir.xhh_pity) heir.xhh_pity = String(r.xhh_pity)
      if (heir && typeof r.is_up === 'boolean' && heir.is_up === undefined) heir.is_up = r.is_up
      dropMini++
      return false
    })

    if (!add.length && !dropMini) continue
    let phKept = dropMini ? [] : local.filter(r => r.xhh_ph)
    writeLocal(qq, uid, type, dedupeMini([...add, ...kept, ...phKept].sort(byIdDesc)))
    if (dropMini) refillPlaceholders(qq, uid, type)
    stat.added += add.length
    stat.dropPh += dropMini ? local.length - localReal.length : 0
    stat.dropMini += dropMini
    stat.pools.push(`${POOL_LABEL[type] || type} +${add.length}`)
  }
  return stat
}

function removeTree (dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true })
}

export function rebuildGachaData (qq, uid, entries) {
  let dir = path.join(SR_JSON_DIR, String(qq), String(uid))
  let cache = readPoolCache(true)
  cache[String(uid)] = Object.fromEntries(entries.map(p => [p.type, { at: Date.now(), pity: p.pity }]))
  let suffix = `${process.pid}-${Date.now()}`
  let stage = `${dir}.rebuild-${suffix}`
  let backup = `${dir}.previous-${suffix}`
  let cacheTmp = `${POOL_CACHE}.rebuild-${suffix}`
  let movedOld = false
  let installed = false
  let committed = false
  try {
    fs.mkdirSync(stage, { recursive: true })
    for (let { type, records } of entries) {
      if (!/^\d+$/.test(type) || !Array.isArray(records)) throw new Error('重建记录格式异常')
      fs.writeFileSync(path.join(stage, `${type}.json`), JSON.stringify(records, '', '\t'))
    }
    fs.mkdirSync(path.dirname(POOL_CACHE), { recursive: true })
    fs.writeFileSync(cacheTmp, JSON.stringify(cache, null, 1))
    if (fs.existsSync(dir)) {
      fs.renameSync(dir, backup)
      movedOld = true
    }
    fs.renameSync(stage, dir)
    installed = true
    fs.renameSync(cacheTmp, POOL_CACHE)
    committed = true
  } catch (err) {
    if (installed) removeTree(dir)
    if (movedOld) fs.renameSync(backup, dir)
    throw err
  } finally {
    removeTree(stage)
    if (fs.existsSync(cacheTmp)) fs.unlinkSync(cacheTmp)
    if (committed) {
      try {
        removeTree(backup)
      } catch (err) {
        logger.warn(`[星铁抽卡记录] 旧目录清理失败：${err.message}`)
      }
    }
  }
}
