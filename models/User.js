/*
* User Class
* 提供用户实例相关的操作方法
* */
import Base from './Base.js'
import lodash from 'lodash'

/* User Class Model

* 所有用户实例均可调用实例方法
* */
class User extends Base {
  // 初始化用户
  constructor (cfg) {
    super()
    if (!cfg.id) {
      return false
    }
    let self = this._getCache(`user:${cfg.id}`)
    if (!self) {
      self = this
    }
    self.id = cfg.id
    self.uid = cfg.uid || self.uid || ''
    self.ck = cfg.ck || cfg.cookie || self.ck || ''
    return self._cache()
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

  get cookie () {
    return this.ck || ''
  }

  static async get (e) {
    if (e.user_id) {
      return new User({ id: e.user_id })
    }
  }

  static async checkAuth (e, type = 'all') {
    let user = await User.get(e)
    if (type === 'master') {
      return false
    }
    return user
  }
}

export default User
