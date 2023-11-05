import { Common } from '#miao'
import { MysApi, Player, Character } from '#miao.models'
import moment from 'moment'
import lodash from 'lodash'

const ProfileStat = {
  async stat (e) {
    return ProfileStat.render(e, 'stat')
  },

  async avatarList (e) {
    return ProfileStat.render(e, 'avatar')
  },

  async refreshTalent (e) {
    let mys = await MysApi.init(e)
    if (!mys || !mys.uid) return false

    let player = Player.create(e)
    let refreshCount = await player.refreshTalent('', 2)
    if (refreshCount) {
      e.reply(`角色天赋更新成功，共${refreshCount}个角色\n你现在可以通过【#练度统计】【#天赋统计】来查看角色信息了...`)
    } else {
      e.reply('角色天赋未能更新...')
    }
  },

  // 渲染
  // isAvatarList true:角色列表 false练度统计
  async render (e, mode = 'stat') {
    // 缓存时间，单位小时
    let msg = e.msg.replace('#', '').trim()
    if (msg === '角色统计' || msg === '武器统计') {
      // 暂时避让一下抽卡分析的关键词
      return false
    }

    if (/天赋|技能/.test(msg)) {
      mode = 'talent'
    }


    let mys = await MysApi.init(e)
    if (!mys || !mys.uid) return false

    const uid = mys.uid

    let player = Player.create(e)

    let avatarRet = await player.refreshAndGetAvatarData({
      index: 2,
      detail: 1,
      talent: mode === 'avatar' ? 0 : 1,
      rank: true,
      materials: mode === 'talent',
      retType: 'array',
      sort: true
    })

    if (avatarRet.length === 0) {
      e._isReplyed || e.reply(`查询失败，暂未获得#${uid}角色数据，请绑定CK或 #更新面板`)
      return true
    }

    let starFilter = 0
    if (/(五|四|5|4|)+星/.test(msg)) {
      starFilter = /(五|5)+星/.test(msg) ? 5 : 4
    }
    if (starFilter) {
      avatarRet = lodash.filter(avatarRet, ds => ds.star === starFilter)
    }

    let now = moment(new Date())
    if (now.hour() < 4) {
      now = now.add(-1, 'days')
    }
    let week = now.weekday()

    if (mode === 'talent') {
      let weekRet = /周([1-6]|一|二|三|四|五|六)/.exec(msg)
      let weekSel = weekRet?.[1]
      if (/(今日|今天)/.test(msg)) {
        weekSel = week + 1
      } else if (/(明天|明日)/.test(msg)) {
        now = now.add(1, 'days')
        weekSel = now.weekday() + 1
      }
      let weekFilter = (weekSel * 1) || ('一二三四五六'.split('').indexOf(weekSel) + 1)
      if (weekFilter && weekFilter !== 7) {
        avatarRet = lodash.filter(avatarRet, ds => ds?.materials?.talent?.num === ['周一/周四', '周二/周五', '周三/周六'][(weekFilter - 1) % 3])
      }
    }

    let faceChar = Character.get(player.face) || Character.get(avatarRet[0]?.id)
    let imgs = faceChar.imgs
    let face = {
      banner: imgs?.banner,
      face: imgs?.face,
      qFace: imgs?.qFace,
      name: player.name || `#${uid}`,
      sign: player.sign,
      level: player.level
    }

    let info = player.getInfo()
    info.stats = info.stats || {}
    info.statMap = {
      achievement: '成就',
      wayPoint: '锚点',
      avatar: '角色',
      avatar5: '五星角色',
      goldCount: '金卡总数'
    }


    let tpl = mode === 'avatar' ? 'character/avatar-list' : 'character/profile-stat'
    return await Common.render(tpl, {
      save_id: uid,
      uid,
      info,
      updateTime: player.getUpdateTime(),
      isSelfCookie: e.isSelfCookie,
      face,
      mode,
      week,
      avatars: avatarRet
    }, { e, scale: 1.4 })
  }
}
export default ProfileStat
