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
    rule: /^#*(星铁)?喵喵(抽卡|抽奖|角色|武器|光锥|常驻|集录|up)+池?(记录|祈愿|分析)$/,
    yzRule: /^#*(星铁)?(抽卡|抽奖|角色|武器|光锥|常驻|集录|up)+池?(记录|祈愿|分析)$/,
    yzCheck: () => Cfg.get('gachaStat', false)
  },
  stat: {
    name: '抽卡统计',
    fn: Gacha.stat,
    rule: /^#*(星铁)?喵喵(全部|抽卡|抽奖|角色|武器|光锥|常驻|集录|up|版本)+池?统计$/,
    yzRule: /^#*(星铁)?(全部|抽卡|抽奖|角色|武器|光锥|常驻|集录|up|版本)+池?统计$/,
    yzCheck: () => Cfg.get('gachaStat', false)
  },
  info: {
    name: '卡池信息',
    fn: Gacha.info,
    rule: /^#(星铁)?((?:\d+\.)+\d+)(上半|下半)?卡池$/
  },
  help: {
    name: '卡池查询帮助',
    fn: Gacha.help,
    rule: /^#(星铁)?卡池(帮助)?$/
  },
  infoByItem: {
    name: '卡池角色/武器查询',
    fn: Gacha.infoByItem,
    rule: /^#(星铁)?(.+?)卡池(详情|详细)?$/
  }
})

export default app
