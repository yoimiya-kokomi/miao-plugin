/**
 * 用户数据文件
 * 数据存储在/data/userData/${uid}.json 下
 * 兼容处理面板户数及Mys数据
 *
 */
import lodash from 'lodash'
import Base from './Base.js'
import { Data } from '../components/index.js'
import { AvatarData, ProfileRank, Character } from './index.js'

import MysAvatar from './player/MysAvatar.js'
import Profile from './player/Profile.js'

Data.createDir('/data/userData', 'root')

export default class Player extends Base {
  constructor (uid) {
    super()
    uid = uid?._mys?.uid || uid?.uid || uid
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

  get hasProfile () {
    let ret = false
    lodash.forEach(this._avatars, (avatar) => {
      if (avatar.isProfile) {
        ret = true
        return false
      }
    })
    return ret
  }

  static create (e) {
    if (e?._mys?.uid || e.uid) {
      // 传入为e
      let player = new Player(e?._mys?.uid || e.uid)
      player.e = e
      return player
    } else {
      return new Player(e)
    }
  }

  // 获取面板更新服务名
  static getProfileServName (uid) {
    let Serv = Profile.getServ(uid)
    return Serv.name
  }

  static delByUid (uid) {
    let player = Player.create(uid)
    if (player) {
      player.del()
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
      // 暂时保留旧数据，防止异常情况
      this._chars = data.chars
    }
    this.setAvatars(data.avatars || [])
  }

  /**
   * 保存json文件
   */
  save () {
    let ret = Data.getData(this, 'uid,name,level,word,face,card,sign,info,_info,_mys,_profile')
    ret.avatars = {}
    this.forEachAvatar((avatar) => {
      ret.avatars[avatar.id] = avatar.toJSON()
    })
    // 暂时保留旧数据，防止异常情况
    if (this._chars) {
      ret.chars = this._chars
    }
    Data.writeJSON(`/data/UserData/${this.uid}.json`, ret, '', 'root')
  }

  del () {
    try {
      Data.delFile(`/data/UserData/${this.uid}.json`, 'root')
      ProfileRank.delUidInfo(this.uid)
      this._delCache()
      Bot.logger.mark(`【面板数据删除】${this.uid}本地文件数据已删除...`)
    } catch (e) {
      console.log('del error', e)
    }
    return true
  }

  /**
   * 设置玩家基础数据
   * @param ds
   */
  setBasicData (ds) {
    this.name = ds.name || this.name || ''
    this.level = ds.level || this.level || ''
    this.word = ds.word || this.word || ''
    this.face = ds.face || this.face || ''
    this.card = ds.card || this.card || ''
    this.sign = ds.sign || this.sign || ''
    this.info = ds.info || this.info || false
    this._avatars = this._avatars || {}
    this._profile = ds._profile || this._profile
    this._mys = ds._mys || this._mys
    this._info = ds._info || this._info
  }

  // 设置角色列表
  setAvatars (ds) {
    lodash.forEach(ds, (avatar) => {
      this.setAvatar(avatar)
    })
  }

  // 设置角色数据
  setAvatar (ds, source = '') {
    let avatar = this.getAvatar(ds.id, true)
    avatar.setAvatar(ds, source)
  }

  // 获取Avatar角色
  getAvatar (id, create = false) {
    let char = Character.get(id)
    let avatars = this._avatars
    // 兼容处理旅行者的情况
    if (char.isTraveler && !create) {
      id = avatars['10000005'] ? 10000005 : 10000007
    }
    if (!avatars[id] && create) {
      avatars[id] = AvatarData.create({ id })
    }
    return avatars[id] || false
  }

  // 异步循环角色
  async forEachAvatarAsync (fn) {
    for (let id in this._avatars) {
      let ret = await fn(this._avatars[id], id)
      if (ret === false) {
        return false
      }
    }
  }

  // 循环Avatar
  forEachAvatar (fn) {
    for (let id in this._avatars) {
      let avatar = this._avatars[id]
      if (avatar && avatar.hasData) {
        let ret = fn(this._avatars[id])
        if (ret === false) {
          return false
        }
      }
    }
  }

  // 获取所有Avatar数据
  getAvatarData (ids = '') {
    let ret = {}
    if (!ids) {
      this.forEachAvatar((avatar) => {
        ret[avatar.id] = avatar.getDetail()
      })
    } else {
      lodash.forEach(ids, (id) => {
        let avatar = this.getAvatar(id)
        if (avatar) {
          ret[id] = avatar.getDetail()
        }
      })
    }
    return ret
  }

  // 获取指定角色的面板数据
  getProfile (id) {
    let avatar = this.getAvatar(id)
    return avatar ? avatar.getProfile() : false
  }

  // 获取所有面板数据
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

  getUpdateTime () {
    let ret = {}
    if (this._profile) {
      ret.profile = MysAvatar.getDate(this._profile)
    }
    if (this._mys) {
      ret.mys = MysAvatar.getDate(this._mys)
    }
    return ret
  }

  getInfo () {
    return MysAvatar.getInfo(this)
  }

  // 更新面板
  async refreshProfile (force = 2) {
    return await Profile.refreshProfile(this, force)
  }

  // 更新米游社数据
  /**
   * 更新米游社数据
   * @param force: 0:不强制，长超时时间 1：短超时时间 2：无视缓存，强制刷新
   * @returns {Promise<boolean>}
   */
  async refreshMysDetail (force = 0) {
    return MysAvatar.refreshMysDetail(this, force)
  }

  async refreshMysInfo (force = 0) {
    return await MysAvatar.refreshMysInfo(this, force)
  }

  // 通过已有的Mys CharData更新
  setMysCharData (charData) {
    MysAvatar.setMysCharData(this, charData)
  }

  // 使用MysApi刷新指定角色的天赋信息
  async refreshTalent (ids = '', force = 0) {
    return await MysAvatar.refreshTalent(this, ids, force)
  }

  async refresh (cfg) {
    if (cfg.index || cfg.index === 0) {
      await this.refreshMysInfo(cfg.index)
    }
    if (cfg.detail || cfg.detail === 0) {
      await this.refreshMysDetail(cfg.detail)
    }
    if (cfg.talent || cfg.talent === 0) {
      await this.refreshTalent(cfg.ids, cfg.talent)
    }
    if (cfg.profile || cfg.profile === 0) {
      await this.refreshProfile(cfg.profile)
    }
  }

  async refreshAndGetAvatarData (cfg) {
    await this.refresh(cfg)

    let rank = false
    let e = this.e
    if (cfg.rank === true && e && e.group_id) {
      rank = await ProfileRank.create({ group: e.group_id, uid: this.uid, qq: e.user_id })
    }

    let avatarRet = {}
    this.forEachAvatar((avatar) => {
      let { talent } = avatar
      let ds = avatar.getDetail()
      ds.aeq = talent?.a?.original + talent?.e?.original + talent?.q?.original || 3
      avatarRet[ds.id] = ds

      let profile = avatar.getProfile()
      if (profile) {
        let mark = profile.getArtisMark(false)
        ds.artisMark = Data.getData(mark, 'mark,markClass,names')
        if (rank) {
          rank.getRank(profile)
        }
      }
    })
    if (cfg.retType !== 'array') {
      return avatarRet
    }
    avatarRet = lodash.values(avatarRet)
    if (cfg.sort) {
      let sortKey = 'level,star,aeq,cons,weapon.level,weapon.star,weapon.affix,fetter'.split(',')
      avatarRet = lodash.orderBy(avatarRet, sortKey)
      avatarRet = avatarRet.reverse()
    }
    return avatarRet
  }
}
