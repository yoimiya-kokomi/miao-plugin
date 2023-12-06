import { App } from '#miao'
import Calendar from './wiki/Calendar.js'
import TodayMaterial from './wiki/TodayMaterial.js'
import CharWiki from './wiki/CharWiki.js'
import CalendarSr from './wiki/CalendarSr.js'

let app = App.init({
  id: 'wiki',
  name: '角色资料'
})
app.reg({
  wiki: {
    rule: '^#喵喵WIKI$',
    check: CharWiki.check,
    fn: CharWiki.wiki,
    desc: '【#资料】 #神里天赋 #夜兰命座'
  },
  calendar: {
    rule: /^(#|喵喵)+(日历|日历列表)$/,
    fn: Calendar.render,
    desc: '【#日历】 原神活动日历'
  },
  calendarSr: {
    rule: /^#(星铁)+(日历|日历列表)$/,
    fn: CalendarSr.render,
    desc: '【#星铁日历】 星铁活动日历'
  },
  today: {
    rule: /^#(今日|今天|每日|我的)*(素材|材料|天赋)[ |0-9]*$/,
    fn: TodayMaterial.render
  }
})

export default app
