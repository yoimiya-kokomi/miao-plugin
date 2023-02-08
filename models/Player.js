/**
 * 用户数据文件
 */
import Base from './Base.js'
import { Data } from '../components/index.js'
import fs from 'fs'
import { ProfileReq, AvatarData } from './index.js'
import Profile from './player-lib/profile.js'
import lodash from 'lodash'

import MysAvatar from './player-lib/MysAvatar.js'

const _path = process.cwd()
const userPath = `${_path}/data/UserData/`
if (!fs.existsSync(userPath)) {
  fs.mkdirSync(userPath)
}

export default class Player extends Base {
  constructor (uid) {
    super()
    if (!uid) {
      return false
    }
    let cacheObj = this._getCache(`player:${uid}`)
    if (cacheObj) {
      return cacheObj
    }
    this.uid = uid
    this.reload()
    return this._cache()
  }

  static create (e) {
    if (e?._mys?.uid) {
      // 传入为e
      let player = new Player(e?._mys?.uid)
      player.e = e
      return player
    } else {
      return new Player(e)
    }
  }

  /**
   * 重新加载json文件
   */
  reload () {
    let data
    data = Data.readJSON(`/data/UserData/${this.uid}.json`, 'root')
    this.setBasicData(data)
    if (data.chars) {
      this.setAvatars(data.chars)
      this._chars = data.chars
    }
    this.setAvatars(data.avatars || [])
  }

  /**
   * 保存json文件
   */
  save () {
    let ret = Data.getData(this, 'uid,name,level,word,face,card,sign,_mys,_profile')
    ret.avatars = {}
    lodash.forEach(this._avatars, (ds) => {
      ret.avatars[ds.id] = ds.toJSON()
    })
    if (this._chars) {
      ret.chars = this._chars
    }
    Data.writeJSON(`/data/UserData/${this.uid}.json`, ret, '', 'root')
  }

  /**
   * 设置玩家基础数据
   * @param ds
   */
  setBasicData (ds) {
    this.name = ds.name || this.name || ''
    this.level = ds.level || this.level || 1
    this.word = ds.word || this.word || 1
    this.face = ds.face || this.face || ''
    this.card = ds.card || this.card || ''
    this.sign = ds.sign || this.sign || ''
    this._avatars = this._avatars || {}
    this._profile = ds._profile || this._profile
    this._mys = ds._mys || this._mys
  }

  /**
   * 设置角色列表
   * @param ds
   */
  setAvatars (ds) {
    lodash.forEach(ds, (avatar) => {
      this.setAvatar(avatar)
    })
  }

  /**
   * 设置角色
   * @param ds
   * @param dataSource
   */
  setAvatar (ds, source) {
    let avatar = this.getAvatar(ds.id)
    avatar.setAvatar(ds, source)
  }

  /**
   * 获取角色
   * @param id
   * @returns {*}
   */
  getAvatar (id) {
    if (!this._avatars[id]) {
      this._avatars[id] = AvatarData.create({ id })
    }
    return this._avatars[id]
  }

  /**
   * 循环角色
   * @param fn
   * @returns {Promise<boolean>}
   */
  async forEachAvatarAsync (fn) {
    for (let id in this._avatars) {
      let ret = await fn(this._avatars[id], id)
      if (ret === false) {
        return false
      }
    }
  }

  forEachAvatar (fn) {
    for (let id in this._avatars) {
      let ret = fn(this._avatars[id], id)
      if (ret === false) {
        return false
      }
    }
  }

  getAvatarData (ids = '') {
    let ret = {}
    if (!ids) {
      this.forEachAvatar((avatar) => {
        ret[avatar.id] = avatar.getDetail()
      })
    } else {
      lodash.forEach(ids, (id) => {
        ret[id] = this.getAvatar(id)
      })
    }
    return ret
  }

  /**
   * 获取当前用户指定charid面板数据
   * @param id
   * @returns {*}
   */
  getProfile (id) {
    let avatar = this.getAvatar(id)
    return avatar.getProfile()
  }

  /**
   * 获取当前用户所有面板数据
   * @returns {{}}
   */
  getProfiles () {
    let ret = {}
    lodash.forEach(this._avatars, (avatar) => {
      let profile = avatar.getProfile()
      if (profile) {
        ret[profile.id] = profile
      }
    })
    return ret
  }

  /**
   * 更新面板
   * @param e
   * @returns {Promise<boolean|*|undefined>}
   */
  async refreshProfile (e, force = true) {
    this._update = []
    let { uid } = this
    if (uid.toString().length !== 9) {
      return false
    }
    let req = new ProfileReq({ e, uid })
    try {
      await req.request(this)
      this._profile = new Date() * 1
      this.save()
      return this._update.length
    } catch (err) {
      console.log(err)
      e.reply('请求失败')
      return false
    }
  }

  // 更新米游社数据
  async refreshMys (force = false) {
    return MysAvatar.refreshMys(this, force)
  }

  // 通过已有的Mys CharData更新
  setMysCharData (charData) {
    MysAvatar.setMysCharData(this, charData)
  }

  // 使用MysApi刷新指定角色的天赋信息
  async refreshTalent (ids = '', force = false) {
    return await MysAvatar.refreshTalent(this, ids, force)
  }

  /**
   * 获取面板更新服务名
   * @param uid
   * @returns {*}
   */
  static getProfileServName (uid) {
    let Serv = ProfileReq.getServ(uid)
    return Serv.name
  }

  static getAvatar (uid, charId, onlyHasData = false) {
    return Profile.get(uid, charId, onlyHasData)
  }
}
