import lodash from 'lodash'
import Base from '../Base.js'
import { Data } from '#miao'

let { sysCfg, diyCfg } = await Data.importCfg('profile')

export default class ProfileServ extends Base {

  constructor (cfg) {
    super()
    this._name = cfg.name
    this.cfgKey = cfg.cfgKey || cfg.id
    this.diyCfg = diyCfg[this.cfgKey] || {}
    this.sysCfg = sysCfg[this.cfgKey] || {}
    this._cfg = cfg
  }

  get name () {
    let url = this.getCfg('url')
    return this._name || url.replace('https://', '').replace('/', '').trim()
  }

  // 获取当前面板服务配置
  getCfg (key, def = '') {
    if (!lodash.isUndefined(this.diyCfg[key])) {
      return this.diyCfg[key]
    }
    if (!lodash.isUndefined(this.sysCfg[key])) {
      return this.sysCfg[key]
    }
    return def
  }

  // 请求当前面板服务
  async getReqParam (uid, game = 'gs') {
    let url = this.getCfg('url')
    let profileApi = this.getCfg('listApi')
    let cfg = this._cfg

    let api = profileApi({
      url,
      uid: uid,
      diyCfg: this.diyCfg,
      game
    })
    let param = {}

    // 获取请求参数
    if (cfg.request) {
      param = await cfg.request.call(this, api)
    }

    return {
      url: param.api || api,
      params: param.params || {}
    }
  }

  async response (data, req, game = 'gs') {
    // 处理返回
    let cfg = this._cfg
    if (cfg.response) {
      return await cfg.response.call(this, data, req, game)
    }
  }

  execFn (fn, args = [], def = false) {
    let { _cfg } = this
    if (_cfg[fn]) {
      return _cfg[fn].apply(this, args)
    }
    return def
  }

  getCdTime (data) {
    const requestInterval = diyCfg.requestInterval || sysCfg.requestInterval || 5
    let cdTime = requestInterval * 60
    return Math.max(cdTime, this.execFn('cdTime', [data], 60))
  }

  updatePlayer (player, data) {
    return this.execFn('updatePlayer', [player, data], {})
  }
}
