import { User } from './index.js'
import MysInfo from './mys-lib/MysInfo.js'

export default class MysApi {
  constructor (e, uid, MysApi) {
    this.e = e
    this.MysApi = MysApi
    this.ckInfo = MysApi.ckInfo
    this.uid = uid
    e.targetUser = this.targetUser
    e.selfUser = this.selfUser
    e.isSelfCookie = this.isSelfCookie
  }

  static async init (e, cfg = 'all') {
    if (typeof (cfg) === 'string') {
      cfg = { auth: cfg }
    }
    let { auth = 'all' } = cfg
    let mys = await MysInfo.init(e, 'roleIndex')
    if (!mys) {
      return false
    }
    let uid = mys.uid
    let ckUid = mys.ckInfo?.uid
    /* 检查user ck */
    if (auth === 'cookie') {
      let isCookieUser = await MysInfo.checkUidBing(uid)
      if (!isCookieUser || uid !== ckUid) {
        e.reply('尚未绑定Cookie...')
        return false
      }
    }
    e._mys = new MysApi(e, uid, mys)
    return e._mys
  }

  static async initUser (e, cfg = 'all') {
    if (typeof (cfg) === 'string') {
      cfg = { auth: cfg }
    }
    let uid = await MysInfo.getUid(e)
    if (uid) {
      return new User({ id: e.user_id, uid: uid })
    }
    return false
  }

  get isSelfCookie () {
    return this.uid * 1 === this.ckUid * 1
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

  async getData (api, data) {
    if (!this.MysApi) {
      return false
    }
    let e = this.e
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
    let ret = await MysInfo.get(this.e, api, data)
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
