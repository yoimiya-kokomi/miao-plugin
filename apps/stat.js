/*
* 胡桃数据库的统计
*
* */
import { ConsStat, AbyssPct } from './stat/AbyssStat.js'
import { AbyssTeam } from './stat/AbyssTeam.js'
import { AbyssSummary } from './stat/AbyssSummary.js'
import { App } from '#miao'

let app = App.init({
  id: 'stat',
  name: '深渊统计'
})

app.reg({
  consStat: {
    rule: /^#(喵喵)?角色(持有|持有率|命座|命之座|.命)(分布|统计|持有|持有率)?$/,
    fn: ConsStat,
    desc: '【#统计】 #角色持有率 #角色5命统计'
  },
  abyssPct: {
    rule: /^#(喵喵)?深渊(第?.{1,2}层)?(角色)?(出场|使用)(率|统计)*$/,
    fn: AbyssPct,
    desc: '【#统计】 #深渊出场率 #深渊12层出场率'
  },
  abyssTeam: {
    rule: /^#深渊(组队|配队|配对)$/,
    fn: AbyssTeam,
    describe: '【#角色】 #深渊组队'
  },
  abyssSummary: {
    rule: /^#*(喵喵|上传|本期)*(深渊|深境|深境螺旋)[ |0-9]*(数据)?$/,
    fn: AbyssSummary,
    desc: '上传深渊'
  }
})
export default app
