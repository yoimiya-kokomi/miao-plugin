import * as Miao from '../apps/index.js'
import { checkAuth, getMysApi } from './mys.js'
import { plugin } from './index.js'

export class miao extends plugin {
  constructor () {
    let rule = {
      reg: '.+',
      fnc: 'dispatch'
    }
    super({
      name: 'miao-plugin',
      desc: '喵喵插件',
      event: 'message',
      priority: 50,
      rule: [rule]
    })
    Object.defineProperty(rule, 'log', {
      get: () => !!this.isDispatch
    })
  }

  accept () {
    this.e.original_msg = this.e.original_msg || this.e.msg
  }

  async dispatch (e) {
    let msg = e.original_msg || ''
    if (!msg) {
      return false
    }
    e.checkAuth = async function (cfg) {
      return await checkAuth(e, cfg)
    }
    e.getMysApi = async function (cfg) {
      return await getMysApi(e, cfg)
    }
    for (let fn in Miao.rule) {
      let cfg = Miao.rule[fn]
      if (Miao[fn] && new RegExp(cfg.reg).test(msg)) {
        let ret = await Miao[fn](e, {})
        if (ret === true) {
          this.isDispatch = true
          return true
        }
      }
    }
    return false
  }
}
