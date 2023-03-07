import Gacha from './gacha/Gacha.js'
import { App, Cfg } from '#miao'

let app = App.init({
  id: 'gacha',
  name: '抽卡统计'
})
app.reg({
  detail: {
    name: '抽卡记录',
    fn: Gacha.detail,
    rule: /^#*喵喵(抽卡|抽奖|角色|武器|常驻|up)+池?(记录|祈愿|分析)$/,
    yzRule: /^#*(抽卡|抽奖|角色|武器|常驻|up)+池?(记录|祈愿|分析)$/,
    yzCheck: () => Cfg.get('gachaStat', false)
  },
  stat: {
    name: '抽卡统计',
    fn: Gacha.stat,
    rule: /^#*喵喵(全部|抽卡|抽奖|角色|武器|常驻|up|版本)+池?统计$/,
    yzRule: /^#*(全部|抽卡|抽奖|角色|武器|常驻|up|版本)+池?统计$/,
    yzCheck: () => Cfg.get('gachaStat', false)

  }
})

export default app
