import zlib from 'node:zlib'

const SHEET_TYPES = [
  [/联动.*角色|角色.*联动|collab.*(char|avatar)/i, '21'],
  [/联动.*(光锥|武器)|(光锥|武器).*联动|collab.*(light|weapon|cone)/i, '22'],
  [/角色|avatar|character/i, '11'],
  [/光锥|武器|weapon|cone/i, '12'],
  [/常驻|群星|stellar|standard|regular/i, '1'],
  [/新手|departure|beginner/i, '2']
]

const COL_MATCHERS = {
  item_id: /物品\s*id|item.?id/i,
  id: /^id$|记录\s*id|record.?id/i,
  gacha_type: /跃迁类型|祈愿类型|卡池类型|卡池|gacha.?type|pool/i,
  item_type: /类别|物品类型|item.?type/i,
  rank_type: /星级|品质|稀有|rank|rarity|star/i,
  time: /时间|日期|time|date/i,
  name: /名称|道具名|name$/i
}

const isHeader = row => row?.some(c => COL_MATCHERS.time.test(c || '') || COL_MATCHERS.name.test(c || ''))

function fillCols (headerCells) {
  let cols = {}
  let taken = new Set()
  for (let [key, re] of Object.entries(COL_MATCHERS)) {
    headerCells.forEach((cell, i) => {
      if (cols[key] !== undefined || taken.has(i)) return
      let text = String(cell || '').trim()
      if (text && re.test(text)) {
        cols[key] = i
        taken.add(i)
      }
    })
  }
  return cols
}

function toRank (v) {
  let s = String(v ?? '').trim()
  if (!s) return ''
  let num = /(\d)/.exec(s)?.[1]
  if (num) return num
  for (let [word, n] of Object.entries({ 三: '3', 四: '4', 五: '5' })) if (s.includes(word)) return n
  return ''
}

function normalize (list, ctx = {}) {
  let out = []
  for (let r of list || []) {
    if (!r || typeof r !== 'object') continue
    let gachaType = String(r.gacha_type ?? r.uigf_gacha_type ?? '').trim()
    if (!gachaType) continue
    out.push({
      uid: String(r.uid || ctx.uid || ''),
      gacha_id: String(r.gacha_id || ''),
      gacha_type: gachaType,
      item_id: String(r.item_id || ''),
      count: String(r.count || '1'),
      time: String(r.time || '').trim(),
      name: String(r.name || '').trim(),
      lang: String(r.lang || ctx.lang || 'zh-cn'),
      item_type: String(r.item_type || '').trim(),
      rank_type: toRank(r.rank_type),
      id: String(r.id || '').trim(),
      ...(typeof r.is_up === 'boolean' ? { is_up: r.is_up } : {})
    })
  }
  return out
}

function rowRecord (pick, type) {
  return {
    uid: '',
    gacha_id: '',
    gacha_type: type,
    item_id: pick('item_id'),
    count: '1',
    time: pick('time'),
    name: pick('name'),
    lang: 'zh-cn',
    item_type: pick('item_type'),
    rank_type: toRank(pick('rank_type')),
    id: pick('id')
  }
}

function findRecordArray (node, depth = 0) {
  if (!node || depth > 6) return null
  if (Array.isArray(node)) {
    let sample = node.find(x => x && typeof x === 'object' && !Array.isArray(x))
    if (sample && ('gacha_type' in sample || 'uigf_gacha_type' in sample) && ('item_id' in sample || 'name' in sample)) return node
    for (let it of node) {
      let hit = findRecordArray(it, depth + 1)
      if (hit) return hit
    }
    return null
  }
  if (typeof node === 'object') {
    for (let v of Object.values(node)) {
      let hit = findRecordArray(v, depth + 1)
      if (hit) return hit
    }
  }
  return null
}

function parseJson (text) {
  let json
  try {
    json = JSON.parse(text)
  } catch (err) {
    throw new Error('文件解析失败，请检查文件格式')
  }
  if (Array.isArray(json)) return { format: '记录数组', uid: '', records: normalize(json) }
  if (!json || typeof json !== 'object') throw new Error('文件里没有抽卡记录')
  let info = json.info || {}

  let helper = json
  if (json.gachaData !== undefined) {
    helper = typeof json.gachaData === 'string' ? JSON.parse(json.gachaData) : json.gachaData
  } else if (json.data && typeof json.data === 'object') {
    helper = json.data
  }
  let helperTypes = { roleList: '11', weaponList: '12', normalList: '1', newbieList: '2' }
  if (helper && Object.keys(helperTypes).some(k => Array.isArray(helper[k]))) {
    let uid = String(helper.uid || json.uid || info.uid || '')
    let records = []
    for (let [key, type] of Object.entries(helperTypes)) {
      if (helper[key] !== undefined && !Array.isArray(helper[key])) throw new Error(`小助手 ${key} 格式异常`)
      let rows = (helper[key] || []).filter(r => r && typeof r === 'object')
        .map(r => ({ ...r, gacha_type: r.gacha_type || r.uigf_gacha_type || type }))
      records.push(...normalize(rows, { uid, lang: info.lang }))
    }
    return { format: '星铁小助手 JSON', uid, records }
  }

  if (Array.isArray(json.hkrpg)) {
    let records = []
    let uids = []
    for (let pack of json.hkrpg) {
      let uid = String(pack.uid || '')
      if (uid) uids.push(uid)
      records.push(...normalize(pack.list, { uid, lang: pack.lang }))
    }
    return { format: `UIGF ${info.version || 'v4'}`, uid: uids[0] || '', uids, records }
  }
  if (Array.isArray(json.hk4e) || Array.isArray(json.nap)) throw new Error('这份 UIGF 里没有星铁数据')

  if (Array.isArray(json.list)) {
    let format = info.srgf_version ? `SRGF ${info.srgf_version}` : info.uigf_version ? `UIGF ${info.uigf_version}` : '通用 list'
    return { format, uid: String(info.uid || ''), records: normalize(json.list, { uid: info.uid, lang: info.lang }) }
  }
  let loose = findRecordArray(json)
  if (loose?.length) {
    return { format: '自动识别', uid: String(info.uid || json.uid || ''), records: normalize(loose, { uid: info.uid || json.uid, lang: info.lang }) }
  }
  throw new Error('不支持的 JSON 结构，支持 SRGF / UIGF / 星铁小助手 / Excel')
}

function unzip (buf) {
  let out = new Map()
  let eocd = -1
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65558); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      eocd = i
      break
    }
  }
  if (eocd < 0) throw new Error('不是有效的 xlsx 文件')
  let count = buf.readUInt16LE(eocd + 10)
  let p = buf.readUInt32LE(eocd + 16)
  for (let i = 0; i < count; i++) {
    if (p + 46 > buf.length || buf.readUInt32LE(p) !== 0x02014b50) break
    let method = buf.readUInt16LE(p + 10)
    let compSize = buf.readUInt32LE(p + 20)
    let nameLen = buf.readUInt16LE(p + 28)
    let extraLen = buf.readUInt16LE(p + 30)
    let commentLen = buf.readUInt16LE(p + 32)
    let localOff = buf.readUInt32LE(p + 42)
    let name = buf.toString('utf8', p + 46, p + 46 + nameLen)
    let start = localOff + 30 + buf.readUInt16LE(localOff + 26) + buf.readUInt16LE(localOff + 28)
    let raw = buf.subarray(start, start + compSize)
    out.set(name, method === 0 ? raw : zlib.inflateRawSync(raw))
    p += 46 + nameLen + extraLen + commentLen
  }
  return out
}

const decodeXml = s => String(s ?? '')
  .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
  .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&apos;/g, "'")
  .replace(/&amp;/g, '&')

const joinText = xml => [...xml.matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)].map(t => decodeXml(t[1])).join('')

function colIndex (ref) {
  let m = /^([A-Z]+)/.exec(ref || '')
  if (!m) return -1
  let n = 0
  for (let ch of m[1]) n = n * 26 + (ch.charCodeAt(0) - 64)
  return n - 1
}

function parseSheet (xml, strings) {
  let rows = []
  for (let rm of xml.matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g)) {
    let row = []
    let next = 0
    for (let cm of rm[1].matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      let attr = cm[1] || ''
      let body = cm[2] || ''
      let ref = colIndex(/r="([A-Z]+\d+)"/.exec(attr)?.[1])
      let idx = ref >= 0 ? ref : next
      next = idx + 1
      let type = /t="([^"]+)"/.exec(attr)?.[1]
      if (type === 's') row[idx] = strings[Number(/<v>([\s\S]*?)<\/v>/.exec(body)?.[1])] ?? ''
      else if (type === 'inlineStr' || type === 'str') row[idx] = joinText(body)
      else row[idx] = decodeXml(/<v>([\s\S]*?)<\/v>/.exec(body)?.[1] ?? '')
    }
    rows.push(row)
  }
  return rows
}

function readXlsx (buf) {
  let files = unzip(buf)
  let text = name => (files.has(name) ? files.get(name).toString('utf8') : '')
  let strings = [...text('xl/sharedStrings.xml').matchAll(/<si\b[^>]*>([\s\S]*?)<\/si>/g)].map(m => joinText(m[1]))
  let rels = new Map()
  for (let m of text('xl/_rels/workbook.xml.rels').matchAll(/<Relationship\b([^>]*)>/g)) {
    let id = /Id="([^"]+)"/.exec(m[1])?.[1]
    let target = /Target="([^"]+)"/.exec(m[1])?.[1]
    if (id && target) rels.set(id, target.replace(/^\/?xl\//, '').replace(/^\//, ''))
  }
  let sheets = []
  for (let m of text('xl/workbook.xml').matchAll(/<sheet\b([^>]*?)\/?>/g)) {
    let name = /name="([^"]+)"/.exec(m[1])?.[1]
    if (!name) continue
    let target = rels.get(/r:id="([^"]+)"/.exec(m[1])?.[1]) || ''
    let hit = [`xl/${target}`, target, `xl/worksheets/sheet${sheets.length + 1}.xml`].find(p => files.has(p))
    if (hit) sheets.push({ name: decodeXml(name), rows: parseSheet(text(hit), strings) })
  }
  return sheets
}

function parseExcel (buf) {
  let sheets = readXlsx(buf)
  if (!sheets.length) throw new Error('Excel 里没有可读的工作表')
  let records = []
  for (let sheet of sheets) {
    let type = SHEET_TYPES.find(([re]) => re.test(sheet.name))?.[1]
    if (!type) continue
    let headRow = sheet.rows.findIndex(isHeader)
    if (headRow < 0) continue
    let cols = fillCols(sheet.rows[headRow])
    if (cols.name === undefined && cols.item_id === undefined) continue
    for (let row of sheet.rows.slice(headRow + 1)) {
      if (!row?.length) continue
      let pick = key => (cols[key] === undefined ? '' : String(row[cols[key]] ?? '').trim())
      if (!pick('name') && !pick('item_id')) continue
      records.push(rowRecord(pick, type))
    }
  }
  if (!records.length) throw new Error('Excel 里没找到抽卡记录')
  return { format: 'Excel', uid: '', records }
}

function parseCsvText (text) {
  let rows = []
  let row = []
  let cell = ''
  let inQuote = false
  for (let i = 0; i < text.length; i++) {
    let ch = text[i]
    if (inQuote) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"'
        i++
      } else if (ch === '"') {
        inQuote = false
      } else {
        cell += ch
      }
    } else if (ch === '"') {
      inQuote = true
    } else if (ch === ',' || ch === '\t' || ch === ';') {
      row.push(cell)
      cell = ''
    } else if (ch === '\n') {
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else if (ch !== '\r') {
      cell += ch
    }
  }
  if (cell !== '' || row.length) {
    row.push(cell)
    rows.push(row)
  }
  return rows.filter(r => r.some(c => String(c).trim()))
}

function parseCsv (text) {
  let rows = parseCsvText(text)
  let headRow = rows.findIndex(isHeader)
  if (headRow < 0) throw new Error('csv 里没找到表头')
  let cols = fillCols(rows[headRow])
  if (cols.gacha_type === undefined) throw new Error('csv 里没有「跃迁类型」列')
  let records = []
  for (let row of rows.slice(headRow + 1)) {
    let pick = key => (cols[key] === undefined ? '' : String(row[cols[key]] ?? '').trim())
    let poolText = pick('gacha_type')
    let type = /^\d+$/.test(poolText) ? poolText : SHEET_TYPES.find(([re]) => re.test(poolText))?.[1]
    if (!type || (!pick('name') && !pick('item_id'))) continue
    records.push(rowRecord(pick, type))
  }
  if (!records.length) throw new Error('csv 里没解析出记录')
  return { format: 'csv', uid: '', records }
}

export function parseImportFile (buf, fileName = '') {
  if ((buf.length > 1 && buf[0] === 0x50 && buf[1] === 0x4b) || /\.xlsx$/i.test(fileName)) return parseExcel(buf)
  let text = buf.toString('utf8').replace(/^﻿/, '')
  if (/\.(csv|tsv|txt)$/i.test(fileName) || !/^\s*[[{]/.test(text)) return parseCsv(text)
  return parseJson(text)
}
