import MysInfo from '../../genshin/model/mys/mysInfo.js'
import lodash from 'lodash'

class User {
  constructor (cfg) {
    this.id = cfg.id
    this.uid = cfg.uid
    this.cookie = ''
  }

  // 保存用户配置
  async setCfg (path, value) {
    console.log(this.id)
    let userCfg = await redis.get(`genshin:user-cfg:${this.id}`)
    userCfg = userCfg ? JSON.parse(userCfg) : {}
    lodash.set(userCfg, path, value)
    await redis.set(`genshin:user-cfg:${this.id}`, JSON.stringify(userCfg))
  }

  /* 获取用户配置 */
  async getCfg (path, defaultValue) {
    let userCfg = await redis.get(`genshin:user-cfg:${this.id}`)
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
    this.selfUser = new User({ id: e.user_id, uid })
    this.targetUser = {
      uid
    }
    this.e = e
    this.MysApi = MysApi
    e.targetUser = this.targetUser
    e.selfUser = this.selfUser
  }

  async getData (api, data) {
    if (!this.MysApi) {
      return false
    }
    let ret = await MysInfo.get(this.e, api, data)
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
    return true
  }
}

export async function getMysApi (e, cfg) {
  let { auth = 'all' } = cfg
  let uid = await MysInfo.getUid(e)
  if (!uid) return false

  /* 检查user ck */
  let isCookieUser = await MysInfo.checkUidBing(uid)
  if (auth === 'cookie' && !isCookieUser) {
    e.reply('尚未绑定Cookie...')
    return false
  }
  let MysApi = await MysInfo.init(e, 'roleIndex')
  if (!MysApi) {
    return false
  }
  return new Mys(e, uid, MysApi)
}

export async function checkAuth (e, cfg) {
  return new User({ id: e.user_id })
}
