import { App } from '../components/index.js'
import { getProfile, profileHelp } from './profile/ProfileCommon.js'
import { profileArtisList } from './profile/ProfileArtis.js'
import { profileDetail } from './profile/ProfileDetail.js'
import { profileStat } from './profile/ProfileStat.js'
import { profileList } from './profile/ProfileList.js'
import { uploadCharacterImg, delProfileImg, profileImgList } from './character/ImgUpload.js'
import { enemyLv } from './profile/ProfileUtils.js'
import { groupRank, resetRank, refreshRank, manageRank } from './profile/ProfileRank.js'

let app = App.init({
  id: 'profile',
  name: '角色面板'
})
app.reg('profile-detail', profileDetail, {
  rule: /^#*([^#]+)\s*(详细|详情|面板|面版|圣遗物|伤害[1-7]?)\s*(\d{9})*(.*[换变改].*)?$/,
  name: '角色面板'
})
app.reg('profile-change', profileDetail, {
  rule: /^#.+换.+$/,
  name: '角色面板计算'
})

app.reg('group-profile', groupRank, {
  rule: /^#(群|群内)?(排名|排行)?(最强|最高|最高分|最牛|第一)+.+/,
  name: '群内最强'
})

app.reg('reset-rank', resetRank, {
  rule: /^#(重置|重设)(.*)(排名|排行)$/,
  name: '重置排名'
})

app.reg('refresh-rank', refreshRank, {
  rule: /^#(刷新|更新|重新加载)(群内|群|全部)*(排名|排行)$/,
  name: '重置排名'
})

app.reg('manage-rank', manageRank, {
  rule: /^#(开启|打开|启用|关闭|禁用)(群内|群|全部)*(排名|排行)$/,
  name: '打开关闭'
})

app.reg('rank-list', groupRank, {
  rule: /^#(群|群内)?.+(排名|排行)(榜)?$/,
  name: '面板排名榜'
})

app.reg('artis-list', profileArtisList, {
  rule: /^#圣遗物列表\s*(\d{9})?$/,
  name: '面板圣遗物列表'
})

app.reg('profile-list', profileList, {
  rule: /^#(面板角色|角色面板|面板)(列表)?\s*(\d{9})?$/,
  name: '面板角色列表',
  desc: '查看当前已获取面板数据的角色列表'
})

app.reg('profile-stat', profileStat, {
  rule: /^#(面板|喵喵|角色|武器|天赋|技能|圣遗物)?练度统计$/,
  name: '面板练度统计'
})
app.reg('avatar-list', profileStat, {
  rule: /^(#(角色|查询|查询角色|角色查询|人物)[ |0-9]*$)|(^(#*uid|#*UID)\+*[1|2|5-9][0-9]{8}$)|(^#[\+|＋]*[1|2|5-9][0-9]{8})/,
  name: '角色查询'
})

app.reg('profile-help', profileHelp, {
  rule: /^#(角色|换|更换)?面[板版]帮助$/,
  name: '角色面板帮助'
})

app.reg('enemy-lv', enemyLv, {
  rule: /^#(敌人|怪物)等级\s*\d{1,3}\s*$/,
  describe: '【#角色】 设置伤害计算中目标敌人的等级'
})

app.reg('profile-refresh', getProfile, {
  rule: /^#(全部面板更新|更新全部面板|获取游戏角色详情|更新面板|面板更新)\s*(\d{9})?$/,
  describe: '【#角色】 获取游戏橱窗详情数据'
})

app.reg('upload-img', uploadCharacterImg, {
  rule: /^#?\s*(?:上传|添加)(.+)(?:面板图)\s*$/,
  describe: '【#上传刻晴面板图】 上传角色面板图'
})
app.reg('del-profile', delProfileImg, {
  rule: /^#?\s*(?:移除|清除|删除)(.+)(?:面板图)(\d){1,}\s*$/,
  describe: '【#删除刻晴面板图1】 删除指定角色面板图（序号）'
})
app.reg('profile-img-list', profileImgList, {
  rule: /^#?\s*(.+)(?:面板图列表)\s*$/,
  describe: '【#刻晴面板图列表】 删除指定角色面板图（序号）'
})

export default app
