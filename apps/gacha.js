import { App } from '../components/index.js'
import Gacha from './gacha/Gacha.js'

let app = App.init({
  id: 'gacha',
  name: '抽卡统计'
})
app.reg({
  detail: {
    name: '抽卡记录',
    fn: Gacha.detail,
    rule: /^#*(抽卡|抽奖|角色|武器|常驻|up)池*(记录|祈愿|分析)$/
  },
  stat: {
    name: '抽卡统计',
    fn: Gacha.stat,
    rule: /^#*(全部|抽卡|抽奖|角色|武器|常驻|up|版本)池*统计$/
  }
})

export default app
