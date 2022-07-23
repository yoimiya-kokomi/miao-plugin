import plugin from '../../../lib/plugins/plugin.js'
import * as Miao from '../apps/index.js'
import { render } from './render.js'
import { checkAuth, getMysApi } from './mys.js'

export class miao extends plugin {
  constructor () {
    super({
      name: 'miao-plugin',
      desc: '喵喵插件',
      event: 'message',
      priority: 50,
      rule: [{
        reg: '.+',
        fnc: 'dispatch'
      }]
    })
  }

  async dispatch (e) {
    let msg = e.raw_message
    e.checkAuth = async function (cfg) {
      return await checkAuth(e, cfg)
    }
    e.getMysApi = async function (cfg) {
      return await getMysApi(e, cfg)
    }
    msg = '#' + msg.replace('#', '')
    for (let fn in Miao.rule) {
      let cfg = Miao.rule[fn]
      if (Miao[fn] && new RegExp(cfg.reg).test(msg)) {
        let ret = await Miao[fn](e, {
          render
        })
        if (ret === true) {
          console.log('ret true')
          return true
        }
      }
    }

    return false
  }
}
