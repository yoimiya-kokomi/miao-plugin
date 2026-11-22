import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import YAML from 'yaml'
import md5 from 'md5'
import fetch from 'node-fetch'

const STOKEN_DIRS = [
  'plugins/xiaoyao-cvs-plugin/data/yaml',
  'plugins/xhh/data/Stoken',
  'plugins/xhh-TL/data/Stoken'
]
const APP_UA = 'Mozilla/5.0 (Linux; Android 13; Mi 10 Build/UKQ1.230804.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.186 Mobile Safari/537.36 miHoYoBBS/2.71.1'

export function cookiePart (ck = '', key) {
  let m = String(ck).match(new RegExp(`(?:^|;\\s*)${key}=([^;]+)`))
  return m ? m[1] : ''
}

export function loadStokenYaml (qq) {
  let ret = {}
  for (let dir of STOKEN_DIRS) {
    let file = path.join(process.cwd(), dir, `${qq}.yaml`)
    if (!fs.existsSync(file)) continue
    let data
    try {
      data = YAML.parse(fs.readFileSync(file, 'utf8')) || {}
    } catch (err) {
      continue
    }
    for (let [uid, entry] of Object.entries(data)) {
      if (entry && (entry.stoken || entry.ck_stoken) && !ret[uid]) ret[uid] = entry
    }
  }
  return ret
}

function parseEntry (entry = {}) {
  let raw = entry.ck_stoken || ''
  return {
    stuid: String(entry.stuid || cookiePart(raw, 'stuid') || cookiePart(raw, 'ltuid') || ''),
    stoken: entry.stoken || cookiePart(raw, 'stoken'),
    mid: entry.mid || cookiePart(raw, 'mid')
  }
}

function appDs (query = '') {
  let t = Math.floor(Date.now() / 1000)
  let r = Math.random().toString(36).slice(2, 8)
  return `${t},${r},${md5(`salt=rtvTthKxEyreVXQCnhluFgLXPOFKPHlA&t=${t}&r=${r}&b=&q=${query}`)}`
}

async function getJson (url, headers) {
  let ctrl = new AbortController()
  let timer = setTimeout(() => ctrl.abort(), 15000)
  try {
    let res = await fetch(url, { headers, signal: ctrl.signal })
    return await res.json().catch(() => null)
  } catch (err) {
    return null
  } finally {
    clearTimeout(timer)
  }
}

async function cookieTokenBySToken ({ stuid, stoken, mid }) {
  let ck = `stuid=${stuid};stoken=${stoken}${mid ? `;mid=${mid}` : ''}`
  let json = await getJson('https://passport-api.mihoyo.com/account/auth/api/getCookieAccountInfoBySToken', {
    'x-rpc-app_id': 'bll8iq97cem8',
    'User-Agent': 'okhttp/4.9.3',
    Cookie: ck
  })
  if (json?.data?.cookie_token) return json.data.cookie_token
  let query = `stoken=${encodeURIComponent(stoken)}&uid=${encodeURIComponent(stuid)}${mid ? `&mid=${encodeURIComponent(mid)}` : ''}`
  json = await getJson(`https://api-takumi.mihoyo.com/auth/api/getCookieAccountInfoBySToken?${query}`, {
    Cookie: ck,
    'User-Agent': APP_UA,
    'x-rpc-app_version': '2.71.1',
    'x-rpc-client_type': '2',
    'x-rpc-sys_version': '13',
    'x-rpc-channel': 'miyousheluodi',
    'x-rpc-device_id': crypto.randomUUID(),
    DS: appDs(query)
  })
  return json?.data?.cookie_token || ''
}

export async function stokenToCookie (entry) {
  if (!entry) return ''
  for (let key of ['ck', 'cookie']) {
    if (/cookie_token=/.test(entry[key] || '')) return entry[key]
  }
  let cred = parseEntry(entry)
  if (!cred.stuid || !cred.stoken) return ''
  let token = await cookieTokenBySToken(cred)
  return token ? `account_id=${cred.stuid};ltuid=${cred.stuid};cookie_token=${token}` : ''
}

export function stokenEntries (qq) {
  let ret = []
  for (let [uid, entry] of Object.entries(loadStokenYaml(qq))) {
    let cred = parseEntry(entry)
    if (!cred.stuid || !cred.stoken) continue
    ret.push({ uid: String(uid), ...cred, entry })
  }
  return ret
}

export async function getNoteUser (e, qq = e?.user_id) {
  let NoteUser = e?.runtime?.NoteUser
  if (!NoteUser) {
    try {
      let { default: Runtime } = await import('../../../../lib/plugins/runtime.js')
      NoteUser = new Runtime(e || {}).NoteUser
    } catch (err) {
      NoteUser = null
    }
  }
  if (NoteUser?.create) {
    try {
      let user = await NoteUser.create(qq)
      if (user) return user
    } catch (err) {}
  }
  if (e?.user?.getUidList && String(e.user.qq || e.user_id) === String(qq)) return e.user
  return null
}

export default { cookiePart, loadStokenYaml, stokenEntries, stokenToCookie, getNoteUser }
