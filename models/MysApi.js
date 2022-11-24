import { User } from './index.js'
import { Version } from '../components/index.js'

export default class MysApi {
  constructor (e, uid, mysInfo) {
    this.e = e
    this.mysInfo = mysInfo
    this.ckInfo = mysInfo.ckInfo
    this.uid = uid
    e.targetUser = this.targetUser
    e.selfUser = this.selfUser
    e.isSelfCookie = this.isSelfCookie
  }

  static async init (e, cfg = 'all') {
    if (!e.runtime) {
      Version.runtime()
      return false
    }
    if (typeof (cfg) === 'string') {
      cfg = { auth: cfg }
    }
    let { auth = 'all' } = cfg
    let mys = false
    mys = await e.runtime.getMysInfo(auth)
    if (!mys) {
      return false
    }
    let uid = mys.uid
    e._mys = new MysApi(e, uid, mys)
    return e._mys
  }

  static async initUser (e, cfg = 'all') {
    if (!e.runtime) {
      Version.runtime()
      return false
    }
    if (typeof (cfg) === 'string') {
      cfg = { auth: cfg }
    }
    let uid = e.runtime?.uid
    if (uid) {
      return new User({ id: e.user_id, uid: uid })
    }
    return false
  }

  get isSelfCookie () {
    return this.uid * 1 === this.ckUid * 1 || this?.mysInfo?.isSelf
  }

  get ckUid () {
    return this.ckInfo.uid
  }

  get ck () {
    return this.ckInfo.ck
  }

  get selfUser () {
    return new User({ id: this.e.user_id, uid: this.uid })
  }

  get targetUser () {
    return new User({ id: this.e.user_id, uid: this.uid })
  }

  async getMysApi (e, targetType = 'all', option = {}) {
    if (this.mys) {
      return this.mys
    }
    this.mys = await e.runtime.getMysApi(targetType, option)
    return this.mys
  }

  async getData (api, data) {
    if (!this.mysInfo) {
      return false
    }
    let e = this.e
    let mys = await this.getMysApi(e, api, { log: false })
    // 暂时先在plugin侧阻止错误，防止刷屏
    e._original_reply = e._original_reply || e.reply
    e._reqCount = e._reqCount || 0
    e.reply = function (msg) {
      if (!e._isReplyed) {
        e._isReplyed = true
        return e._original_reply(msg)
      } else {
        // console.log('请求错误')
      }
    }
    e._reqCount++
    let ret = await mys.getData(api, data)
    e._reqCount--
    if (e._reqCount === 0) {
      e.reply = e._original_reply
    }
    if (!ret) {
      return false
    }
    return ret.data || ret
  }

  // 获取角色信息
  async getCharacter () {
    return await this.getData('character')
  }

  // 获取角色详情
  async getAvatar (id) {
    return await this.getData('detail', { avatar_id: id })
  }

  // 首页宝箱信息
  async getIndex () {
    return await this.getData('index')
  }

  // 获取深渊信息
  async getSpiralAbyss (type = 1) {
    return await this.getData('spiralAbyss', { schedule_type: type })
  }

  async getDetail (id) {
    return await this.getData('detail', { avatar_id: id })
  }

  async getCompute (data) {
    return await this.getData('compute', data)
  }

  async getAvatarSkill (id) {
    return await this.getData('avatarSkill', { avatar_id: id })
  }
}
