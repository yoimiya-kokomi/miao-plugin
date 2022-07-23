/*
* 胡桃数据库的统计
*
* */
import { HutaoApi, Character } from '../components/models.js'
import { Cfg } from '../components/index.js'
import lodash from 'lodash'
import fs from 'fs'
import Common from '../components/Common.js'

export async function consStat (e, { render }) {
  if (Cfg.isDisable(e, 'wiki.abyss')) {
    return
  }

  let consData = await HutaoApi.getCons()

  if (!consData) {
    e.reply('角色持有数据获取失败，请稍后重试~')
    return true
  }

  let msg = e.msg

  let mode = /持有/.test(msg) ? 'char' : 'cons'

  let conNum = -1
  if (mode === 'cons') {
    lodash.forEach([/0|零/, /1|一/, /2|二/, /3|三/, /4|四/, /5|五/, /6|六|满/], (reg, idx) => {
      if (reg.test(msg)) {
        conNum = idx
        return false
      }
    })
  }

  if (!consData && !consData.data) {
    return true
  }

  let data = consData.data

  let Lumine = lodash.filter(data, (ds) => ds.avatar === 10000007)[0] || {}
  let Aether = lodash.filter(data, (ds) => ds.avatar === 10000005)[0] || {}

  Lumine.holdingRate = (1 - Aether.holdingRate) || Lumine.holdingRate

  let ret = []

  lodash.forEach(data, (ds) => {
    let char = Character.get(ds.avatar)

    let data = {
      name: char.name || ds.avatar,
      star: char.star || 3,
      hold: ds.holdingRate
    }

    if (mode === 'char') {
      data.cons = lodash.map(ds.rate, (c) => {
        c.value = c.value * ds.holdingRate
        return c
      })
    } else {
      data.cons = ds.rate
    }
    data.cons = lodash.sortBy(data.cons, ['id'])

    ret.push(data)
  })

  if (conNum > -1) {
    ret = lodash.sortBy(ret, [`cons[${conNum}].value`])
    ret.reverse()
  } else {
    ret = lodash.sortBy(ret, ['hold'])
  }
  // 渲染图像
  return await Common.render('stat/character', {
    chars: ret,
    abbr: Character.getAbbr(),
    mode,
    conNum,
    lastUpdate: consData.lastUpdate,
    pct: function (num) {
      return (num * 100).toFixed(2)
    }
  }, { e, render, scale: 1.5 })
}

export async function abyssPct (e, { render }) {
  if (Cfg.isDisable(e, 'wiki.abyss')) {
    return
  }

  let mode = /使用/.test(e.msg) ? 'use' : 'pct'
  let modeName
  let abyssData
  let modeMulti = 1

  if (mode === 'use') {
    modeName = '使用率'
    abyssData = await HutaoApi.getAbyssUse()
  } else {
    modeName = '出场率'
    abyssData = await HutaoApi.getAbyssPct()
    modeMulti = 8
  }

  if (!abyssData) {
    e.reply(`深渊${modeName}数据获取失败，请稍后重试~`)
    return true
  }

  let ret = []
  let chooseFloor = -1
  let msg = e.msg

  const floorName = {
    12: '十二层',
    11: '十一层',
    10: '十层',
    9: '九层'
  }

  // 匹配深渊楼层信息
  lodash.forEach(floorName, (cn, num) => {
    let reg = new RegExp(`${cn}|${num}`)
    if (reg.test(msg)) {
      chooseFloor = num
      return false
    }
  })

  let data = abyssData.data
  data = lodash.sortBy(data, 'floor')
  data = data.reverse()

  lodash.forEach(data, (floorData) => {
    let avatars = []
    lodash.forEach(floorData.avatarUsage, (ds) => {
      let char = Character.get(ds.id)
      if (char) {
        avatars.push({
          name: char.name,
          star: char.star,
          value: ds.value * modeMulti
        })
      }
    })
    avatars = lodash.sortBy(avatars, 'value', ['asc'])
    avatars.reverse()
    if (chooseFloor === -1) {
      avatars = avatars.slice(0, 14)
    }

    ret.push({
      floor: floorData.floor,
      avatars
    })
  })

  return await Common.render('stat/abyss-pct', {
    abyss: ret,
    floorName,
    chooseFloor,
    mode,
    modeName,
    lastUpdate: abyssData.lastUpdate
  }, { e, render, scale: 1.5 })
}

async function getTalentData (e, isUpdate = false) {
  // 技能查询缓存
  let cachePath = './data/cache/'
  if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath)
  }
  cachePath += 'talentList/'
  if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath)
  }

  let avatarRet = []
  let uid = e.selfUser.uid

  let hasCache = await redis.get(`cache:uid-talent-new:${uid}`)
  if (hasCache) {
    // 有缓存优先使用缓存
    let jsonRet = fs.readFileSync(cachePath + `${uid}.json`, 'utf8')
    avatarRet = JSON.parse(jsonRet)
    return avatarRet
  } else if (!isUpdate) {
    e.noReplyTalentList = true
    await global.YunzaiApps.mysInfo.talentList(e)
    return await getTalentData(e, true)
  }
  return false
}

export async function abyssTeam (e, { render }) {
  if (Common.todoV3(e)) {
    return true
  }
  let MysApi = await e.getMysApi({
    auth: 'cookie', // 所有用户均可查询
    targetType: 'self', // 被查询用户可以是任意用户
    cookieType: 'self' // cookie可以是任意可用cookie
  })

  if (!MysApi || !MysApi.selfUser || !MysApi.selfUser.uid) {
    return true
  }

  let abyssData = await HutaoApi.getAbyssTeam()
  if (!abyssData || !abyssData.data) {
    e.reply('深渊组队数据获取失败，请稍后重试~')
    return true
  }
  abyssData = abyssData.data
  let talentData = await getTalentData(e)
  if (!talentData || talentData.length === 0) {
    e.reply('暂时未能获得角色的练度信息，请使用【#练度统计】命令尝试手工获取...')
    return true
  }

  let avatarRet = {}
  let data = {}

  let noAvatar = {}

  lodash.forEach(talentData, (avatar) => {
    avatarRet[avatar.id] = Math.min(avatar.level, avatar.weapon_level) * 100 + Math.max(avatar.a_original, avatar.e_original, avatar.q_original) * 1000
  })

  let getTeamCfg = (str) => {
    let teams = str.split(',')
    teams.sort()
    let teamMark = 0
    lodash.forEach(teams, (a) => {
      if (!avatarRet[a]) {
        teamMark = -1
        noAvatar[a] = true
      }
      if (teamMark !== -1) {
        teamMark += avatarRet[a] * 1
      }
    })
    if (teamMark === -1) {
      teamMark = 1
    }

    return {
      key: teams.join(','),
      mark: teamMark
    }
  }

  let hasSame = function (team1, team2) {
    for (let idx = 0; idx < team1.length; idx++) {
      if (team2.includes(team1[idx])) {
        return true
      }
    }
    return false
  }

  lodash.forEach(abyssData, (ds) => {
    let floor = ds.level.floor
    if (!data[floor]) {
      data[floor] = {
        up: {},
        down: {},
        teams: []
      }
    }
    lodash.forEach(ds.teams, (ds) => {
      lodash.forEach(['up', 'down'], (halfKey) => {
        let teamCfg = getTeamCfg(ds.id[`${halfKey}Half`])
        if (teamCfg) {
          if (!data[floor][halfKey][teamCfg.key]) {
            data[floor][halfKey][teamCfg.key] = {
              count: 0,
              mark: 0,
              hasTeam: teamCfg.mark > 1
            }
          }
          data[floor][halfKey][teamCfg.key].count += ds.value
          data[floor][halfKey][teamCfg.key].mark += ds.value * teamCfg.mark
        }
      })
    })

    let temp = []
    lodash.forEach(['up', 'down'], (halfKey) => {
      lodash.forEach(data[floor][halfKey], (ds, team) => {
        temp.push({
          team,
          teamArr: team.split(','),
          half: halfKey,
          count: ds.count,
          mark: ds.mark,
          mark2: 1,
          hasTeam: ds.hasTeam
        })
      })
      temp = lodash.sortBy(temp, 'mark')
      data[floor].teams = temp.reverse()
    })
  })

  let ret = {}

  lodash.forEach(data, (floorData, floor) => {
    ret[floor] = {}
    let ds = ret[floor]
    lodash.forEach(floorData.teams, (t1) => {
      if (t1.mark2 <= 0) {
        return
      }
      lodash.forEach(floorData.teams, (t2) => {
        if (t1.mark2 <= 0) {
          return false
        }
        if (t1.half === t2.half || t2.mark2 <= 0) {
          return
        }

        let teamKey = t1.half === 'up' ? (t1.team + '+' + t2.team) : (t2.team + '+' + t1.team)
        if (ds[teamKey]) {
          return
        }
        if (hasSame(t1.teamArr, t2.teamArr)) {
          return
        }

        ds[teamKey] = {
          up: t1.half === 'up' ? t1 : t2,
          down: t1.half === 'up' ? t2 : t1,
          count: Math.min(t1.count, t2.count),
          mark: t1.hasTeam && t2.hasTeam ? t1.mark + t2.mark : t1.count + t2.count // 如果不存在组队则进行评分惩罚
        }
        t1.mark2--
        t2.mark2--
        return false
      })
      if (lodash.keys(ds).length >= 20) {
        return false
      }
    })
  })

  lodash.forEach(ret, (ds, floor) => {
    ds = lodash.sortBy(lodash.values(ds), 'mark')
    ds = ds.reverse()
    ds = ds.slice(0, 4)

    lodash.forEach(ds, (team) => {
      team.up.teamArr = Character.sortIds(team.up.teamArr)
      team.down.teamArr = Character.sortIds(team.down.teamArr)
    })

    ret[floor] = ds
  })

  let avatarMap = {}

  lodash.forEach(talentData, (ds) => {
    avatarMap[ds.id] = {
      id: ds.id,
      name: ds.name,
      star: ds.rarity,
      level: ds.level,
      cons: ds.cons
    }
  })

  lodash.forEach(noAvatar, (d, id) => {
    let char = Character.get(id)
    avatarMap[id] = {
      id,
      name: char.name,
      star: char.star,
      level: 0,
      cons: 0
    }
  })

  return await Common.render('stat/abyss-team', {
    teams: ret,
    avatars: avatarMap
  }, { e, render, scale: 1.5 })
}

export async function uploadData (e) {
  let MysApi = await e.getMysApi({
    auth: 'cookie',
    targetType: 'self',
    cookieType: 'self',
    action: '获取信息'
  })
  if (!MysApi) return
  let ret = {}
  let uid = e.selfUser.uid
  try {
    let resDetail = await MysApi.getCharacter()
    let resAbyss = await MysApi.getSpiralAbyss(1)
    // Data.writeJson('/test-data', 'abyss.json', resAbyss);
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
  if (ret && ret.retcode === 0) {
    let msg = [`uid:${uid}本次深渊记录上传成功~ \n多谢支持，φ(>ω<*) 喵~`]
    if (ret.data) {
      let addMsg = function (title, ds) {
        if (!ds && !ds.avatarId && !ds.percent) {
          return
        }
        let char = Character.get(ds.avatarId)
        title = `${title}：${char.name}(${(ds.value / 10000).toFixed(1)}W)`

        let pct = (percent, name) => {
          if (percent < 0.2) {
            title += `，少于${(Math.max(0.1, 100 - percent * 100)).toFixed(1)}%的${name}`
          } else {
            title += `，超过${(Math.min(99.9, percent * 100)).toFixed(1)}%的${name}`
          }
        }
        pct(ds.percent, char.name)
        pct(ds.percentTotal, '总记录')
        msg.push(title)
      }
      msg.push('当前数据记录：')
      addMsg('【最强一击】', ret.data.damage || {})
      addMsg('【承受伤害】', ret.data.takeDamage || {})
      msg.push('排行会随时间而更新，数据仅供参考~')
    }
    e.reply(msg.join('\n'))
  } else {
    e.reply(`${ret.message || '上传失败'}，请稍后重试...`)
  }
  return true
}
