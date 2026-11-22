import path from 'node:path'
import fetch from 'node-fetch'
import { POOLS, big, readLocal } from './SrGachaStore.js'

const BADGE_LOGIN = 'https://api-takumi.mihoyo.com/common/badge/v1/login/account'
const SR_ROLES = 'https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hkrpg_cn'
const GACHA_BASE = 'https://act-api-takumi.mihoyo.com/event/rpg_gacha_record'
const REFERER = 'https://act.mihoyo.com/sr/event/gt-aio/gacha-records/index.html'
const LOG_HOST_CN = 'https://public-operation-hkrpg.mihoyo.com'
const LOG_HOST_OS = 'https://public-operation-hkrpg-sg.hoyoverse.com'
const UA = 'Mozilla/5.0 (Linux; Android 13; V2183A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 miHoYoBBS/2.71.1'
const RETRY_WAITS = [5000, 15000, 30000, 60000]

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

async function request (url, { headers = {}, body, timeout = 20000 } = {}) {
  let ctrl = new AbortController()
  let timer = setTimeout(() => ctrl.abort(), timeout)
  try {
    return await fetch(url, {
      method: body ? 'POST' : 'GET',
      headers: { 'User-Agent': UA, ...headers, ...(body ? { 'Content-Type': 'application/json;charset=UTF-8' } : {}) },
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl.signal
    })
  } finally {
    clearTimeout(timer)
  }
}

async function actApi (url, { cookie, body } = {}) {
  let res = await request(url, { headers: { Cookie: cookie, Origin: 'https://act.mihoyo.com', Referer: REFERER }, body })
  let setCookie = []
  try {
    if (typeof res.headers.raw === 'function') {
      setCookie = res.headers.raw()['set-cookie'] || []
    } else if (typeof res.headers.getSetCookie === 'function') {
      setCookie = res.headers.getSetCookie() || []
    } else if (res.headers.get('set-cookie')) {
      setCookie = [res.headers.get('set-cookie')]
    }
  } catch (err) {}
  return { json: await res.json().catch(() => null), setCookie }
}

export async function badgeLogin (mysCookie, uid, region) {
  let { json, setCookie } = await actApi(BADGE_LOGIN, {
    cookie: mysCookie,
    body: { game_biz: 'hkrpg_cn', lang: 'zh-cn', region: region || 'prod_gf_cn', uid: String(uid) }
  })
  if (json?.retcode !== 0) {
    if (json?.retcode === -1002) throw new Error(`米游社查不到 UID ${uid}，请确认扫码登录的是这个账号`)
    throw new Error(`换取抽卡记录凭证失败：${json?.message || '接口无响应'}（${json?.retcode}）`)
  }
  let act = setCookie
    .flatMap(c => String(c).split(/,(?=[^;,]+=)/))
    .map(c => c.split(';')[0].trim())
    .filter(c => /^[\w-]+=/.test(c) && !/^aliyungf_tc=/.test(c))
    .join(';')
  if (!/e_hkrpg_token=/.test(act)) throw new Error('接口没有下发 e_hkrpg_token，凭证可能已失效')
  return `${mysCookie};${act}`
}

export async function fetchFiveStars (cookie, poolKey) {
  let list = []
  let versionId = '0'
  let maxId = '0'
  let pity = null
  for (let guard = 0; guard < 30; guard++) {
    let q = new URLSearchParams({ gacha_type: poolKey, version_id: versionId, max_id: maxId })
    let { json } = await actApi(`${GACHA_BASE}/five_star_list?${q}`, { cookie })
    if (json?.retcode !== 0) throw new Error(`拉取五星列表失败：${json?.message || '接口无响应'}（${json?.retcode}）`)
    let d = json.data || {}
    if (!Array.isArray(d.list)) throw new Error('五星列表格式异常')
    for (let node of d.list) {
      if (node.item) list.push(node)
      else if (pity === null) pity = Number(node.gacha_count) || 0
    }
    if (!d.has_more) return { list, pity: pity || 0 }
    if (!d.next_max_id || d.next_max_id === '0' || !d.version_id) throw new Error('五星分页信息缺失')
    versionId = d.version_id
    maxId = d.next_max_id
    await sleep(300)
  }
  throw new Error('五星列表超过分页上限')
}

export async function fetchPoolStat (cookie, poolKey) {
  let { json } = await actApi(`${GACHA_BASE}/pool_stat?${new URLSearchParams({ gacha_type: poolKey })}`, { cookie })
  let cards = json?.retcode === 0 ? json.data?.cards || [] : []
  let byUpItem = new Map()
  for (let c of cards) {
    let up = c.up_item?.item_id
    if (up && c.gacha_id) byUpItem.set(String(up), String(c.gacha_id))
  }
  return { cards, byUpItem }
}

export async function fetchSrRoles (cookie) {
  try {
    let res = await request(SR_ROLES, { headers: { Cookie: cookie, Referer: 'https://app.mihoyo.com' }, timeout: 15000 })
    let json = await res.json().catch(() => null)
    if (json?.retcode !== 0) return null
    return (json.data?.list || [])
      .map(r => ({ uid: String(r.game_uid || ''), region: String(r.region || ''), chosen: !!r.is_chosen }))
      .filter(r => r.uid)
  } catch (err) {
    return null
  }
}

export function guessSrRegion (uid) {
  switch (String(uid).slice(0, -8)) {
    case '5':
      return 'prod_qd_cn'
    case '6':
      return 'prod_official_usa'
    case '7':
      return 'prod_official_euro'
    case '8':
    case '18':
      return 'prod_official_asia'
    case '9':
      return 'prod_official_cht'
    default:
      return 'prod_gf_cn'
  }
}

export function parseGachaUrl (msg = '') {
  let url = String(msg).replace(/〈=/g, '&').trim()
  if (!/authkey=/.test(url)) return null
  if (url.includes('getGachaLog?')) url = url.split('getGachaLog?')[1]
  else if (url.includes('index.html?')) url = url.split('index.html?')[1]
  else if (url.includes('?')) url = url.slice(url.indexOf('?') + 1)
  let params = Object.fromEntries(new URLSearchParams(url))
  if (!params.authkey) return null
  params.authkey = params.authkey.replace(/#\/log|#\/|#$/g, '')
  if (!/hkrpg/.test(params.game_biz || '') && !/hkrpg/.test(String(msg))) return null
  return params
}

async function fetchGachaPage (params, gachaType, endId) {
  let cn = ['prod_gf_cn', 'prod_qd_cn'].includes(params.region || 'prod_gf_cn')
  let ep = ['21', '22'].includes(String(gachaType)) ? 'getLdGachaLog' : 'getGachaLog'
  let q = new URLSearchParams({
    authkey_ver: params.authkey_ver || '1',
    sign_type: params.sign_type || '2',
    auth_appid: params.auth_appid || 'webview_gacha',
    lang: 'zh-cn',
    game_biz: params.game_biz || 'hkrpg_cn',
    region: params.region || 'prod_gf_cn',
    authkey: params.authkey,
    gacha_type: String(gachaType),
    page: '1',
    size: '20',
    end_id: String(endId || 0)
  })
  let res
  try {
    res = await request(`${cn ? LOG_HOST_CN : LOG_HOST_OS}/common/gacha_record/api/${ep}?${q}`)
  } catch (err) {
    logger.warn(`[星铁抽卡记录] 池 ${gachaType} 请求失败：${err.name} ${err.message}`)
    let wrapped = new Error(/Abort|Timeout/i.test(err.name) ? '接口一直没响应，稍后再试' : '连不上米哈游接口，稍后再试')
    wrapped.retriable = true
    throw wrapped
  }
  if (!res.ok) throw new Error(`接口 HTTP ${res.status}`)
  let json = await res.json().catch(() => null)
  if (!json) throw new Error('接口没返回 JSON')
  if (json.retcode !== 0) {
    logger.warn(`[星铁抽卡记录] 池 ${gachaType} 接口返回 ${json.retcode}：${json.message || ''}`)
    if ([-100, -101, -111].includes(json.retcode)) throw new Error('链接已过期，请在游戏内重新复制')
    let err = new Error(json.retcode === -110 ? '米哈游接口限流，请稍后再试' : '米哈游接口没给记录，请稍后再试')
    err.retriable = json.retcode === -110
    throw err
  }
  return json.data || {}
}

async function fetchGachaPageRetry (params, gachaType, endId) {
  for (let i = 0; ; i++) {
    try {
      return await fetchGachaPage(params, gachaType, endId)
    } catch (err) {
      if (!err.retriable || i >= RETRY_WAITS.length) throw err
      await sleep(RETRY_WAITS[i])
    }
  }
}

export async function probeLinkUid (params) {
  for (let pool of ['11', '1', '12']) {
    let data = await fetchGachaPageRetry(params, pool, '0')
    if (data.region && !params.region) params.region = data.region
    await sleep(700)
    let uid = data.list?.[0]?.uid
    if (uid) return String(uid)
  }
  return ''
}

export async function fetchAllByAuthkey (params, qq, { full = false, onPool } = {}) {
  let records = []
  let uid = ''
  let stopId = new Map()
  try {
    for (let pool of POOLS.map(p => p.type)) {
      let endId = '0'
      let got = 0
      let reachedOld = false
      for (let i = 0; i < 400 && !reachedOld; i++) {
        let data = await fetchGachaPageRetry(params, pool, endId)
        if (data.region && !params.region) params.region = data.region
        let list = data.list || []
        if (!uid && list[0]?.uid) uid = String(list[0].uid)
        if (!full && uid && !stopId.has(pool)) {
          stopId.set(pool, readLocal(qq, uid, pool)
            .filter(r => !r.xhh_ph && !r.xhh_src && !r.xhh_fid)
            .reduce((m, r) => (big(r.id) > m ? big(r.id) : m), 0n))
        }
        let floor = stopId.get(pool) || 0n
        for (let r of list) {
          if (!full && floor > 0n && big(r.id) <= floor) {
            reachedOld = true
            break
          }
          records.push({
            uid: String(r.uid || uid || ''),
            gacha_id: String(r.gacha_id || ''),
            gacha_type: String(r.gacha_type || pool),
            item_id: String(r.item_id || ''),
            count: String(r.count || '1'),
            time: String(r.time || ''),
            name: String(r.name || ''),
            lang: String(r.lang || 'zh-cn'),
            item_type: String(r.item_type || ''),
            rank_type: String(r.rank_type || ''),
            id: String(r.id || '')
          })
          got++
        }
        if (list.length < 20) break
        endId = list[list.length - 1].id
        await sleep(700)
      }
      onPool?.(pool, got)
      await sleep(500)
    }
  } catch (err) {
    err.partial = { records, uid }
    throw err
  }
  return { records, uid }
}

async function fileUrlFromSeg (e, seg) {
  if (/^https?:\/\//.test(seg.url || '')) return seg.url
  let fid = seg.fid || seg.id || seg.file_id
  if (!fid) return ''
  let tries = [
    () => e.group?.getFileUrl?.(fid),
    () => e.friend?.getFileUrl?.(fid),
    () => e.group?.fs?.download?.(fid, seg.busid),
    () => e.friend?.fs?.download?.(fid, seg.busid),
    () => e.group_id && e.bot?.sendApi?.('get_group_file_url', { group_id: e.group_id, file_id: fid, busid: seg.busid }),
    () => e.bot?.sendApi?.('get_private_file_url', { user_id: e.user_id, file_id: fid })
  ]
  for (let fn of tries) {
    try {
      let r = await fn()
      let url = typeof r === 'string' ? r : r?.url || r?.data?.url || ''
      if (/^https?:\/\//.test(url)) return url
    } catch (err) {}
  }
  return ''
}

export async function fetchImportFile (e) {
  let url = ''
  let name = ''
  let seg = e.file || (Array.isArray(e.message) ? e.message.find(m => m?.type === 'file') : null)
  if (seg) {
    name = seg.name || seg.file_name || seg.file || ''
    url = await fileUrlFromSeg(e, seg)
    if (!url) throw new Error('拿不到文件下载地址')
  }
  if (!/^https?:\/\//.test(url)) {
    url = String(e.msg || '').match(/https?:\/\/[^\s]+/i)?.[0]?.replace(/[)>】」』"'，。！？；;]+$/g, '') || ''
    if (url && !name) {
      try {
        name = decodeURIComponent(path.basename(new URL(url).pathname || ''))
      } catch (err) {}
    }
  }
  if (!/^https?:\/\//.test(url)) return null
  let res = await request(url, { timeout: 60000 })
  if (!res.ok) throw new Error(`下载文件失败：HTTP ${res.status}`)
  let buf = Buffer.from(await res.arrayBuffer())
  if (!buf.length) throw new Error('下载到的文件为空')
  if (buf.length > 40 * 1024 * 1024) throw new Error('文件超过 40MB')
  return { buf, name }
}
