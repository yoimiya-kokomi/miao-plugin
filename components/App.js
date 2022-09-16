import { plugin } from '../adapter/index.js'

class App {
  constructor (cfg) {
    this.id = cfg.id
    this.cfg = cfg
    this.apps = {}
  }

  reg (key, fn, cfg = {}) {
    //TODO: 参数校验
    this.apps[key] = {
      fn,
      ...cfg
    }
  }

  getPlugins () {
    let cfg = this.cfg || {}
    let rule = this.getV3Rule()
    let cls = class extends plugin {
      constructor () {
        super({
          name: `喵喵:${cfg.name || cfg.id}`,
          desc: cfg.desc || '喵喵插件',
          event: 'message',
          priority: 50,
          rule
        })
      }

      async app (e) {
      }
    }
    cls.test = 1
    return cls
  }

  // 获取v2版rule
  rule () {
    let cfg = this.cfg
    return {
      reg: 'noCheck',
      describe: cfg.desc || '',
      priority: 50,
      hashMark: true
    }
  }

  // v2执行方法
  v2 (e) {
    let apps = this.apps
    return async function (e) {
      let msg = e.original_msg || e.msg || ''
      for (let key in apps) {
        let app = apps[key]
        let rule = app.rule || app.reg || 'noCheck'
        if (app.rule) {
          if (typeof (rule) === 'string') {
            if (rule === '#poke#') {
              continue
            } else if (rule === 'noCheck') {
              rule = /.*/
            }
            rule = new RegExp(rule)
          }
          if (rule.test(msg)) {
            let ret = await app.fn(e, {})
            if (ret === true) {
              return true
            }
          }
        }
      }
      return false
    }
  }
}

App.init = function (cfg) {
  return new App(cfg)
}

export default App
