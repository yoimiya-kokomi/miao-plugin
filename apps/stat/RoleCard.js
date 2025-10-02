import lodash from 'lodash'
import { Cfg, Common, Data } from '#miao'
import { RoleCombat, MysApi, Player } from '#miao.models'

export async function RoleCard (e) {
  let rawMsg = e.original_msg || e.msg || ''
  let isMatch = /^#(喵喵)(月谕|越狱|幻想|幻境|剧诗|幻想真境剧诗)(圣牌|卡片|卡牌|塔罗牌|card|tarot)(收藏|收集)?$/.test(rawMsg)
  if (!Cfg.get('roleCard', false) && !isMatch) {
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
  let resRole
  let lvs
  try {
    resRole = await mys.getRoleCombat(true)
    lvs = Data.getVal(resRole, 'tarot_card_state')
    // 检查是否查询到了幻想真境剧诗信息
    if (!lvs) {
      e.reply(`暂未获得「月谕圣牌」收藏数据...`)
      return true
    }
    delete resRole._res
  } catch (err) {
    throw err;
    // console.log(err);
  }
  return await Common.render('stat/role-card', {
    tarot_card_state: lvs,
    uid
  }, { e, scale: 1.2 })
}
