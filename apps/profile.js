import { Common, Cfg, App } from '../components/index.js'
import { Character } from '../models/index.js'
import { getTargetUid, getProfile, profileHelp, inputProfile } from './character/profile-common.js'
import { profileArtis, profileArtisList } from './character/profile-artis.js'
import { renderProfile } from './character/profile-detail.js'
import { profileStat } from './character/profile-stat.js'
import { profileList } from './character/profile-list.js'
import { enemyLv } from './character/utils.js'

let app = App.init({
  id: 'profile',
  name: '角色面板'
})
app.reg('profile-detail', profileDetail, {
  rule: /^#*(更新|录入)?(.+)(详细|详情|面板|面版|圣遗物|伤害[1-7]?)(\d{9})*(更新)?$/,
  name: '角色面板'
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
  rule: /^#角色面板帮助$/,
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

export default app

// 查看当前角色
export async function profileDetail (e) {
  let msg = e.original_msg || e.msg
  if (!msg) {
    return false
  }

  let mode = 'profile'
  let uidRet = /[0-9]{9}/.exec(msg)
  if (uidRet) {
    e.uid = uidRet[0]
    msg = msg.replace(uidRet[0], '')
  }
  let name = msg.replace(/#|老婆|老公/g, '').trim()
  msg = msg.replace('面版', '面板')
  let dmgRet = /伤害(\d?)$/.exec(name)
  let dmgIdx = 0
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
  } else if (/(录入|输入)/.test(msg) && /(详情|详细|面板)/.test(msg)) {
    mode = 'input'
    let nameRet = /(?:录入|输入)(.+)(?:面板|详细|详情|数据)+/.exec(name)
    if (nameRet) {
      name = nameRet[1]
      e.inputData = msg.replace(nameRet[0], '')
    }
    name = name.replace(/录入|输入|详情|详细|面板|数据|[0-9]|\.|\+/g, '').trim()
  } else if (/圣遗物/.test(msg)) {
    mode = 'artis'
    name = name.replace('圣遗物', '').trim()
  }

  if (!e.isMaster) {
    if (Common.isDisable(e, 'char.profile')) {
      // 面板开关关闭
      return false
    }
    if (e.isPrivate) {
      if ((e.sub_type === 'friend' && Cfg.get('profile.friend.status') === false) ||
          (e.sub_type === 'group' && Cfg.get('profile.stranger.status') === false)) {
        return false
      }
    } else if (e.isGroup) {
      let groupCfg = Cfg.get(`profile.groups.群${e.group_id}.status`)
      if (groupCfg === false || (groupCfg !== true && Cfg.get('profile.group.status') === false)) {
        return false
      }
    }
  }

  let char = Character.get(name.trim())

  if (!char) {
    return false
  }

  let uid = await getTargetUid(e)
  if (!uid) {
    return true
  }
  e.uid = uid
  e.avatar = char.id

  if (char.isCustom) {
    e.reply('自定义角色暂不支持此功能')
    return true
  }
  if (!char.isArrive) {
    e.reply('角色尚未实装')
    return true
  }

  if (mode === 'profile' || mode === 'dmg') {
    return renderProfile(e, char, mode, { dmgIdx })
  } else if (mode === 'input') {
    await inputProfile(e, mode)
    return true
  } else if (mode === 'refresh') {
    await getProfile(e)
    return true
  } else if (mode === 'artis') {
    return profileArtis(e)
  }
  return true
}
