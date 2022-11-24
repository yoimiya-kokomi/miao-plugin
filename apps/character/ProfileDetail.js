import lodash from 'lodash'
import { autoRefresh } from './ProfileCommon.js'
import { Common, Format, Profile } from '../../components/index.js'
import { MysApi, Avatar, ProfileRank, ProfileArtis } from '../../models/index.js'

export async function renderProfile (e, char, mode = 'profile', params = {}) {
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

  let refresh = async () => {
    let refreshRet = await autoRefresh(e)
    if (refreshRet) {
      await renderProfile(e, char, mode, params)
    }
    return refreshRet
  }

  let profile = Profile.get(uid, char.id)

  if (!profile || !profile.hasData) {
    if (await refresh()) {
      return true
    } else {
      e.reply(`请确认${char.name}已展示在【游戏内】的角色展柜中，并打开了“显示角色详情”。然后请使用 #更新面板\n命令来获取${char.name}的面板详情`)
    }
    return true
  }
  let avatar = new Avatar(profile)
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

  let enemyLv = await selfUser.getCfg('char.enemyLv', 91)
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
  let rank = false
  if (e.group_id) {
    rank = await ProfileRank.create({ group: e.group_id, uid, qq: e.user_id })
    await rank.getRank(profile, true)
  }

  let artisDetail = profile.getArtisMark()
  let artisKeyTitle = ProfileArtis.getArtisKeyTitle()

  // 渲染图像
  return await Common.render('character/profile-detail', {
    save_id: uid,
    uid,
    data: avatar.getData('name,abbr,cons,level,weapon,talent,dataSource,updateTime,_attrCalc'),
    attr,
    elem: char.elem,
    dmgData,
    dmgMsg,
    dmgRet: dmgCalc.dmgRet || false,
    dmgCfg: dmgCalc.dmgCfg || false,
    artisDetail,
    artisKeyTitle,
    enemyLv,
    imgs: char.getImgs(profile.costume),
    enemyName: dmgCalc.enemyName || '小宝',
    talentMap: { a: '普攻', e: '战技', q: '爆发' },
    bodyClass: `char-${char.name}`,
    mode
  }, { e, scale: 1.6 })
}
