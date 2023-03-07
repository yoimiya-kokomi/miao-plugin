import lodash from 'lodash'
import HutaoApi from './HutaoApi.js'
import { Cfg, Common, Data } from '#miao'
import { Abyss, Character, MysApi, Player } from '#miao.models'

export async function AbyssSummary (e) {
  let isMatch = /^#(喵喵|上传)深渊(数据)?$/.test(e.original_msg || e.msg || '')
  if (!Cfg.get('uploadAbyssData', false) && !isMatch) {
    return false
  }
  let mys = await MysApi.init(e, 'all')
  if (!mys || !mys.uid) {
    if (isMatch) {
      e.reply(`请绑定ck后再使用${e.original_msg || e.msg}`)
    }
    return false
  }
  let ret = {}
  let uid = mys.uid
  let player = Player.create(e)
  let resDetail, resAbyss
  try {
    resAbyss = await mys.getSpiralAbyss(1)
    let lvs = Data.getVal(resAbyss, 'floors.0.levels.0')
    // 检查是否查询到了深渊信息
    if (!lvs || !lvs.battles) {
      e.reply('暂未获得本期深渊挑战数据...')
      return true
    } else if (lvs && lvs.battles && lvs.battles.length === 0) {
      if (!mys.isSelfCookie) {
        if (isMatch) {
          e.reply(`请绑定ck后再使用${e.original_msg || e.msg}`)
        }
        return false
      }
    }
    resDetail = await mys.getCharacter()
    if (!resDetail || !resAbyss || !resDetail.avatars || resDetail.avatars.length <= 3) {
      e.reply('角色信息获取失败')
      return true
    }
    delete resDetail._res
    delete resAbyss._res
    ret = await HutaoApi.uploadData({
      uid,
      resDetail,
      resAbyss
    })
  } catch (err) {
    // console.log(err);
  }
  // 更新player信息
  player.setMysCharData(resDetail)

  if (ret && ret.retcode === 0) {
    let stat = []
    if (ret.data) {
      if (resAbyss.floors.length === 0) {
        e.reply('暂未获得本期深渊挑战数据...')
        return true
      }
      let abyss = new Abyss(resAbyss)
      let abyssData = abyss.getData()
      let avatarIds = abyss.getAvatars()
      let overview = ret.info || (await HutaoApi.getOverview())?.data || {}
      let addMsg = function (title, ds) {
        let tmp = {}
        if (!ds) {
          return false
        }
        if (!ds.avatarId && !ds.id) {
          return false
        }
        let char = Character.get(ds.avatarId || ds.id)
        tmp.title = title
        tmp.id = char.id
        tmp.value = `${(ds.value / 10000).toFixed(1)} W`
        let msg = []
        tmp.msg = msg
        let pct = (percent, name) => {
          if (percent < 0.2) {
            msg.push({
              title: '少于',
              value: (Math.max(0.1, 100 - percent * 100)).toFixed(1),
              name: name
            })
          } else {
            msg.push({
              title: '超过',
              value: (Math.min(99.9, percent * 100)).toFixed(1),
              name: name
            })
          }
        }
        if (ds.percent) {
          pct(ds.percent, char.abbr)
          pct(ds.percentTotal, '总记录')
        } else {
          msg.push({
            txt: '暂无统计信息'
          })
        }
        stat.push(tmp)
      }
      addMsg('最强一击', ret.data?.damage || abyssData?.stat?.dmg || {})
      addMsg('最高承伤', ret.data?.takeDamage || abyssData?.stat.takeDmg || {})
      let abyssStat = abyssData?.stat || {}
      lodash.forEach({ defeat: '最多击破', e: '元素战技', q: '元素爆发' }, (title, key) => {
        if (abyssStat[key]) {
          stat.push({
            title,
            id: abyssStat[key]?.id || 0,
            value: `${abyssStat[key]?.value}次`
          })
        } else {
          stat.push({})
        }
      })
      await player.refreshTalent(avatarIds)
      let avatarData = player.getAvatarData(avatarIds)
      return await Common.render('stat/abyss-summary', {
        abyss: abyssData,
        avatars: avatarData,
        stat,
        save_id: uid,
        totalCount: overview?.collectedPlayerCount || 0,
        uid
      }, { e, scale: 1.2 })
    } else {
      e.reply('暂未获得本期深渊挑战数据...')
      return true
    }
  } else {
    e.reply(`${ret.message || '上传失败'}，请稍后重试...`)
  }
  return true
}
