/**
 * 用户数据文件
 * 数据存储在/data/UserData/${uid}.json 下
 * 兼容处理面板户数及Mys数据
 *
 */
import lodash from 'lodash'
import Base from './Base.js'
import { Data } from '#miao'
import { Avatar, ProfileRank, Character } from './index.js'

import MysAvatar from './avatar/MysAvatar.js'
import ProfileAvatar from './avatar/ProfileAvatar.js'

Data.createDir('/data/UserData', 'root')
Data.createDir('/data/PlayerData/gs', 'root')
Data.createDir('/data/PlayerData/sr', 'root')

export default class Player extends Base {
  constructor (uid, game = 'gs') {
    super()
    uid = uid?._mys?.uid || uid?.uid || uid
    if (!uid) {
      return false
    }
    let cacheObj = this._getCache(`player:${game}:${uid}`)
    if (cacheObj) {
      return cacheObj
    }
    this.uid = uid
    this.game = game
    this.reload()
    return this._cache(100)
  }

  get hasProfile () {
    let ret = false
    this.forEachAvatar((avatar) => {
      if (avatar.isProfile) {
        ret = true
        return false
      }
    })
    return ret
  }

  get _file () {
    return `/data/PlayerData/${this.game}/${this.uid}.json`
  }

  // 玩家头像
  get faceImgs () {
    let char
    if (this.isGs && this.face) {
      char = Character.get(this.face)
    }
    if (!char) {
      let charId = lodash.keys(this._avatars)[0]
      if (charId) {
        char = Character.get(charId)
      }
    }
    let imgs = char?.imgs || {}
    return {
      face: imgs.face || '/common/item/face.webp',
      banner: imgs.banner || `/meta-${this.game}/character/common/imgs/banner.webp`
    }
  }

  static create (e, game = 'gs') {
    if (e?._mys?.uid || e.uid) {
      // 传入为e
      let player = new Player(e?._mys?.uid || e.uid, (game === 'sr' || e.isSr) ? 'sr' : 'gs')
      player.e = e
      return player
    } else {
      return new Player(e, game)
    }
  }

  // 获取面板更新服务名
  static getProfileServName (uid, game = 'gs') {
    return ProfileAvatar.getServ(uid, game)?.name
  }

  static delByUid (uid, game = 'gs') {
    let player = Player.create(uid, game)
    if (player) {
      player.del()
    }
  }

  /**
   * 重新加载json文件
   * 注意：为了性能，默认不初始化avatars数据，按需初始化
   * 如需获取avatar请使用 player.getAvatar() 来进行获取以确保初始化
   */
  reload () {
    let data = Data.readJSON(this._file, 'root')
    this.setBasicData(data)
    this.setAvatars(data.avatars || [], true)
    if (data._ck) {
      this._ck = data._ck
    }
    if (!data.avatars) {
      this.save()
    }
  }

  /**
   * 保存json文件
   * @param flag false时暂时禁用保存，true时启用保存，并保存数据
   * @returns {boolean}
   */
  save (flag = null) {
    if (flag === true) {
      this._save = true
    } else if (flag === false || this._save === false) {
      this._save = false
      return false
    }
    let ret = Data.getData(this, 'uid,name,level,word,face,card,sign,info,_info,_mys,_profile')
    ret.avatars = {}
    this.forEachAvatar((avatar) => {
      ret.avatars[avatar.id] = avatar.toJSON()
    })
    if (this._ck) {
      ret._ck = this._ck
    }
    Data.writeJSON(this._file, ret, 'root')
  }

  del () {
    try {
      Data.delFile(this._file, 'root')
      ProfileRank.delUidInfo(this.uid, this.game)
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
  // lazy：是否懒初始化avatar
  setAvatars (ds, lazy = false) {
    lodash.forEach(ds, (avatar) => {
      if (!avatar.id) {
        return true
      }
      if (lazy) {
        this._avatars[avatar.id] = avatar
      } else {
        this.setAvatar(avatar)
      }
    })
  }

  // 设置角色数据
  setAvatar (ds, source = '') {
    let avatar = this.getAvatar(ds.id, true)
    avatar.setAvatar(ds, source)
  }

  delAvatar (id) {
    delete this._avatars[id]
  }

  hasAvatar (id = '') {
    if (!id) {
      return !lodash.isEmpty(this._avatars)
    }
    return !!this._avatars[id]
  }

  getAvatarIds () {
    return lodash.keys(this._avatars)
  }

  // 获取Avatar角色
  getAvatar (id, create = false) {
    let char = Character.get(id)
    let avatars = this._avatars
    if (this.isGs) {
      // 兼容处理旅行者的情况
      if (char.isTraveler && !create) {
        id = avatars['10000005'] ? 10000005 : 10000007
      }
    }

    if (!avatars[id]) {
      if (create) {
        avatars[id] = Avatar.create({ id }, this.game)
      } else {
        return false
      }
    }

    let avatar = avatars[id]
    if (!avatar.isAvatar) {
      let data = avatars[id]
      avatar = avatars[id] = Avatar.create(avatars[id], this.game)
      avatar.setAvatar(data)
    }
    return avatar
  }

  // 循环Avatar
  async forEachAvatar (fn) {
    for (let id in this._avatars) {
      let avatar = this.getAvatar(id)
      if (avatar && avatar.hasData && avatar.game === this.game) {
        let ret = fn(avatar, id)
        ret = Data.isPromise(ret) ? await ret : ret
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
    if (!avatar.isProfile) {
      return false
    }
    return avatar
  }

  // 获取所有面板数据
  getProfiles () {
    let ret = {}
    this.forEachAvatar((avatar) => {
      if (avatar.isProfile) {
        ret[avatar.id] = avatar
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
    return await ProfileAvatar.refreshProfile(this, force)
  }

  // 更新米游社数据
  /**
   * 更新米游社数据
   * @param force 0:不强制，长超时时间 1：短超时时间 2：无视缓存，强制刷新
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

  /**
   * 刷新角色数据
   *
   * @param cfg
   * @param cfg.detail mys-detail数据更新级别，角色列表与详情
   * @param cfg.talent mys-talent数据更新级别，角色天赋数据
   * @param cfg.index mys-index数据更新级别，游戏统计数据
   * @param cfg.profile 刷新面板数据
   * @param cfg.ids 刷新的角色列表
   */

  async refresh (cfg) {
    this.save(false)
    try {
      if (cfg.index || cfg.index === 0) {
        await this.refreshMysInfo(cfg.index)
      }
      if (cfg.detail || cfg.detail === 0) {
        await this.refreshMysDetail(cfg.detail)
      }
      if (cfg.talent || cfg.talent === 0) {
        await this.refreshTalent(cfg.ids || '', cfg.talent)
      }
      if (cfg.profile || cfg.profile === 0) {
        await this.refreshProfile(cfg.profile)
      }
    } catch (e) {
      Bot.logger.mark(`刷新uid${this.uid}数据遇到错误...`)
      console.log(e)
    }
    this.save(true)
  }

  /**
   * 刷新并获取角色数据
   *
   * @param cfg
   * @param cfg.detail mys-detail数据更新级别，角色列表与详情
   * @param cfg.talent mys-talent数据更新级别，角色天赋数据
   * @param cfg.index mys-index数据更新级别，游戏统计数据
   * @param cfg.materials 是否返回角色的材料，默认false
   * @param cfg.retType 返回类型，默认id为key对象，设置为array时返回数组
   * @param cfg.rank 面板数据是否参与群排序
   * @param cfg.sort 返回为数组时，数据是否排序，排序规则：等级、星级、天赋、命座、武器、好感的顺序排序
   * @returns {Promise<any[]|{}>}
   */

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
      if (avatar.isProfile) {
        ds.artisSet = avatar.artis.getSetData()
        let mark = avatar.getArtisMark(false)
        ds.artisMark = Data.getData(mark, 'mark,markClass,names')
        if (rank) {
          rank.getRank(profile)
        }
      }
      if (cfg.materials) {
        ds.materials = avatar.getMaterials()
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
