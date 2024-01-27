import { profileHelp } from './profile/ProfileCommon.js'
import { profileArtisList } from './profile/ProfileArtis.js'
import ProfileDetail from './profile/ProfileDetail.js'
import ProfileStat from './profile/ProfileStat.js'
import ProfileList from './profile/ProfileList.js'
import { uploadCharacterImg, delProfileImg, profileImgList } from './character/ImgUpload.js'
import { enemyLv } from './profile/ProfileUtils.js'
import { groupRank, resetRank, refreshRank, manageRank } from './profile/ProfileRank.js'
import { App, Cfg } from '#miao'

let app = App.init({
  id: 'profile',
  name: '角色面板'
})

app.reg({
  profileList: {
    name: '面板角色列表',
    desc: '查看当前已获取面板数据的角色列表',
    fn: ProfileList.render,
    rule: /^#(星铁|原神)?(面板角色|角色面板|面板)(列表)?\s*(\d{9})?$/
  },

  profileDetail: {
    name: '角色面板',
    fn: ProfileDetail.detail,
    rule: /^#*([^#]+)\s*(详细|详情|面板|面版|圣遗物|武器[1-7]?|伤害([1-9]+\d*)?)\s*(\d{9})*(.*[换变改].*)?$/
  },

  profileChange: {
    name: '角色面板计算',
    fn: ProfileDetail.detail,
    rule: /^#.+换.+$/
  },

  groupProfile: {
    name: '群内最强',
    fn: groupRank,
    rule: /^#(星铁|原神)?(群|群内)?(排名|排行)?(最强|最高|最高分|最牛|第一|极限)+.+/
  },

  resetRank: {
    name: '重置排名',
    fn: resetRank,
    rule: /^#(星铁|原神)?(重置|重设)(.*)(排名|排行)$/
  },

  refreshRank: {
    name: '刷新排名',
    fn: refreshRank,
    rule: /^#(星铁|原神)?(刷新|更新|重新加载)(群内|群|全部)*(排名|排行)$/
  },

  manageRank: {
    name: '打开关闭',
    fn: manageRank,
    rule: /^#(开启|打开|启用|关闭|禁用)(群内|群|全部)*(排名|排行)$/
  },

  rankList: {
    name: '面板排名榜',
    fn: groupRank,
    rule: /^#(星铁|原神)?(群|群内)?.+(排名|排行)(榜)?$/
  },

  artisList: {
    name: '面板圣遗物列表',
    fn: profileArtisList,
    rule: /^#圣遗物列表\s*(\d{9})?$/
  },

  profileStat: {
    name: '面板练度统计',
    fn: ProfileStat.stat,
    rule: /^#(面板|喵喵)练度统计$/,
    yzRule: /^#*(我的)*(武器|角色|练度|五|四|5|4|星)+(汇总|统计|列表)(force|五|四|5|4|星)*[ |0-9]*$/,
    yzCheck: () => Cfg.get('profileStat', false)
  },

  talentStat: {
    name: '天赋统计',
    fn: ProfileStat.stat,
    rule: /^#*(我的)*(今日|今天|明日|明天|周.*)?(五|四|5|4|星)?(技能|天赋)+(汇总|统计|列表)?[ |0-9]*$/
  },

  avatarList: {
    name: '角色查询',
    fn: ProfileStat.avatarList,
    rule: /^#喵喵(角色|查询)[ |0-9]*$/,
    yzRule: /^(#(五|四|5|4|星)*(角色|查询|查询角色|角色查询|人物)[ |0-9]*$)|(^(#*uid|#*UID)\+*[1|2|5-9][0-9]{8}$)|(^#[\+|＋]*[1|2|5-9][0-9]{8})/,
    yzCheck: () => Cfg.get('avatarList', false)
  },

  refreshTalent: {
    name: '强制刷新天赋',
    fn: ProfileStat.refreshTalent,
    rule: /^#(强制)?(刷新|更新)(所有|角色)*(天赋|技能)$/
  },

  profileHelp: {
    name: '角色面板帮助',
    fn: profileHelp,
    rule: /^#(角色|换|更换)?面[板版]帮助$/
  },

  enemyLv: {
    name: '敌人等级',
    fn: enemyLv,
    describe: '【#角色】 设置伤害计算中目标敌人的等级',
    rule: /^#(敌人|怪物)等级\s*\d{1,3}\s*$/
  },

  profileRefresh: {
    name: '面板更新',
    describe: '【#角色】 获取游戏橱窗详情数据',
    fn: ProfileList.refresh,
    rule: /^#(星铁|原神)?(全部面板更新|更新全部面板|获取游戏角色详情|更新面板|面板更新)\s*(\d{9})?$/
  },

  uploadImg: {
    name: '上传面板图',
    describe: '【#上传刻晴面板图】 上传角色面板图',
    fn: uploadCharacterImg,
    rule: /^#?\s*(?:上传|添加)(.+)(?:面板图)\s*$/
  },

  delProfile: {
    name: '删除面板图',
    describe: '【#删除刻晴面板图1】 删除指定角色面板图（序号）',
    fn: delProfileImg,
    rule: /^#?\s*(?:移除|清除|删除)(.+)(?:面板图)(\d){1,}\s*$/
  },

  profileImgList: {
    name: '面板图列表',
    describe: '【#刻晴面板图列表】 删除指定角色面板图（序号）',
    fn: profileImgList,
    rule: /^#?\s*(.+)(?:面板图列表)\s*$/
  },

  profileDel: {
    name: '删除面板',
    describe: '【#角色】 删除游戏橱窗详情数据',
    fn: ProfileList.del,
    rule: /^#(删除全部面板|删除面板|删除面板数据)\s*(\d{9})?$/
  },

  profileReload: {
    name: '重新加载面板',
    fn: ProfileList.reload,
    rule: /^#(星铁|原神)?(加载|重新加载|重载)面板\s*(\d{9})?$/
  }
})

export default app
