import lodash from 'lodash'
import { Cfg, Common, Data } from '#miao'
import { HardChallenge, MysApi, Player } from '#miao.models'

export async function HardChallengeSummary (e) {
  let rawMsg = e.original_msg || e.msg || ''
  let isMatch = /^#(喵喵)(本期|上期)?(幽境|危战|幽境危战)(单人|单挑|组队|多人|合作|最佳)?(数据)?$/.test(rawMsg)
  if (!Cfg.get('hardChallenge', false) && !isMatch) {
    return false
  }
  let isCurrent = !(/上期/.test(rawMsg))
  let isSingle = /单人|单挑/.test(rawMsg)
  let isMp = /组队|多人|合作/.test(rawMsg)
  let isBest = /最佳/.test(rawMsg)
  if (!isSingle && !isMp) {
    isBest = true
  }
  let queryKey = isCurrent ? 'data.0' : 'data.1'
  let periodText = isCurrent ? '本期' : '上期'
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
  let lvs
  try {
    hardChallenge = await mys.getHardChallenge()
    hardChallengePopularity = await mys.getHardChallengePopularity()

    lvs = Data.getVal(hardChallenge, queryKey)
    // 检查是否查询到了幽境危战信息
    // 查询结果是一个长度为 2 的数组，是本期和上期的数据
    // 有单人挑战的 single，有多人挑战的 mp

    // 如果是 best，那么决定是哪边
    function calculateScore(data) {
      if (data.has_data) {
        return data.best.difficulty * 1000 - data.best.second
      } else {
        return 0
      }
    }
    if (isSingle) {
      lvs.best = lvs.single
    } else if (isMp) {
      lvs.best = lvs.mp
    } else if (isBest) {
      let singleScore = calculateScore(lvs.single)
      let mpScore = calculateScore(lvs.mp)
      if (singleScore >= mpScore) {
        lvs.best = lvs.single
      } else {
        lvs.best = lvs.mp
      }
    } else {
      throw Error('未知的查询类别')
    }
    if (!lvs || !lvs.best.has_data) {
      e.reply(`暂未获得${periodText}幽境危战挑战数据...`)
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

  let hc = new HardChallenge(lvs, hardChallengePopularity.avatar_list)
  let hcData = hc.getData()
  let avatarIds = hc.getAvatars()
  let rawAvatarData = player.getAvatarData(avatarIds)
  rawAvatarData = hc.addFakeCharacters(rawAvatarData)
  let avatarData = hc.applyPopularity(rawAvatarData)
  
  return await Common.render('stat/hard-summary', {
    hard: hcData,
    avatars: avatarData,
    save_id: uid,
    uid
  }, { e, scale: 1.2 })
}
