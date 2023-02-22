import lodash from 'lodash'
import { getTargetUid, getProfileRefresh } from './ProfileCommon.js'
import ProfileList from './ProfileList.js'
import { Cfg, Common, Format } from '../../components/index.js'
import { MysApi, ProfileRank, ProfileArtis, Character, Weapon } from '../../models/index.js'
import ProfileChange from './ProfileChange.js'
import { profileArtis } from './ProfileArtis.js'

// 查看当前角色
let ProfileDetail = {
  async detail (e) {
    let msg = e.original_msg || e.msg
    if (!msg) {
      return false
    }
    if (!/详细|详情|面板|面版|圣遗物|伤害|武器|换/.test(msg)) {
      return false
    }
    let mode = 'profile'
    let profileChange = false
    let changeMsg = msg
    let pc = ProfileChange.matchMsg(msg)
    if (pc && pc.char && pc.change) {
      if (!Cfg.get('profileChange')) {
        e.reply('面板替换功能已禁用...')
        return true
      }
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
    let dmgRet = /(?:伤害|武器)(\d?)$/.exec(name)
    let dmgIdx = 0
    if (/(最强|最高|最高分|最牛|第一)/.test(msg)) {
      mode = /(分|圣遗物|评分|ACE)/.test(msg) ? 'rank-mark' : 'rank-dmg'
      name = name.replace(/(最强|最高分|第一|最高|最牛|圣遗物|评分|群)/g, '')
    }
    if (/(详情|详细|面板|面版)\s*$/.test(msg) && !/更新|录入|输入/.test(msg)) {
      mode = 'profile'
      name = name.replace(/(详情|详细|面板)/, '').trim()
    } else if (dmgRet) {
      // mode = /武器/.test(msg) ? 'weapon' : 'dmg'
      mode = 'dmg'
      name = name.replace(/(伤害|武器)+[0-7]?/, '').trim()
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
      return false // 面板开关关闭
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
    if (!char.isRelease) {
      if (!profileChange) {
        e.reply('角色尚未实装')
        return true
      } else if (Cfg.get('notReleasedData') === false) {
        e.reply('未实装角色面板已禁用...')
        return true
      }
    }

    if (mode === 'profile' || mode === 'dmg' || mode === 'weapon') {
      return ProfileDetail.render(e, char, mode, { dmgIdx })
    } else if (mode === 'refresh') {
      await ProfileList.refresh(e)
      return true
    } else if (mode === 'artis') {
      return profileArtis(e)
    }
    return true
  },

  async render (e, char, mode = 'profile', params = {}) {
    let selfUser = await MysApi.initUser(e)

    if (!selfUser) {
      e.reply('尚未绑定UID')
      return true
    }

    let { uid } = e

    if (char.isCustom) {
      e.reply(`暂不支持自定义角色${char.name}的面板信息查看`)
      return true
    }

    let profile = e._profile || await getProfileRefresh(e, char.id)
    if (!profile) {
      return true
    }
    char = profile.char || char
    let a = profile.attr
    let c = Format.comma
    let p = Format.pct
    let attr = {
      hp: c(a.hp),
      hpPlus: c(a.hp - a.hpBase),
      atk: c(a.atk),
      atkPlus: c(a.atk - a.atkBase),
      def: c(a.def),
      defPlus: c(a.def - a.defBase),
      cpct: p(a.cpct),
      cdmg: p(a.cdmg),
      mastery: c(a.mastery),
      recharge: p(a.recharge),
      dmg: p(Math.max(a.dmg * 1 || 0, a.phy * 1 || 0))
    }

    let weapon = Weapon.get(profile.weapon.name)
    let w = profile.weapon
    let wCfg = {}
    if (mode === 'weapon') {
      wCfg = weapon.calcAttr(w.level, w.promote)
      wCfg.info = weapon.getAffixInfo(weapon.affix)
    }

    let enemyLv = await selfUser.getCfg('char.enemyLv', 91)
    let dmgCalc = await ProfileDetail.getProfileDmgCalc({ profile, enemyLv, mode, params })

    let rank = false
    if (e.group_id && !e._profile) {
      rank = await ProfileRank.create({ group: e.group_id, uid, qq: e.user_id })
      await rank.getRank(profile, true)
    }

    let artisDetail = profile.getArtisMark()
    let artisKeyTitle = ProfileArtis.getArtisKeyTitle()
    let renderData = {
      save_id: uid,
      uid,
      data: profile.getData('name,abbr,cons,level,weapon,talent,dataSource,updateTime,imgs,costumeSplash'),
      attr,
      elem: char.elem,
      dmgCalc,
      artisDetail,
      artisKeyTitle,
      bodyClass: `char-${char.name}`,
      mode,
      wCfg,
      changeProfile: e._profileMsg
    }
    // 渲染图像
    let msgRes = await Common.render('character/profile-detail', renderData, { e, scale: 1.6, retMsgId: true })
    if (msgRes && msgRes.message_id) {
      // 如果消息发送成功，就将message_id和图片路径存起来，3小时过期
      await redis.set(`miao:original-picture:${msgRes.message_id}`, JSON.stringify({
        type: 'profile',
        img: renderData?.data?.costumeSplash
      }), { EX: 3600 * 3 })
    }
    return true
  },

  async getProfileDmgCalc ({ profile, enemyLv, mode, params }) {
    let dmgMsg = []
    let dmgData = []
    let dmgCalc = await profile.calcDmg({
      enemyLv,
      mode,
      ...params
    })
    if (dmgCalc && dmgCalc.ret) {
      lodash.forEach(dmgCalc.ret, (ds) => {
        ds.dmg = Format.comma(ds.dmg, 0)
        ds.avg = Format.comma(ds.avg, 0)
        dmgData.push(ds)
      })
      lodash.forEach(dmgCalc.msg, (msg) => {
        msg.replace(':', '：')
        dmgMsg.push(msg.split('：'))
      })

      dmgCalc.dmgMsg = dmgMsg
      dmgCalc.dmgData = dmgData
    }

    if (mode === 'dmg' && dmgCalc.dmgRet) {
      let basic = dmgCalc?.dmgCfg?.basicRet
      lodash.forEach(dmgCalc.dmgRet, (row) => {
        lodash.forEach(row, (ds) => {
          ds.val = (ds.avg > basic.avg ? '+' : '') + Format.comma(ds.avg - basic.avg)
          ds.dmg = Format.comma(ds.dmg, 0)
          ds.avg = Format.comma(ds.avg, 0)
        })
      })
      basic.dmg = Format.comma(basic.dmg)
      basic.avg = Format.comma(basic.avg)
    }

    return dmgCalc
  }
}

export default ProfileDetail
