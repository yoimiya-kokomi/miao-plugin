import fs from 'fs'
import lodash from 'lodash'
import { Character, ProfileReq, ProfileData } from '../models/index.js'
import Miao from './profile-data/miao.js'
import Enka from './profile-data/enka.js'

const _path = process.cwd()
const userPath = `${_path}/data/UserData/`
if (!fs.existsSync(userPath)) {
  fs.mkdirSync(userPath)
}

ProfileReq.regServ({ Miao, Enka })

let Profile = {
  async request (uid, e) {
    if (uid.toString().length !== 9) {
      return false
    }
    let req = new ProfileReq({ e, uid })
    let data
    try {
      data = await req.request()
      if (!data) {
        return false
      }
      return Profile.save(uid, data)
    } catch (err) {
      console.log(err)
      e.reply('请求失败')
      return false
    }
  },

  save (uid, data) {
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

  get (uid, charId, onlyHasData = false) {
    let data = Profile._get(uid, charId)
    if (data) {
      let profile = new ProfileData(data)
      if (onlyHasData && !profile.hasData) {
        return false
      }
      return profile
    } else {
      return false
    }
  },

  getAll (uid) {
    const userFile = `${userPath}/${uid}.json`
    let userData = {}
    if (fs.existsSync(userFile)) {
      userData = JSON.parse(fs.readFileSync(userFile, 'utf8')) || {}
    }
    if (userData && userData.chars) {
      let ret = {}
      lodash.forEach(userData.chars, (ds, id) => {
        ret[id] = new ProfileData(ds)
      })
      return ret
    }
    return false
  },

  inputProfile (uid, e) {
    let { avatar, inputData } = e
    let char = Character.get(avatar)
    let originalData = Profile._get(uid, char.id)
    if (!originalData || !['enka', 'input2'].includes(originalData.dataSource)) {
      return `请先获取${char.name}的面板数据后，再进行面板数据更新`
    }
    inputData = inputData.replace('#', '')
    inputData = inputData.replace(/[，；、\n\t]/g, ',')
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
      dmgBonus: /[火水雷草风岩冰素]伤|^伤/,
      phyBonus: /(物理|物伤)/
    }
    lodash.forEach(inputData.split(','), (ds, idx) => {
      ds = ds.trim()
      if (!ds) {
        return
      }
      let dRet = /(.*?)([0-9.+\s]+)/.exec(ds)
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
  },

  getServName (uid) {
    let Serv = ProfileReq.getServ(uid)
    return Serv.name
  }
}
export default Profile
