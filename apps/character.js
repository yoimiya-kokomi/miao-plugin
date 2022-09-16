import { Common, Cfg, App } from '../components/index.js'
import { Character } from '../models/index.js'
import { renderAvatar } from './character/avatar-card.js'
import { getTargetUid, getProfile, profileHelp, inputProfile } from './character/profile-common.js'
import { profileArtis, profileArtisList } from './character/profile-artis.js'
import { renderProfile } from './character/profile-detail.js'
// 角色图像上传
import { uploadCharacterImg } from './character/character-img-upload.js'

// 面板练度统计
import { profileStat } from './character/profile-stat.js'

// 面板角色列表
import { profileList } from './character/profile-list.js'

// 老婆
import { wife, pokeWife, wifeReg } from './character/avatar-wife.js'

import { enemyLv, getOriginalPicture } from './character/utils.js'

let app = App.init({
  id: 'character',
  name: '角色查询',
  desc: '角色查询'
})
app.reg('character', character, {
  rule: /^(#(.*)|#*(更新|录入)?(.*)(详细|详情|面板|面版|伤害[1-7]?)(更新)?)$/,
  name: '角色查询'
})

app.reg('upload-img', uploadCharacterImg, {
  rule: /^#*(喵喵)?(上传|添加)(.+)(照片|写真|图片|图像)\s*$/,
  name: '上传角色写真'
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

app.reg('wife', wife, {
  rule: wifeReg,
  describe: '#老公 #老婆 查询'
})

app.reg('pock-wife', pokeWife, {
  rule: '#poke#',
  describe: '#老公 #老婆 查询'
})

app.reg('original-pic', getOriginalPicture, {
  rule: /^#?(获取|给我|我要|求|发|发下|发个|发一下)?原图(吧|呗)?$/,
  describe: '【#原图】 回复角色卡片，可获取原图'
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
export async function character (e) {
  let msg = e.original_msg || e.msg
  if (!msg) {
    return
  }

  let mode = 'card'
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

  if (mode === 'card' && Common.isDisable(e, 'char.char')) {
    return
  }

  if (mode !== 'card' && !e.isMaster) {
    if (Common.isDisable(e, 'char.profile')) {
      // 面板开关关闭
      return
    }
    if (e.isPrivate) {
      if ((e.sub_type === 'friend' && Cfg.get('profile.friend.status') === false) ||
        (e.sub_type === 'group' && Cfg.get('profile.stranger.status') === false)) {
        return
      }
    } else if (e.isGroup) {
      let groupCfg = Cfg.get(`profile.groups.群${e.group_id}.status`)
      if (groupCfg === false || (groupCfg !== true && Cfg.get('profile.group.status') === false)) {
        return
      }
    }
  }

  let char = Character.get(name.trim())

  if (!char) {
    return false
  }

  if (mode === 'card') {
    return renderAvatar(e, char.name)
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
