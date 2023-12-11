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

  // #神里天赋 #夜兰命座
  wiki: {
    rule: '^#喵喵WIKI$',
    check: CharWiki.check,
    fn: CharWiki.wiki
  },

  // #日历
  calendar: {
    rule: /^(#|喵喵)+(日历|日历列表)$/,
    fn: Calendar.render
  },

  // *日历
  calendarSr: {
    rule: /^#(星铁)+(日历|日历列表)$/,
    fn: CalendarSr.render
  },

  // #今日素材
  today: {
    rule: /^#(今日|今天|每日|我的)*(素材|材料|天赋)[ |0-9]*$/,
    fn: TodayMaterial.render
  }
})

export default app
