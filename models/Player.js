/**
 * 用户数据文件
 */
import lodash from 'lodash'
import Base from './Base.js'
import { Data } from '../components/index.js'
import { AvatarData, ProfileRank } from './index.js'

import MysAvatar from './player-lib/MysAvatar.js'
import Profile from './player-lib/Profile.js'

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
    lodash.forEach(this._avatars, (ds) => {
      ret.avatars[ds.id] = ds.toJSON()
    })
    // 暂时保留旧数据，防止异常情况
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
    let avatar = this.getAvatar(ds.id)
    avatar.setAvatar(ds, source)
  }

  // 获取Avatar角色
  getAvatar (id) {
    if (!this._avatars[id]) {
      this._avatars[id] = AvatarData.create({ id })
    }
    return this._avatars[id]
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
      let ret = fn(this._avatars[id], id)
      if (ret === false) {
        return false
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
        ret[id] = this.getAvatar(id)
      })
    }
    return ret
  }

  // 获取指定角色的面板数据
  getProfile (id) {
    let avatar = this.getAvatar(id)
    return avatar.getProfile()
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

  getInfo () {
    let ret = {
      ...(this.info || {}),
      statMap: {
        achievement: '成就数',
        commonChest: '普通宝箱',
        exquisiteChest: '精致宝箱',
        preciousChest: '珍贵宝箱',
        luxuriousChest: '豪华宝箱'
      }
    }
    if (ret?.stats?.activeDay) {
      let num = ret?.stats?.activeDay
      let year = Math.floor(num / 365)
      let month = Math.floor((num % 365) / 30.41)
      let day = Math.floor((num % 365) % 30.41)
      let msg = ''
      if (year > 0) {
        msg += year + '年'
      }
      if (month > 0) {
        msg += month + '个月'
      }
      if (day > 0) {
        msg += day + '天'
      }
      ret.activeDay = msg
    }
    return ret
  }

  // 更新面板
  async refreshProfile (force = true) {
    return await Profile.refreshProfile(this, force)
  }

  // 更新米游社数据
  async refreshMysAvatar (force = false) {
    return MysAvatar.refreshMysAvatar(this, force)
  }

  async refreshMysInfo (force = false) {
    return await MysAvatar.refreshMysInfo(this, force)
  }

  // 通过已有的Mys CharData更新
  setMysCharData (charData) {
    MysAvatar.setMysCharData(this, charData)
  }

  // 使用MysApi刷新指定角色的天赋信息
  async refreshTalent (ids = '', force = false) {
    return await MysAvatar.refreshTalent(this, ids, force)
  }

  // 获取面板更新服务名
  static getProfileServName (uid) {
    let Serv = Profile.getServ(uid)
    return Serv.name
  }

  async refreshAndGetAvatarData (cfg) {
    // 更新角色信息
    await this.refreshMysAvatar(cfg.force)

    // 更新天赋信息
    if (cfg.refreshTalent !== false) {
      await this.refreshTalent(cfg.ids, cfg.force)
    }

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
