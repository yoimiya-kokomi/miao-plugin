import lodash from 'lodash'
import { MysInfo } from './index.js'

class User {
  constructor (cfg) {
    this.id = cfg.id
    this.uid = cfg.uid
    this.cookie = ''
  }

  // 保存用户配置
  async setCfg (path, value) {
    let userCfg = await redis.get(`miao:user-cfg:${this.id}`) || await redis.get(`genshin:user-cfg:${this.id}`)
    userCfg = userCfg ? JSON.parse(userCfg) : {}
    lodash.set(userCfg, path, value)
    await redis.set(`miao:user-cfg:${this.id}`, JSON.stringify(userCfg))
  }

  /* 获取用户配置 */
  async getCfg (path, defaultValue) {
    let userCfg = await redis.get(`miao:user-cfg:${this.id}`) || await redis.get(`genshin:user-cfg:${this.id}`)
    userCfg = userCfg ? JSON.parse(userCfg) : {}
    return lodash.get(userCfg, path, defaultValue)
  }

  async getMysUser () {
    return {
      uid: this.uid
    }
  }
}

class Mys {
  constructor (e, uid, MysApi) {
    let ckUid = MysApi.ckInfo?.uid
    this.selfUser = new User({ id: e.user_id, uid })
    this.targetUser = this.selfUser
    this.e = e
    this.MysApi = MysApi

    e.targetUser = this.targetUser
    e.selfUser = this.selfUser
    e.isSelfCookie = uid * 1 === ckUid * 1
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

  get isSelfCookie () {
    return this.e.isSelfCookie
  }
}

export async function getMysApi (e, cfg) {
  let { auth = 'all' } = cfg
  let MysApi = await MysInfo.init(e, 'roleIndex')
  if (!MysApi) {
    return false
  }
  let uid = MysApi.uid
  let ckUid = MysApi.ckInfo?.uid
  /* 检查user ck */
  if (auth === 'cookie') {
    let isCookieUser = await MysInfo.checkUidBing(uid)
    if (!isCookieUser || uid !== ckUid) {
      e.reply('尚未绑定Cookie...')
      return false
    }
  }
  return new Mys(e, uid, MysApi)
}

export async function checkAuth (e, cfg) {
  let { auth = 'all' } = cfg
  let uid = await MysInfo.getUid(e)
  if (!uid) return false

  if (auth === 'master' && !e.isMaster) {
    return false
  }

  /* 检查user ck */
  if (auth === 'cookie') {
    let isCookieUser = await MysInfo.checkUidBing(uid)
    if (!isCookieUser) {
      e.reply('尚未绑定Cookie...')
      return false
    }
  }

  e.selfUser = new User({ id: e.user_id, uid })
  return e.selfUser
}
