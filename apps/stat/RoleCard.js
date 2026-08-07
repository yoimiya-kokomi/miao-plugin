import lodash from 'lodash'
import { Cfg, Common, Data } from '#miao'
import { MysApi } from '#miao.models'

const roleCardCacheKey = (groupId) => `miao:role-card:exchange:v2:${groupId}`
const roleCardCacheEx = 3600 * 24 * 30
const roleCardCacheMaxAge = roleCardCacheEx * 1000

async function getRoleCardState (e) {
  let mys = await MysApi.init(e, 'cookie')
  if (!mys || !mys.uid) {
    return false
  }
  let uid = mys.uid
  let resRole = await mys.getRoleCombat(true)
  let tarotCardState = Data.getVal(resRole, 'tarot_card_state')
  if (!tarotCardState) {
    return { uid, tarotCardState: false }
  }
  return { uid, tarotCardState }
}

function getCardMap (tarotCardState) {
  let ret = {}
  lodash.forEach(tarotCardState?.list || [], (card) => {
    if (!card?.name) {
      return
    }
    ret[card.name] = {
      name: card.name,
      icon: card.icon,
      unlockNum: Number(card.unlock_num || 0),
      isUnlock: !!card.is_unlock
    }
  })
  return ret
}

function getExtraCards (tarotCardState) {
  let ret = {}
  lodash.forEach(getCardMap(tarotCardState), (card, name) => {
    if (card.isUnlock && card.unlockNum > 1) {
      ret[name] = {
        name,
        num: card.unlockNum - 1
      }
    }
  })
  return ret
}

function getNeedCards (tarotCardState) {
  let ret = {}
  lodash.forEach(getCardMap(tarotCardState), (card, name) => {
    if (!card.isUnlock || card.unlockNum <= 0) {
      ret[name] = true
    }
  })
  return ret
}

function getSenderName (e) {
  return lodash.truncate(e.sender?.card || e.sender?.nickname || e.nickname || `${e.user_id}`, { length: 12 })
}

async function saveRoleCardState (e, uid, tarotCardState) {
  if (!e.group_id || !uid || !tarotCardState) {
    return
  }
  let cacheKey = roleCardCacheKey(e.group_id)
  let userData = {
    qq: e.user_id,
    uid,
    name: getSenderName(e),
    time: Date.now(),
    tarot_card_state: tarotCardState
  }
  await redis.hSet(cacheKey, `${e.user_id}`, JSON.stringify(userData))
  await redis.expire(cacheKey, roleCardCacheEx)
}

async function getGroupRoleCardStates (groupId) {
  let ret = {}
  let cacheData = await redis.hGetAll(roleCardCacheKey(groupId))
  lodash.forEach(cacheData, (userData, qq) => {
    try {
      ret[qq] = JSON.parse(userData)
    } catch (err) {
      logger.warn(`月谕圣牌交换缓存解析失败：${qq}`)
    }
  })
  return ret
}

function getMatchedCards (source = {}, target = {}, tarotCardState) {
  let cardMap = getCardMap(tarotCardState)
  return lodash.map(lodash.keys(lodash.pick(source, lodash.keys(target))), (name) => ({
    name,
    icon: cardMap[name]?.icon,
    num: source[name]?.num || 1
  }))
}

export async function RoleCard (e) {
  let rawMsg = e.original_msg || e.msg || ''
  let isMatch = /^#(喵喵)(月谕|越狱|幻想|幻境|剧诗|幻想真境剧诗)(圣牌|卡片|卡牌|塔罗牌|card|tarot)(收藏|收集)?$/.test(rawMsg)
  if (!Cfg.get('roleCard', false) && !isMatch) {
    return false
  }
  // 需要自身 ck 查询
  let roleCardData = await getRoleCardState(e)
  if (!roleCardData) {
    if (isMatch) {
      e.reply(`请绑定ck后再使用${e.original_msg || e.msg}`)
    }
    return false
  }
  let { uid, tarotCardState: lvs } = roleCardData
  // 检查是否查询到了幻想真境剧诗信息
  if (!lvs) {
    e.reply(`暂未获得「月谕圣牌」收藏数据...`)
    return true
  }
  await saveRoleCardState(e, uid, lvs)
  return await Common.render('stat/role-card', {
    tarot_card_state: lvs,
    uid
  }, { e, scale: 1.2 })
}

export async function RoleCardExchange (e) {
  if (!e.group_id) {
    e.reply('「月谕圣牌交换」仅支持在群聊中查询。')
    return true
  }
  if (!Cfg.get('roleCard', false)) {
    return false
  }
  let roleCardData = await getRoleCardState(e)
  if (!roleCardData) {
    e.reply(`请绑定ck后再使用${e.original_msg || e.msg}`)
    return true
  }
  let { uid, tarotCardState } = roleCardData
  if (!tarotCardState) {
    e.reply('暂未获得「月谕圣牌」收藏数据...')
    return true
  }
  await saveRoleCardState(e, uid, tarotCardState)

  let selfExtra = getExtraCards(tarotCardState)
  let selfNeed = getNeedCards(tarotCardState)
  if (lodash.isEmpty(selfNeed)) {
    e.reply('你的「月谕圣牌」已全部收集，无需交换。')
    return true
  }
  if (lodash.isEmpty(selfExtra)) {
    e.reply('你当前没有可用于交换的重复「月谕圣牌」。')
    return true
  }

  let cacheData = await getGroupRoleCardStates(e.group_id)
  let matches = []
  lodash.forEach(cacheData, (userData, qq) => {
    let isExpired = !userData.time || Date.now() - userData.time > roleCardCacheMaxAge
    if (isExpired || `${qq}` === `${e.user_id}` || `${userData.uid}` === `${uid}` || !userData.tarot_card_state) {
      return
    }
    let otherExtra = getExtraCards(userData.tarot_card_state)
    let otherNeed = getNeedCards(userData.tarot_card_state)
    let otherCanGive = getMatchedCards(otherExtra, selfNeed, userData.tarot_card_state)
    let selfCanGive = getMatchedCards(selfExtra, otherNeed, tarotCardState)
    if (otherCanGive.length > 0 && selfCanGive.length > 0) {
      matches.push({
        qq,
        uid: userData.uid,
        name: userData.name || qq,
        otherCanGive,
        selfCanGive,
        score: otherCanGive.length + selfCanGive.length
      })
    }
  })

  matches = lodash.orderBy(matches, ['score'], ['desc']).slice(0, 8)
  if (matches.length === 0) {
    e.reply('本群暂无可互相交换的「月谕圣牌」用户。\n提示：需要群友先查询过 #月谕圣牌，才会进入本群交换匹配范围。')
    return true
  }

  return await Common.render('stat/role-card-exchange', {
    uid,
    groupId: e.group_id,
    matches
  }, { e, scale: 1.2 })
}
