import lodash from 'lodash'
import { getTargetUid, getProfileRefresh } from './ProfileCommon.js'
import ProfileList from './ProfileList.js'
import { Cfg, Common, Data, Format } from '#miao'
import { MysApi, ProfileRank, Character, Weapon, Artifact } from '#miao.models'
import ProfileChange from './ProfileChange.js'
import { profileArtis } from './ProfileArtis.js'
import { ProfileWeapon } from './ProfileWeapon.js'

let { diyCfg } = await Data.importCfg('profile')

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
      e.game = pc.game
      e.isSr = e.game === 'sr'
      e.uid = ''
      e.msg = '#喵喵面板变换'
      e.uid = pc.uid || await getTargetUid(e)
      profileChange = ProfileChange.getProfile(e.uid, pc.char, pc.change, pc.game)
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

    let name = msg.replace(/#|老婆|老公|星铁|原神/g, '').trim()
    msg = msg.replace('面版', '面板')
    let dmgRet = /(?:伤害|武器)(\d*)$/.exec(name)
    let dmgIdx = 0; let idxIsInput = false
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
      name = name.replace(/(伤害|武器)+\d*/, '').trim()
      if (dmgRet[1]) {
        dmgIdx = dmgRet[1] * 1
        // 标识是用户指定的序号
        idxIsInput = true
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
    let char = Character.get(name.trim(), e.game)
    if (!char) {
      return false
    }
    if (/星铁/.test(msg) || char.isSr) {
      e.game = 'sr'
      e.isSr = true
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
      // 预设面板支持未实装角色
      if (!profileChange && Number(e.uid) > 100000006) {
        e.reply('角色尚未实装')
        return true
      }
      // 但仅在未实装开启时展示
      if (Cfg.get('notReleasedData') === false) {
        e.reply('未实装角色面板已禁用...')
        return true
      }
    }

    if (mode === 'profile' || mode === 'dmg' || mode === 'weapon') {
      return ProfileDetail.render(e, char, mode, { dmgIdx, idxIsInput })
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
    let base = profile.base
    let attr = {}
    let game = char.game
    let isGs = game === 'gs'
    let isSr = !isGs

    lodash.forEach((isGs ? 'hp,def,atk,mastery' : 'hp,def,atk,speed').split(','), (key) => {
      let fn = (n) => Format.comma(n, key === 'hp' ? 0 : 1)
      attr[key] = fn(a[key])
      attr[`${key}Base`] = fn(base[key])
      attr[`${key}Plus`] = fn(a[key] - base[key])
    })
    lodash.forEach((isGs ? 'cpct,cdmg,recharge,dmg' : 'cpct,cdmg,recharge,dmg,effPct,effDef,heal,stance').split(','), (key) => {
      let fn = Format.pct
      let key2 = key
      if (key === 'dmg') {
        if (isGs) {
          if (a.phy > a.dmg) {
            key2 = 'phy'
          }
        }
      }
      attr[key] = fn(a[key2])
      attr[`${key}Base`] = fn(base[key2])
      attr[`${key}Plus`] = fn(a[key2] - base[key2])
    })

    let weapon = Weapon.get(profile?.weapon?.name, game)
    let w = profile.weapon
    let wCfg = {}
    if (mode === 'weapon') {
      wCfg = weapon.calcAttr(w.level, w.promote)
      wCfg.weapons = await ProfileWeapon.calc(profile)
    }

    let enemyLv = isGs ? (await selfUser.getCfg('char.enemyLv', 91)) : 80
    let dmgCalc = await ProfileDetail.getProfileDmgCalc({ profile, enemyLv, mode, params })

    let rank = false
    if (e.group_id && !e._profile) {
      rank = await ProfileRank.create({ group: e.group_id, uid, qq: e.user_id })
      await rank.getRank(profile, true)
    }

    let artisDetail = profile.getArtisMark()
    // 处理一下allAttr，确保都有9个内容，以获得比较好展示效果
    let allAttr = profile.artis.getAllAttr() || []
    allAttr = lodash.slice(allAttr, 0, 9)
    for (let idx = allAttr.length; idx < 9; idx++) {
      allAttr[idx] = {}
    }
    artisDetail.allAttr = allAttr

    let artisKeyTitle = Artifact.getArtisKeyTitle(game)
    let data = profile.getData('name,abbr,cons,level,talent,dataSource,updateTime,imgs,costumeSplash')
    if (isSr) {
      let treeData = []
      let treeMap = {}
      // 属性
      lodash.forEach('0113355778'.split(''), (pos, idx) => {
        treeData[pos] = treeData[pos] || []
        let tmp = { type: 'tree', img: '/meta-sr/public/icons/tree-cpct.webp' }
        treeData[pos].push(tmp)
        treeMap[idx + 201 + ''] = tmp
      })
      // 能力
      lodash.forEach([2, 4, 6], (pos, idx) => {
        let tmp = { type: 'talent', img: data.imgs[`tree${idx + 1}`] }
        treeData[pos] = tmp
        treeMap[idx + 101 + ''] = tmp
      })
      lodash.forEach(profile.trees, (id) => {
        let ret = /([12][01][0-9])$/.exec(id + '')
        if (ret && ret[1]) {
          let treeId = ret[1]
          if (treeMap?.[treeId]) {
            treeMap[treeId].value = 1
          }
          if (treeId[0] === '2') {
            treeMap[treeId].img = `/meta-sr/public/icons/tree-${char.detail?.tree?.[id]?.key}.webp`
          }
        }
      })
      data.treeData = treeData
    }
    data.weapon = profile.getWeaponDetail()
    let renderData = {
      save_id: uid,
      uid,
      game,
      data,
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
    if (msgRes) {
      // 如果消息发送成功，就将message_id和图片路径存起来，3小时过期
      const message_id = [e.message_id]
      if (Array.isArray(msgRes.message_id)) {
        message_id.push(...msgRes.message_id)
      } else {
        message_id.push(msgRes.message_id)
      }
      for (const i of message_id) {
        await redis.set(`miao:original-picture:${i}`, JSON.stringify({
          type: 'profile',
          img: renderData?.data?.costumeSplash
        }), { EX: 3600 * 3 })
      }
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
        if (ds.type !== 'text') {
          ds.dmg = Format.comma(ds.dmg, 0)
          ds.avg = Format.comma(ds.avg, 0)
        }
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
