import lodash from 'lodash'
import { Common } from '../../components/index.js'
import Avatars from '../../components/models/Avatars.js'

export async function profileStat (e, { render }) {
  // 缓存时间，单位小时
  let cacheCd = 6

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
  if (!MysApi) return true
  let uid = MysApi.targetUid

  /*
  let star = 0
  if (/(四|4)/.test(msg)) star = 4
  if (/(五|5)/.test(msg)) star = 5
   */

  let resIndex = await MysApi.getCharacter()
  if (!resIndex) {
    return true
  }

  let avatars = new Avatars(uid, resIndex.avatars)
  let ids = avatars.getIds()

  let talentData = await avatars.getTalentData(ids, MysApi)

  // 天赋等级背景
  const talentLvMap = '0,1,1,1,2,2,3,3,3,4,5'.split(',')

  let avatarRet = []
  lodash.forEach(talentData, (avatar) => {
    let { talent } = avatar
    avatar.aeq = talent?.a?.original + talent?.e?.original + talent?.q?.original || 3
    avatarRet.push(avatar)
  })

  let sortKey = 'level,star,aeq,cons,weapon.level,weapon.star,weapon.affix,fetter'.split(',')

  avatarRet = lodash.orderBy(avatarRet, sortKey)
  avatarRet = avatarRet.reverse()

  let noTalent = false

  let talentNotice = `技能列表每${cacheCd}小时更新一次`
  if (noTalent) {
    talentNotice = '未绑定体力Cookie，无法获取天赋列表。请回复 #体力 获取配置教程'
  }

  return await Common.render('character/profile-stat', {
    save_id: uid,
    uid,
    talentLvMap,
    avatars: avatarRet,
    isSelf: e.isSelf,
    talentNotice,
    elem: 'hydro',
  }, { e, render, scale: 1.8 })
}
