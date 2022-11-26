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
      try {
        userData = JSON.parse(fs.readFileSync(userFile, 'utf8')) || {}
      } catch (e) {
        userData = {}
      }
    }
    lodash.assignIn(userData, lodash.pick(data, 'uid,name,lv,avatar'.split(',')))
    userData.chars = userData.chars || {}
    lodash.forEach(data.chars, (char, charId) => {
      userData.chars[charId] = char
    })
    fs.writeFileSync(userFile, JSON.stringify(userData), '', ' ')
    return data
  },

  _get (uid, charId) {
    const userFile = `${userPath}/${uid}.json`
    let userData = {}
    if (fs.existsSync(userFile)) {
      try {
        userData = JSON.parse(fs.readFileSync(userFile, 'utf8')) || {}
      } catch (e) {
      }
    }
    if (userData && userData.chars) {
      let char = Character.get(charId)
      if (char.isTraveler) {
        let charData = userData.chars['10000005'] || userData.chars['10000007'] || false
        if (charData) {
          char.checkAvatars(charData, uid)
        }
        return charData
      } else {
        return userData.chars[charId]
      }
    }
    return false
  },

  get (uid, charId, onlyHasData = false) {
    let data = Profile._get(uid, charId)
    if (data) {
      let profile = new ProfileData(data, uid)
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
      try {
        userData = JSON.parse(fs.readFileSync(userFile, 'utf8')) || {}
      } catch (e) {
        userData = {}
      }
    }
    if (userData && userData.chars) {
      let ret = {}
      lodash.forEach(userData.chars, (ds, id) => {
        let profile = new ProfileData(ds, uid)
        if (profile.hasData) {
          ret[id] = profile
        }
      })
      return ret
    }
    return false
  },

  async forEach (uid, fn) {
    let profiles = Profile.getAll(uid)
    for (let id in profiles) {
      let ret = await fn(profiles[id], id)
      if (ret === false) {
        return false
      }
    }
  },

  getServName (uid) {
    let Serv = ProfileReq.getServ(uid)
    return Serv.name
  }
}
export default Profile
