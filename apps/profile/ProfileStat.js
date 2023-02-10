import { Cfg, Common } from '../../components/index.js'
import { MysApi, Player } from '../../models/index.js'

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

  let isAvatarList = !/练度统计/.test(msg)

  let mys = await MysApi.init(e)
  if (!mys || !mys.uid) return false

  const uid = mys.uid

  let player = Player.create(e)

  await player.refreshMysInfo()

  let avatarRet = await player.refreshAndGetAvatarData({
    rank: true,
    retType: 'array',
    sort: true
  })

  let talentNotice = ''

  return await Common.render(isAvatarList ? 'character/avatar-list' : 'character/profile-stat', {
    save_id: uid,
    uid,
    info: player.info || {},
    isStat: !isAvatarList,
    talentLvMap: '0,1,1,1,2,2,3,3,3,4,5'.split(','),
    avatars: avatarRet,
    isSelf: e.isSelf,
    talentNotice
  }, { e, scale: 1.4 })
}
