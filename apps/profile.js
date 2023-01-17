import { Common, App, Data } from '../components/index.js'
import { Character } from '../models/index.js'
import { getTargetUid, getProfile, profileHelp } from './profile/ProfileCommon.js'
import { profileArtis, profileArtisList } from './profile/ProfileArtis.js'
import { renderProfile } from './profile/ProfileDetail.js'
import { profileStat } from './profile/ProfileStat.js'
import { profileList } from './profile/ProfileList.js'
import { uploadCharacterImg, delProfileImg, profileImgList } from './character/ImgUpload.js'
import { enemyLv } from './profile/ProfileUtils.js'
import ProfileChange from './profile/ProfileChange.js'
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
  rule: /^#面板练度统计$/,
  name: '面板练度统计$'
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
/**
 app.reg('del-uidflie', delProfile, {
  rule: /^#?\s*(?:移除|清除|删除)面板数据$/,
  describe: '【#删除面板数据】 删除面板数据'
})
 */

export default app

export async function delProfile (e) {
  let uid = await getTargetUid(e)
  if (!uid) {
    return true
  }
  if (Data.delfile(`data/UserData/${uid}.json`)) {
    e.reply(`uid:${uid}缓存面板数据已删除~`)
  }
  return true
}

// 查看当前角色
export async function profileDetail (e) {
  let msg = e.original_msg || e.msg
  if (!msg) {
    return false
  }
  if (!/详细|详情|面板|面版|圣遗物|伤害|换/.test(msg)) {
    return false
  }
  let mode = 'profile'
  let profileChange = false
  let changeMsg = msg
  let pc = ProfileChange.matchMsg(msg)
  if (pc && pc.char && pc.change) {
    e.uid = pc.uid || e.runtime.uid
    profileChange = ProfileChange.getProfile(e.uid, pc.char, pc.change)
    if (profileChange && profileChange.char) {
      msg = `#${profileChange.char?.name}${pc.mode || '面板'}`
      e._profile = profileChange
      e._profileMsg = changeMsg
    }
  }
  let uidRet = /[0-9]{9}/.exec(msg)
  if (uidRet) {
    e.uid = uidRet[0]
    msg = msg.replace(uidRet[0], '')
  }

  let name = msg.replace(/#|老婆|老公/g, '').trim()
  msg = msg.replace('面版', '面板')
  let dmgRet = /伤害(\d?)$/.exec(name)
  let dmgIdx = 0
  if (/(最强|最高|最高分|最牛|第一)/.test(msg)) {
    mode = /(分|圣遗物|评分|ACE)/.test(msg) ? 'rank-mark' : 'rank-dmg'
    name = name.replace(/(最强|最高分|第一|最高|最牛|圣遗物|评分|群)/g, '')
  }
  if (/(详情|详细|面板|面版)\s*$/.test(msg) && !/更新|录入|输入/.test(msg)) {
    mode = 'profile'
    name = name.replace(/(详情|详细|面板)/, '').trim()
  } else if (dmgRet) {
    mode = 'dmg'
    name = name.replace(/伤害[0-5]?/, '').trim()
    if (dmgRet[1]) {
      dmgIdx = dmgRet[1] * 1
    }
  } else if (/(详情|详细|面板)更新$/.test(msg) || (/更新/.test(msg) && /(详情|详细|面板)$/.test(msg))) {
    mode = 'refresh'
    name = name.replace(/详情|详细|面板|更新/g, '').trim()
  } else if (/圣遗物/.test(msg)) {
    mode = 'artis'
    name = name.replace('圣遗物', '').trim()
  }
  if (!Common.cfg('avatarProfile')) {
    // 面板开关关闭
    return false
  }
  let char = Character.get(name.trim())
  if (!char) {
    return false
  }

  let uid = e.uid || await getTargetUid(e)
  if (!uid) {
    return true
  }
  e.uid = uid
  e.avatar = char.id

  if (char.isCustom) {
    e.reply('自定义角色暂不支持此功能')
    return true
  }
  if (!char.isRelease && !profileChange) {
    e.reply('角色尚未实装')
    return true
  }

  if (mode === 'profile' || mode === 'dmg') {
    return renderProfile(e, char, mode, { dmgIdx })
  } else if (mode === 'refresh') {
    await getProfile(e)
    return true
  } else if (mode === 'artis') {
    return profileArtis(e)
  }
  return true
}
