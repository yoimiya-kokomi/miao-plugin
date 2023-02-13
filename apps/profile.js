import { App } from '../components/index.js'
import { profileHelp } from './profile/ProfileCommon.js'
import { profileArtisList } from './profile/ProfileArtis.js'
import { profileDetail } from './profile/ProfileDetail.js'
import ProfileStat from './profile/ProfileStat.js'
import ProfileList from './profile/ProfileList.js'
import { uploadCharacterImg, delProfileImg, profileImgList } from './character/ImgUpload.js'
import { enemyLv } from './profile/ProfileUtils.js'
import { groupRank, resetRank, refreshRank, manageRank } from './profile/ProfileRank.js'

let app = App.init({
  id: 'profile',
  name: '角色面板'
})

app.reg({
  profileDetail: {
    rule: /^#*([^#]+)\s*(详细|详情|面板|面版|圣遗物|伤害[1-7]?)\s*(\d{9})*(.*[换变改].*)?$/,
    fn: profileDetail,
    name: '角色面板'
  },

  profileChange: {
    rule: /^#.+换.+$/,
    fn: profileDetail,
    name: '角色面板计算'
  },

  groupProfile: {
    rule: /^#(群|群内)?(排名|排行)?(最强|最高|最高分|最牛|第一)+.+/,
    fn: groupRank,
    name: '群内最强'
  },

  resetRank: {
    rule: /^#(重置|重设)(.*)(排名|排行)$/,
    fn: resetRank,
    name: '重置排名'
  },

  refreshRank: {
    rule: /^#(刷新|更新|重新加载)(群内|群|全部)*(排名|排行)$/,
    fn: refreshRank,
    name: '重置排名'
  },

  manageRank: {
    rule: /^#(开启|打开|启用|关闭|禁用)(群内|群|全部)*(排名|排行)$/,
    fn: manageRank,
    name: '打开关闭'
  },

  rankList: {
    rule: /^#(群|群内)?.+(排名|排行)(榜)?$/,
    fn: groupRank,
    name: '面板排名榜'
  },

  artisList: {
    rule: /^#圣遗物列表\s*(\d{9})?$/,
    fn: profileArtisList,
    name: '面板圣遗物列表'
  },

  profileList: {
    rule: /^#(面板角色|角色面板|面板)(列表)?\s*(\d{9})?$/,
    fn: ProfileList.render,
    name: '面板角色列表',
    desc: '查看当前已获取面板数据的角色列表'
  },

  profileStat: {
    rule: /^#(面板|喵喵|角色|武器|天赋|技能|圣遗物)?练度统计$/,
    fn: ProfileStat.stat,
    name: '面板练度统计'
  },

  avatarList: {
    rule: /^(#(角色|查询|查询角色|角色查询|人物)[ |0-9]*$)|(^(#*uid|#*UID)\+*[1|2|5-9][0-9]{8}$)|(^#[\+|＋]*[1|2|5-9][0-9]{8})/,
    fn: ProfileStat.avatarList,
    name: '角色查询'
  },

  profileHelp: {
    rule: /^#(角色|换|更换)?面[板版]帮助$/,
    fn: profileHelp,
    name: '角色面板帮助'
  },

  enemyLv: {
    rule: /^#(敌人|怪物)等级\s*\d{1,3}\s*$/,
    fn: enemyLv,
    describe: '【#角色】 设置伤害计算中目标敌人的等级'
  },

  profileRefresh: {
    rule: /^#(全部面板更新|更新全部面板|获取游戏角色详情|更新面板|面板更新)\s*(\d{9})?$/,
    fn: ProfileList.refresh,
    describe: '【#角色】 获取游戏橱窗详情数据'
  },

  uploadImg: {
    rule: /^#?\s*(?:上传|添加)(.+)(?:面板图)\s*$/,
    fn: uploadCharacterImg,
    describe: '【#上传刻晴面板图】 上传角色面板图'
  },

  delProfile: {
    rule: /^#?\s*(?:移除|清除|删除)(.+)(?:面板图)(\d){1,}\s*$/,
    fn: delProfileImg,
    describe: '【#删除刻晴面板图1】 删除指定角色面板图（序号）'
  },

  profileImgList: {
    rule: /^#?\s*(.+)(?:面板图列表)\s*$/,
    fn: profileImgList,
    describe: '【#刻晴面板图列表】 删除指定角色面板图（序号）'
  }
})

export default app
