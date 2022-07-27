import fs from 'fs'
import lodash from 'lodash'
import Format from './Format.js'
import Character from './models/Character.js'
import Reliquaries from './models/Reliquaries.js'
import Miao from './profile-data/miao.js'
import Enka from './profile-data/enka.js'
import Data from './Data.js'

const _path = process.cwd()

let sysCfg = await Data.importModule('plugins/miao-plugin/config/system', 'profile.js')
let diyCfg = await Data.importModule('plugins/miao-plugin/config/', 'profile.js')

const userPath = `${_path}/data/UserData/`

if (!fs.existsSync(userPath)) {
  fs.mkdirSync(userPath)
}

function sleep (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getServ (uid) {
  return (diyCfg.profileApi || sysCfg.profileApi)({ uid, Miao, Enka })
}

let Profile = {
  async request (uid, e) {
    if (uid.toString().length !== 9) {
      return false
    }
    let Serv = getServ(uid)

    let inCd = await redis.get(`miao:role-all:${uid}`)
    if (inCd === 'loading') {
      e.reply('请求过快，请稍后重试..')
      return false
    } else if (inCd === 'pending' && false) {
      e.reply(`距上次请求刷新成功间隔小于${Serv.cd}分钟，请稍后重试..`)
      return false
    }

    await redis.set(`miao:role-all:${uid}`, 'loading', { EX: 20 })
    e.reply('开始获取数据，可能会需要一定时间~')
    await sleep(1000)
    let data
    try {
      data = await Serv.request({ uid, e, sysCfg, diyCfg })
      // enka服务测冷却时间5分钟
      await redis.set(`miao:role-all:${uid}`, 'pending', { EX: Serv.cd * 60 })
      return Profile.save(uid, data, Serv.key)
    } catch (err) {
      console.log(err)
      e.reply('请求失败')
      return false
    }
  },

  save (uid, data, dataSource = 'enka') {
    let userData = {}
    const userFile = `${userPath}/${uid}.json`
    if (fs.existsSync(userFile)) {
      userData = JSON.parse(fs.readFileSync(userFile, 'utf8')) || {}
    }
    lodash.assignIn(userData, lodash.pick(data, 'uid,name,lv,avatar'.split(',')))
    userData.chars = userData.chars || {}
    lodash.forEach(data.chars, (char, charId) => {
      let original = userData.chars[charId] || {}
      if (char.dataSource === 'miao-pre' && original && original.dataSource) {
        original.dataSource = char.dataSource
      } else {
        userData.chars[charId] = char
      }
    })
    fs.writeFileSync(userFile, JSON.stringify(userData), '', ' ')
    return data
  },

  saveCharData (uid, ds) {
    if (!uid || !ds.id) {
      return
    }
    let userData = {}
    const userFile = `${userPath}/${uid}.json`
    if (fs.existsSync(userFile)) {
      userData = JSON.parse(fs.readFileSync(userFile, 'utf8')) || {}
    }
    userData.chars = userData.chars || {}
    userData.chars[ds.id] = ds
    fs.writeFileSync(userFile, JSON.stringify(userData), '', ' ')
    return ds
  },

  _get (uid, charId) {
    const userFile = `${userPath}/${uid}.json`
    let userData = {}
    if (fs.existsSync(userFile)) {
      userData = JSON.parse(fs.readFileSync(userFile, 'utf8')) || {}
    }
    if (userData && userData.chars && userData.chars[charId]) {
      return userData.chars[charId]
    }
    return false
  },

  async get (uid, charId, onlyAvailable = false) {
    if (onlyAvailable) {
      let data = await Profile.get(uid, charId)
      if (data && data.dataSource && data.dataSource !== 'input') {
        return data
      }
      return false
    }

    let data = Profile._get(uid, charId)
    let Serv = getServ(uid)
    if (Serv.getCharData && data && data.id) {
      return await Serv.getCharData(uid, data, Profile.saveCharData, { sysCfg, diyCfg })
    }
    return data
  },

  getAll (uid) {
    const userFile = `${userPath}/${uid}.json`
    let userData = {}
    if (fs.existsSync(userFile)) {
      userData = JSON.parse(fs.readFileSync(userFile, 'utf8')) || {}
    }
    if (userData && userData.chars) {
      return userData.chars
    }
    return false
  },

  formatArti (ds, markCfg = false, isMain = false) {
    if (lodash.isArray(ds[0])) {
      let ret = []
      lodash.forEach(ds, (d) => {
        ret.push(Profile.formatArti(d, markCfg, isMain))
      })
      return ret
    }
    let title = ds[0]
    let key = ''
    let val = ds[1]
    let num = ds[1]
    if (!title || title === 'undefined') {
      return []
    }
    if (/伤害加成/.test(title) && val < 1) {
      val = Format.pct(val * 100)
      num = num * 100
    } else if (/伤害加成|大|暴|充能|治疗/.test(title)) {
      val = Format.pct(val)
    } else {
      val = Format.comma(val, 1)
    }

    if (/元素伤害加成/.test(title)) {
      title = title.replace('元素伤害', '伤')
      key = 'dmg'
    } else if (title === '物理伤害加成') {
      title = '物伤加成'
      key = 'phy'
    }

    key = key || keyMap[title]

    let mark = 0
    if (markCfg) {
      mark = Format.comma(markCfg[title] * num || 0)
      if (isMain) {
        mark = mark / 4
      }
    }
    return { title, val, mark }
  },

  getArtiMark (data, ds) {
    Reliquaries.getMark(data)
    let total = 0
    lodash.forEach(data, (ret) => {
      if (ret[0] && ret[1]) {
        total += mark[ret[0]] * ret[1]
      }
    })
    if (ds && /暴/.test(ds[0])) {
      total += 20
    }
    return total
  },

  inputProfile (uid, e) {
    let { avatar, inputData } = e
    let char = Character.get(avatar)
    let originalData = Profile._get(uid, char.id)
    if (!originalData || !['enka', 'input2'].includes(originalData.dataSource)) {
      return `请先获取${char.name}的面板数据后，再进行面板数据更新`
    }
    inputData = inputData.replace('#', '')
    inputData = inputData.replace(/，|；|、|\n|\t/g, ',')
    let attr = originalData.attr || {}
    let attrMap = {
      hp: /生命/,
      def: /防御/,
      atk: /攻击/,
      mastery: /精通/,
      cRate: /(暴击率|暴率|暴击$)/,
      cDmg: /(暴伤|暴击伤害)/,
      hInc: /治疗/,
      recharge: /充能/,
      dmgBonus: /[火|水|雷|草|风|岩|冰|素|^]伤/,
      phyBonus: /(物理|物伤)/
    }
    lodash.forEach(inputData.split(','), (ds, idx) => {
      ds = ds.trim()
      if (!ds) {
        return
      }
      let dRet = /(.*?)([0-9\.\+\s]+)/.exec(ds)
      if (!dRet || !dRet[1] || !dRet[2]) {
        return
      }
      let name = dRet[1].trim()
      let data = dRet[2].trim()
      name = name.replace('爆', '暴')
      let range = (src, min = 0, max = 1200) => Math.max(min, Math.min(max, src * 1 || 0))

      lodash.forEach(attrMap, (reg, key) => {
        if (reg.test(name)) {
          let tmp = data.split('+')
          switch (key) {
            case 'hp':
              attr[key + 'Base'] = range(tmp[0].trim(), 0, 16000)
              attr[key] = range(tmp[0].trim() * 1 + tmp[1].trim() * 1, attr[key + 'Base'], 50000)
              break
            case 'def':
            case 'atk':
              attr[key + 'Base'] = range(tmp[0].trim(), 0, 1100)
              attr[key] = range(tmp[0].trim() * 1 + tmp[1].trim() * 1, attr[key + 'Base'], 4500)
              break
            case 'mastery':
              attr[key] = range(data, 0, 1200)
              break
            case 'cRate':
              attr[key] = range(data, -95, 120)
              break
            case 'cDmg':
              attr[key] = range(data, 0, 320)
              break
            case 'recharge':
            case 'hInc':
              attr[key] = range(data, 0, 400)
              break
            case 'dmgBonus':
            case 'phyBonus':
              attr[key] = range(data, 0, 200)
              break
          }
        }
      })
    })

    if (lodash.keys(attr) < 3) {
      return false
    }

    originalData.dataSource = 'input2'
    originalData.attr = attr

    let userData = {}
    const userFile = `${userPath}/${uid}.json`
    if (fs.existsSync(userFile)) {
      userData = JSON.parse(fs.readFileSync(userFile, 'utf8')) || {}
    }
    userData.chars = userData.chars || {}
    userData.chars[avatar] = originalData
    fs.writeFileSync(userFile, JSON.stringify(userData), '', ' ')
    return true
  }
}
export default Profile
