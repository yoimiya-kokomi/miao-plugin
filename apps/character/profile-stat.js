import lodash from 'lodash'
import { Common, Profile, Data } from '../../components/index.js'
import { Avatars } from '../../models/index.js'

export async function profileStat (e) {
  // 缓存时间，单位小时

  let msg = e.msg.replace('#', '').trim()
  if (msg === '角色统计' || msg === '武器统计') {
    // 暂时避让一下抽卡分析的关键词
    return false
  }

  let MysApi = await e.getMysApi({
    auth: 'all',
    targetType: 'all',
    cookieType: 'all'
  })
  if (!MysApi || !MysApi?.targetUser?.uid) return true
  let uid = MysApi?.targetUser?.uid

  let resIndex = await MysApi.getCharacter()
  if (!resIndex) {
    return true
  }

  if (!await Avatars.hasTalentCache(uid)) {
    e.reply('正在获取角色信息，请稍候...')
  }

  let avatars = new Avatars(uid, resIndex.avatars)
  let ids = avatars.getIds()

  let talentData = await avatars.getTalentData(ids, MysApi)

  // 天赋等级背景
  const talentLvMap = '0,1,1,1,2,2,3,3,3,4,5'.split(',')

  let profiles = Profile.getAll(uid)

  let avatarRet = []
  lodash.forEach(talentData, (avatar) => {
    let { talent, id } = avatar
    avatar.aeq = talent?.a?.original + talent?.e?.original + talent?.q?.original || 3
    avatarRet.push(avatar)
    if (profiles[id]) {
      let mark = profiles[id].getArtisMark(false)
      avatar.artisMark = Data.getData(mark, 'mark,markClass,names')
    }
  })

  let sortKey = 'level,star,aeq,cons,weapon.level,weapon.star,weapon.affix,fetter'.split(',')

  avatarRet = lodash.orderBy(avatarRet, sortKey)
  avatarRet = avatarRet.reverse()

  let talentNotice = ''

  if (!MysApi.isSelfCookie) {
    talentNotice = '未绑定Cookie，无法获取天赋列表。请回复 #体力帮助 获取配置教程'
  }

  return await Common.render('character/profile-stat', {
    save_id: uid,
    uid,
    talentLvMap,
    avatars: avatarRet,
    isSelf: e.isSelf,
    talentNotice,
    elem: 'hydro'
  }, { e, scale: 1.8 })
}
