import lodash from 'lodash'
import Plugin from './common/Plugin.js'
import { Version, MiaoError } from '#miao'

class App {
  constructor (cfg) {
    this.id = cfg.id
    this.cfg = cfg
    this.apps = {}
  }

  reg (key, fn, cfg = {}) {
    if (lodash.isPlainObject(key)) {
      lodash.forEach(key, (cfg, k) => {
        this.reg(k, cfg.fn, cfg)
      })
    } else {
      this.apps[key] = {
        fn,
        ...cfg
      }
    }
  }

  // 获取v3执行方法
  v3App () {
    let cfg = this.cfg || {}
    let rules = []
    let check = []
    let event = cfg.event
    let cls = class extends Plugin {
      constructor () {
        super({
          name: `喵喵:${cfg.name || cfg.id}`,
          dsc: cfg.desc || cfg.name || '喵喵插件',
          event: event === 'poke' ? 'notice.*.poke' : 'message',
          priority: cfg.priority || 50,
          rule: rules
        })
      }

      accept (e) {
        e.original_msg = e.original_msg || e.msg
        for (let idx = 0; idx < check.length; idx++) {
          if (check[idx](e, e.original_msg) === true) {
            return true
          }
        }
      }
    }

    for (let key in this.apps) {
      let app = this.apps[key]
      key = lodash.camelCase(key)
      let rule = app.rule || app.reg || 'noCheck'
      if (event !== 'poke') {
        if (typeof (rule) === 'string') {
          if (rule === 'noCheck') {
            rule = '.*'
          }
        } else {
          rule = lodash.trim(rule.toString(), '/')
        }
      } else {
        rule = '.*'
      }

      rules.push({
        reg: rule,
        fnc: key
      })

      if (app.check) {
        check.push(app.check)
      }

      cls.prototype[key] = async function (e) {
        e = this.e || e
        const self_id = e.self_id || e.bot?.uin || Bot.uin
        if (event === 'poke') {
          if (e.notice_type === 'group') {
            if (e.target_id !== self_id && !e.isPoke) {
              return false
            }
            // group状态下，戳一戳的发起人是operator
            if (e.user_id === self_id) {
              e.user_id = e.operator_id
            }
          }
          e.isPoke = true
          // 随便指定一个不太常见的msg以触发msg的正则
          e.msg = '#poke#'
        }
        e.original_msg = e.original_msg || e.msg
        try {
          return await app.fn.call(this, e)
        } catch (err) {
          if (err?.message && (err instanceof MiaoError)) {
            // 处理 MiaoError
            return e.reply(err.message)
          } else {
            // 其他错误抛出
            throw err
          }
        }
      }

      if (app.yzRule && app.yzCheck) {
        let yzKey = `Yz${key}`
        let yzRule = lodash.trim(app.yzRule.toString(), '/')
        rules.push({
          reg: yzRule,
          fnc: yzKey
        })
        cls.prototype[yzKey] = async function (e) {
          if (!Version.isMiao && !app.yzCheck()) {
            return false
          }
          e = this.e || e
          e.original_msg = e.original_msg || e.msg
          return await app.fn.call(this, e)
        }
      }
    }
    return cls
  }
}

App.init = function (cfg) {
  return new App(cfg)
}

export default App
