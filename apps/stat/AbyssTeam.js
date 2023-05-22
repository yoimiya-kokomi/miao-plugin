import lodash from 'lodash'
import HutaoApi from './HutaoApi.js'
import { Common } from '#miao'
import { Character, MysApi, Player } from '#miao.models'

export async function AbyssTeam (e) {
  let mys = await MysApi.init(e, 'all')
  if (!mys || !mys.uid) {
    e.reply(`请绑定ck后再使用${e.original_msg || e.msg}`)
    return false
  }
  let player = Player.create(e)
  await player.refreshMysDetail(2)
  await player.refreshTalent()

  let abyssData = await HutaoApi.getAbyssTeam()
  if (!abyssData || !abyssData.data) {
    e.reply('深渊组队数据获取失败，请稍后重试~')
    return true
  }
  abyssData = abyssData.data
  let avatarData = player.getAvatarData()
  let avatarRet = {}
  let data = {}
  let noAvatar = {}
  lodash.forEach(avatarData, (avatar) => {
    let t = avatar.originalTalent || {}
    avatarRet[avatar.id] = Math.min(avatar.level, (avatar.weapon?.level || 1)) * 100 + Math.max(t?.a || 1, t?.e || 1, t?.q || 1) * 1000
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
    let floor = ds.floor
    if (!data[floor]) {
      data[floor] = {
        up: {},
        down: {},
        teams: []
      }
    }
    lodash.forEach(['up', 'down'], (halfKey) => {
      lodash.forEach(ds[halfKey], (ds) => {
        let teamCfg = getTeamCfg(ds.item)
        if (teamCfg) {
          if (!data[floor][halfKey][teamCfg.key]) {
            data[floor][halfKey][teamCfg.key] = {
              count: 0,
              mark: 0,
              hasTeam: teamCfg.mark > 1
            }
          }
          data[floor][halfKey][teamCfg.key].count += ds.rate
          data[floor][halfKey][teamCfg.key].mark += ds.rate * teamCfg.mark
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
        return true
      }
      lodash.forEach(floorData.teams, (t2) => {
        if (t1.mark2 <= 0) {
          return true
        }
        if (t1.half === t2.half || t2.mark2 <= 0) {
          return true
        }

        let teamKey = t1.half === 'up' ? (t1.team + '+' + t2.team) : (t2.team + '+' + t1.team)
        if (ds[teamKey]) {
          return true
        }
        if (hasSame(t1.teamArr, t2.teamArr)) {
          return true
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

  lodash.forEach(avatarData, (ds) => {
    let char = Character.get(ds.id)
    avatarMap[ds.id] = {
      id: ds.id,
      name: ds.name,
      star: ds.star,
      level: ds.level,
      cons: ds.cons,
      face: char.face
    }
  })

  lodash.forEach(noAvatar, (d, id) => {
    let char = Character.get(id)
    avatarMap[id] = {
      id,
      name: char.name,
      face: char.face,
      star: char.star,
      level: 0,
      cons: 0
    }
  })

  return await Common.render('stat/abyss-team', {
    teams: ret,
    avatars: avatarMap
  }, { e, scale: 1.5 })
}
