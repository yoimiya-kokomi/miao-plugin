import Plugin from '../../components/common/Plugin.js'
import { Cfg } from '#miao'
import { Character, Weapon } from '#miao.models'
import Gacha from './Gacha.js'
import { getNoteUser, stokenEntries, stokenToCookie } from '../../components/common/MysAuth.js'
import { parseImportFile } from './SrGachaImport.js'
import {
  POOLS, assignIds, cachedPity, fixedUid, mergeImport, mergePool,
  newestUidDir, rebuildGachaData, saveUidFix, savePoolCache, withRecordWrite
} from './SrGachaStore.js'
import {
  badgeLogin, fetchAllByAuthkey, fetchFiveStars, fetchImportFile, fetchPoolStat, fetchSrRoles,
  guessSrRegion, parseGachaUrl, probeLinkUid, sleep
} from './SrGachaApi.js'

const enabled = () => Cfg.get('srGachaLog', true)

async function resolveSrUid (e) {
  let user = await getNoteUser(e)
  let uid = user?.getUid?.('sr')
  if (uid) return { uid: fixedUid(e.user_id, uid), user }
  try {
    let v = await redis.get(`Yz:srJson:mys:qq-uid:${e.user_id}`)
    if (v) return { uid: fixedUid(e.user_id, v), user }
  } catch (err) {}
  return { uid: newestUidDir(e.user_id), user }
}

async function boundSrUids (e) {
  let user = await getNoteUser(e)
  let uids = (user?.getUidList?.('sr') || []).map(x => String(x?.uid ?? x)).filter(u => /^\d+$/.test(u))
  return [...new Set(uids.map(u => fixedUid(e.user_id, u)))]
}

function credentialList (qq, uid, user) {
  let map = new Map()
  let entries = stokenEntries(qq).sort((a, b) => (b.uid === String(uid)) - (a.uid === String(uid)))
  for (let s of entries) {
    if (!map.has(s.stuid)) map.set(s.stuid, { entry: s.entry, ck: '' })
  }
  for (let [ltuid, mys] of Object.entries(user?.mysUsers || {})) {
    if (!/cookie_token(?:_v2)?=/.test(mys?.ck || '')) continue
    let item = map.get(String(ltuid)) || { entry: null, ck: '' }
    item.ck = mys.ck
    map.set(String(ltuid), item)
  }
  return [...map.entries()].map(([id, { entry, ck }]) => ({
    id,
    get: async () => (entry && await stokenToCookie(entry)) || ck
  }))
}

async function prepareCookie (e, uid, user, allowFix = false) {
  let cands = credentialList(e.user_id, uid, user)
  if (!cands.length) throw new Error('没有找到可用的米游社凭证，请先【#扫码登录】')
  let firstCookie = ''
  let rolesOk = false
  let pool = []
  for (let c of cands) {
    let cookie = await c.get()
    if (!cookie) continue
    firstCookie = firstCookie || cookie
    let roles = await fetchSrRoles(cookie)
    if (!roles) continue
    rolesOk = true
    let hit = roles.find(r => r.uid === String(uid))
    if (hit) return { cookie, region: hit.region || guessSrRegion(uid), uid: String(uid) }
    for (let r of roles) {
      if (!pool.some(x => x.uid === r.uid)) pool.push({ ...r, cookie })
    }
  }
  if (!firstCookie) throw new Error('米游社凭证已失效，请重新【#扫码登录】')
  if (pool.length) {
    if (allowFix) {
      let pick = pool.find(r => r.chosen) || pool[0]
      saveUidFix(e.user_id, uid, pick.uid)
      return { cookie: pick.cookie, region: pick.region || guessSrRegion(pick.uid), uid: pick.uid }
    }
    throw new Error(`UID ${uid} 不在当前登录的米游社账号下（可查询：${pool.map(r => r.uid).slice(0, 3).join('、')}）`)
  }
  if (rolesOk) throw new Error('米游社账号下没有星铁角色')
  let region = (user?.getUidList?.('sr') || []).find(x => String(x.uid) === String(uid))?.region
  return { cookie: firstCookie, region: /^prod_/.test(region || '') ? region : guessSrRegion(uid), uid: String(uid) }
}

function fillMeta (records) {
  for (let r of records) {
    if (r.name && r.rank_type && r.item_type) continue
    let key = r.name || Number(r.item_id) || ''
    if (!key) continue
    let isChar = r.item_type === '角色' || String(r.item_id).length === 4
    let meta = isChar ? Character.get(key, 'sr') : Weapon.get(key, 'sr')
    if (!meta) continue
    r.name = r.name || meta.name || ''
    r.item_type = r.item_type || (isChar ? '角色' : '光锥')
    r.rank_type = r.rank_type || String(meta.star || '')
    r.item_id = r.item_id || String(meta.id || '')
  }
}

export default class SrGachaLog extends Plugin {
  constructor () {
    super({
      name: '喵喵:星铁抽卡记录',
      dsc: '星铁抽卡记录更新与导入',
      event: 'message',
      priority: -Infinity,
      rule: [
        { reg: 'authkey=', fnc: 'logUrl' },
        { reg: '^\\s*#?星铁(?:强制(?:更新|获取)(?:抽卡)?|(?:更新|获取)抽卡)记录\\s*$', fnc: 'updateLog' },
        { reg: '^\\s*#?星铁(?:强制)?导入(?:小助手)?(?:抽卡)?记录(?:json|excel|xlsx)?(?:\\s+\\S+)?\\s*$', fnc: 'importLog' },
        { reg: '^\\s*#?星铁全部(?:抽卡)?记录\\s*$', fnc: 'viewAll' }
      ]
    })
  }

  async renderStat (uid) {
    return Gacha.renderStat(this.e, { uid, qq: this.e.user_id, type: 'all', game: 'sr' })
  }

  async viewAll () {
    if (!enabled()) return false
    let { uid } = await resolveSrUid(this.e)
    if (!uid) {
      await this.reply('请先【#星铁绑定+UID】，再发送【*更新抽卡记录】', false, { at: true })
      return true
    }
    return this.renderStat(uid)
  }

  async updateLog () {
    if (!enabled()) return false
    let e = this.e
    let force = /强制/.test(e.msg || '')
    let { uid, user } = await resolveSrUid(e)
    if (!uid) {
      await this.reply('没有找到星铁 UID，请先【#星铁绑定+UID】', false, { at: true })
      return true
    }
    await this.reply(force ? '星铁抽卡记录重建中，请稍候...' : '星铁抽卡记录更新中，请稍候...', false, { at: true })
    let rebuilt = false
    try {
      let { cookie, region, uid: realUid } = await prepareCookie(e, uid, user, true)
      let gachaCookie = await badgeLogin(cookie, realUid, region)
      let { pools, failed } = await withRecordWrite(e.user_id, realUid, () => this.runUpdate(realUid, gachaCookie, force))
      rebuilt = force
      let changed = pools.filter(p => p.changed)
      if (changed.length) {
        await this.reply([
          `${force ? '重建' : '更新'}完成 UID:${realUid}`,
          ...changed.map(p => `${p.name}：新增五星 ${p.added5}，当前已垫 ${p.pity} 抽`)
        ].join('\n'), false, { at: true })
      }
      if (failed) await this.reply('部分卡池未能更新，请稍后再试', false, { at: true })
      await this.renderStat(realUid)
    } catch (err) {
      logger.error(`[星铁抽卡记录] ${uid} 更新失败：${err.stack || err.message}`)
      let msg = err.message && !/fetch|abort|ECONN|ETIMEDOUT/i.test(err.message) ? err.message : '请稍后重试'
      await this.reply(force && rebuilt ? '记录已重建，发送【*全部记录】查看' : `更新失败：${msg}`, false, { at: true })
    }
    return true
  }

  async runUpdate (uid, gachaCookie, force) {
    let qq = this.e.user_id
    let pools = []
    let pending = []
    let failed = 0
    for (let pool of POOLS) {
      try {
        let remote = await fetchFiveStars(gachaCookie, pool.key)
        let poolStat = await fetchPoolStat(gachaCookie, pool.key)
        let prevPity = cachedPity(uid, pool.type)
        if (!force) savePoolCache(uid, pool.type, remote.pity)
        let res = mergePool(qq, uid, pool.type, remote, poolStat, { replace: force, persist: !force })
        if (force) pending.push({ type: pool.type, records: res.records, pity: remote.pity })
        pools.push({
          name: pool.name,
          added5: res.added5,
          pity: remote.pity,
          changed: force || res.added5 > 0 || res.patched > 0 || remote.pity !== prevPity
        })
      } catch (err) {
        failed++
        logger.warn(`[星铁抽卡记录] ${pool.name} 拉取失败：${err.message}`)
      }
      await sleep(400)
    }
    if (failed === POOLS.length) throw new Error('所有卡池均拉取失败')
    if (force) {
      if (failed) throw new Error('未能拉取全部卡池，旧记录已保留')
      rebuildGachaData(qq, uid, pending)
    }
    return { pools, failed }
  }

  async logUrl () {
    if (!enabled()) return false
    let e = this.e
    let params = parseGachaUrl(e.msg)
    if (!params) return false
    let full = /全量|强制/.test(e.msg)
    let recall = e.isGroup ? '，请及时撤回链接' : ''
    let bound = await boundSrUids(e)
    if (!bound.length) {
      await this.reply(`请先【#星铁绑定+UID】再发送抽卡链接${recall}`, false, { at: true })
      return true
    }
    let linkUid = ''
    try {
      linkUid = await probeLinkUid(params)
    } catch (err) {
      await this.reply(`抽卡链接无法使用：${err.message}${recall}`, false, { at: true })
      return true
    }
    if (!linkUid) {
      await this.reply(`该链接没有查询到抽卡记录${recall}`, false, { at: true })
      return true
    }
    if (!bound.includes(linkUid)) {
      await this.reply(`该链接属于 ${linkUid}，与绑定的 ${bound.join('、')} 不一致${recall}`, false, { at: true })
      return true
    }
    await this.reply(`正在${full ? '全量' : '增量'}获取星铁抽卡记录，请稍候...`, false, { at: true })
    try {
      let { records } = await fetchAllByAuthkey(params, e.user_id, { full })
      let added = 0
      if (records.length) {
        assignIds(records)
        added = (await withRecordWrite(e.user_id, linkUid, () => mergeImport(e.user_id, linkUid, records))).added
      }
      await this.reply(`抽卡记录更新完成，新增 ${added} 条${recall}`, false, { at: true })
      await this.renderStat(linkUid)
    } catch (err) {
      logger.error(`[星铁抽卡记录] 链接拉取失败：${err.stack || err.message}`)
      let saved = 0
      let part = err.partial?.records || []
      if (part.length) {
        try {
          assignIds(part)
          saved = (await withRecordWrite(e.user_id, linkUid, () => mergeImport(e.user_id, linkUid, part))).added
        } catch (err2) {
          logger.error(`[星铁抽卡记录] 部分记录保存失败：${err2.message}`)
        }
      }
      await this.reply(`获取中断：${err.message}${saved ? `，已保存 ${saved} 条，重新发送链接可继续` : ''}`, false, { at: true })
    }
    return true
  }

  async importLog () {
    if (!enabled()) return false
    let e = this.e
    if (e.isGroup && !/强制/.test(e.msg)) {
      await this.reply('抽卡记录文件建议私聊导入，群聊请发送【*强制导入记录】', false, { at: true })
      return true
    }
    let file
    try {
      file = await fetchImportFile(e)
    } catch (err) {
      await this.reply(`获取文件失败：${err.message}`, false, { at: true })
      return true
    }
    if (file) return this.doImport(file)
    this.setContext('importFile', false, 180)
    await this.reply(/小助手/.test(e.msg || '')
      ? '请在「星铁小助手」小程序同步云端并导出 JSON，然后发送文件（3分钟内有效）'
      : '请发送抽卡记录文件，支持 SRGF / UIGF JSON 与 Excel（3分钟内有效）', false, { at: true })
    return true
  }

  async importFile () {
    let e = this.e
    if (/authkey=/.test(e.msg || '')) {
      this.finish('importFile')
      return 'continue'
    }
    if (!e.file && !e.message?.some?.(m => m?.type === 'file') && !/https?:\/\/\S+/.test(e.msg || '')) return 'continue'
    this.finish('importFile')
    let file
    try {
      file = await fetchImportFile(e)
    } catch (err) {
      await this.reply(`获取文件失败：${err.message}`, false, { at: true })
      return true
    }
    if (!file) {
      await this.reply('没有获取到文件内容，请重新发送【*导入记录】', false, { at: true })
      return true
    }
    return this.doImport(file)
  }

  async doImport (file) {
    let e = this.e
    let recall = e.isGroup ? '，请及时撤回文件' : ''
    let bound = await boundSrUids(e)
    if (!bound.length) {
      await this.reply(`请先【#星铁绑定+UID】再导入${recall}`, false, { at: true })
      return true
    }
    try {
      let parsed = parseImportFile(file.buf, file.name)
      if (!parsed.records.length) throw new Error('文件里没有解析出记录')
      let fileUids = [...new Set([...(parsed.uids || []), parsed.uid || '', ...parsed.records.map(r => r.uid || '')]
        .map(String).filter(u => /^\d+$/.test(u)))]
      let uid = fileUids.length ? bound.find(u => fileUids.includes(u)) : bound[0]
      if (!uid) {
        await this.reply(`文件属于 ${fileUids.join('、')}，与绑定的 ${bound.join('、')} 不一致${recall}`, false, { at: true })
        return true
      }
      let records = fileUids.length ? parsed.records.filter(r => !r.uid || String(r.uid) === uid) : parsed.records
      let dropped = parsed.records.length - records.length
      if (!records.length) throw new Error(`文件里没有 ${uid} 的记录`)
      fillMeta(records)
      assignIds(records)
      let stat = await withRecordWrite(e.user_id, uid, () => mergeImport(e.user_id, uid, records))
      logger.mark(`[星铁抽卡记录] ${uid} ${parsed.format} 导入：新增 ${stat.added}，重复 ${stat.skipped}`)
      await this.reply([
        `导入完成（${parsed.format}），新增 ${stat.added} 条`,
        !fileUids.length && bound.length > 1 ? `，已存入 ${uid}` : '',
        dropped ? `，忽略其他 UID 记录 ${dropped} 条` : '',
        recall
      ].join(''), false, { at: true })
      await this.renderStat(uid)
    } catch (err) {
      logger.error(`[星铁抽卡记录] 导入失败：${err.stack || err.message}`)
      await this.reply(`导入失败：${err.message}`, false, { at: true })
    }
    return true
  }
}
