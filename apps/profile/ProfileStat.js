import lodash from 'lodash'
import { Cfg, Common, Data } from '../../components/index.js'
import { MysApi, ProfileRank, Player } from '../../models/index.js'

export async function profileStat (e) {
  let isMatch = /^#(面板|喵喵|角色|武器|天赋|技能|圣遗物)练度统计?$/.test(e.original_msg || e.msg || '')
  if (!Cfg.get('profileStat', false) && !isMatch) {
    return false
  }

  // 缓存时间，单位小时
  let msg = e.msg.replace('#', '').trim()
  if (msg === '角色统计' || msg === '武器统计') {
    // 暂时避让一下抽卡分析的关键词
    return false
  }

  let mys = await MysApi.init(e)
  if (!mys || !mys.uid) return false

  const uid = mys.uid

  let player = Player.create(e)
  // 更新角色信息
  await player.refreshMys()

  // 更新天赋信息
  await player.refreshTalent()

  let rank = false
  if (e.group_id) {
    rank = await ProfileRank.create({ group: e.group_id, uid, qq: e.user_id })
  }

  let avatarRet = []
  player.forEachAvatar((avatar) => {
    let { talent } = avatar
    let ds = avatar.getDetail()
    ds.aeq = talent?.a?.original + talent?.e?.original + talent?.q?.original || 3
    avatarRet.push(ds)

    let profile = avatar.getProfile()
    if (!profile) {
      return true
    }
    if (profile) {
      if (profile.hasData) {
        let mark = profile.getArtisMark(false)
        ds.artisMark = Data.getData(mark, 'mark,markClass,names')
        if (rank) {
          rank.getRank(profile)
        }
      }
    }
  })

  let sortKey = 'level,star,aeq,cons,weapon.level,weapon.star,weapon.affix,fetter'.split(',')
  avatarRet = lodash.orderBy(avatarRet, sortKey)
  avatarRet = avatarRet.reverse()
  let talentNotice = ''

  return await Common.render('character/profile-stat', {
    save_id: uid,
    uid,
    talentLvMap: '0,1,1,1,2,2,3,3,3,4,5'.split(','),
    avatars: avatarRet,
    isSelf: e.isSelf,
    talentNotice
  }, { e, scale: 1.8 })
}
