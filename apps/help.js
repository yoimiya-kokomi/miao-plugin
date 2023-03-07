import Help from './help/Help.js'
import { App } from '#miao'

let app = App.init({
  id: 'help',
  name: '喵喵帮助',
  desc: '喵喵帮助'
})

app.reg({
  help: {
    rule: /^#?(喵喵)?(命令|帮助|菜单|help|说明|功能|指令|使用说明)$/,
    fn: Help.render,
    desc: '【#帮助】 #喵喵帮助'
  },
  version: {
    rule: /^#?喵喵版本$/,
    fn: Help.version,
    desc: '【#帮助】 喵喵版本介绍'
  }
})

export default app
