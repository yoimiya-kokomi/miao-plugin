import lodash from 'lodash'
import { Cfg, Common, Data } from '#miao'
import { HardChallenge, MysApi, Player } from '#miao.models'

export async function HardChallengeSummary (e) {
  let isMatch = /^#(喵喵)(幽境|危战|幽境危战)(数据)?$/.test(e.original_msg || e.msg || '')
  if (!Cfg.get('hardChallenge', false) && !isMatch) {
    return false
  }
  // 需要自身 ck 查询
  let mys = await MysApi.init(e, 'cookie')
  if (!mys || !mys.uid) {
    if (isMatch) {
      e.reply(`请绑定ck后再使用${e.original_msg || e.msg}`)
    }
    return false
  }
  let uid = mys.uid
  let player = Player.create(e)
  let resDetail, hardChallenge, hardChallengePopularity
  try {
    hardChallenge = await mys.getHardChallenge()
    hardChallengePopularity = await mys.getHardChallengePopularity()
    logger.mark('hardchallenge')
    logger.mark(JSON.stringify(hardChallenge, null, 2))
    let lvs = Data.getVal(hardChallenge, 'data.0')
    // 检查是否查询到了幽境危战信息
    // TODO: 查询结果是一个长度为 2 的数组，猜测可能是本期和上期的数据，待后续验证
    // TODO: 有单人挑战的 single，有多人挑战的 mp
    // 先仅适配 single，mp 真会来查这玩意儿吗……
    // 等个有缘人之后再来看吧
    if (!lvs || !lvs.single.has_data) {
      e.reply('暂未获得本期幽境危战挑战数据...')
      return true
    }

    resDetail = await mys.getCharacter()
    if (!resDetail || !hardChallenge || !resDetail.avatars || resDetail.avatars.length <= 3) {
      e.reply('角色信息获取失败')
      return true
    }
    delete resDetail._res
    delete hardChallenge._res
  } catch (err) {
    throw err;
    // console.log(err);
  }

  // 更新player信息
  player.setMysCharData(resDetail)

  if (hardChallenge.data.length === 0) {
    e.reply('暂未获得本期幽境危战挑战数据...')
    return true
  }
  let hc = new HardChallenge(hardChallenge.data[0], hardChallengePopularity.avatar_list)
  let hcData = hc.getData()
  let avatarIds = hc.getAvatars()
  let rawAvatarData = player.getAvatarData(avatarIds)
  let avatarData = hc.applyPopularity(rawAvatarData)
  
  return await Common.render('stat/hard-summary', {
    hard: hcData,
    avatars: avatarData,
    save_id: uid,
    uid
  }, { e, scale: 1.2 })
}
