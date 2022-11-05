/*
* 用户角色列表
*
* 批量管理及天赋等数据获取
* 使用 Avatar Model实现兼容处理面板数据及Mys角色数据
* */
import Base from './Base.js'
import lodash from 'lodash'
import { Data, Common, Profile } from '../components/index.js'
import { Avatar, MysApi } from './index.js'

export default class AvatarList extends Base {
  constructor (uid, datas = [], withProfile = false) {
    super()
    if (!uid) {
      return false
    }
    this.uid = uid
    let avatars = {}
    let profiles = {}
    if (withProfile) {
      profiles = Profile.getAll(uid)
    }
    lodash.forEach(datas, (ds) => {
      let avatar = new Avatar(ds, profiles[ds.id] || false)
      if (avatar) {
        avatars[avatar.id] = avatar
      }
    })
    // 使用面板数据补全
    lodash.forEach(profiles, (profile) => {
      if (!avatars[profile.id]) {
        let avatar = new Avatar(profile)
        if (avatar) {
          avatars[avatar.id] = avatar
        }
      }
    })
    this.avatars = avatars
  }

  getData (ids, keys = '') {
    let rets = {}
    keys = keys || 'id,name,level,star,cons,fetter,elem,face,side,gacha,abbr,weapon,artisSet'
    let avatars = this.avatars
    lodash.forEach(ids, (id) => {
      rets[id] = avatars[id].getData(keys) || {}
    })
    return rets
  }

  getAvatar (id) {
    return this.avatars[id]
  }

  getProfile (id) {
    return this.avatars[id]?.profile
  }

  getIds () {
    let rets = []
    lodash.forEach(this.avatars, (ds) => {
      rets.push(ds.id)
    })
    return rets
  }

  async getTalentData (ids = '', mys = false, keys = '') {
    if (!ids) {
      ids = this.getIds()
    }
    mys = mys || this._mys
    let avatarTalent = await Data.getCacheJSON(`miao:avatar-talent:${this.uid}`)
    let needReq = {}
    lodash.forEach(ids, (id) => {
      if (!avatarTalent[id] || !avatarTalent[id]?.a) {
        needReq[id] = true
      }
    })
    let avatars = this.avatars
    let needReqIds = lodash.keys(needReq)
    if (needReqIds.length > 0) {
      if (needReqIds.length > 8) {
        this.e && this.e.reply('正在获取角色信息，请稍候...')
      }
      let num = 10
      let ms = 100
      let skillRet = []
      let avatarArr = lodash.chunk(needReqIds, num)
      for (let val of avatarArr) {
        for (let id of val) {
          let avatar = avatars[id]
          skillRet.push(await avatar.getTalent(mys))
        }
        skillRet = await Promise.all(skillRet)
        skillRet = skillRet.filter(item => item.id)
        await Common.sleep(ms)
      }
      lodash.forEach(skillRet, (talent) => {
        avatarTalent[talent.id] = talent
      })
      await Data.setCacheJSON(`miao:avatar-talent:${this.uid}`, avatarTalent, 3600 * 2)
    }
    let ret = this.getData(ids, keys)
    lodash.forEach(ret, (avatar, id) => {
      avatar.talent = avatarTalent[id] || {}
    })
    return ret
  }

  get isSelfCookie () {
    return !!this._mys?.isSelfCookie
  }
}

AvatarList.hasTalentCache = async function (uid) {
  return !!await redis.get(`miao:avatar-talent:${uid}`)
}

AvatarList.getAll = async function (e, mys = false) {
  if (!mys) {
    mys = await MysApi.init(e)
  }
  if (!mys || !mys.uid) return false
  let uid = mys.uid
  let data = await mys.getCharacter()
  if (!data) {
    return false
  }
  let ret = new AvatarList(uid, data.avatars, true)
  ret.e = e
  ret._mys = mys
  return ret
}
