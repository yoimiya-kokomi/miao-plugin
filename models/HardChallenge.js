/*
* Mys幽境危战数据处理
* */

import lodash from 'lodash'
import moment from 'moment'

import Base from './Base.js'
import Character from './Character.js'
import { Data } from '#miao'

moment.locale('zh-cn')

export default class HardChallenge extends Base {
  constructor (data, popularity) {
    super()
    this.best = data.best.best
    this.challs = []
    this.popularity_avatar_ids = new Set(lodash.map(popularity, (item) => item.avatar_id.toString()))
    lodash.forEach(data.best.challenge, (chall) => {
      let tmp = {
        name: chall.name,
        monster: {
          ...chall.monster,
          desc: chall.monster.desc
            .filter(d => d !== '')
            .map(d => d.replace(/<color=([^>]+)>/g, '<span style="color:$1">')
                       .replace(/<\/color>/g, '</span>'))
        },
        second: chall.second,
      }
      let avatars = []
      lodash.forEach(chall.teams, (avatar) => {
        avatars.push({
          avatar_id: avatar.avatar_id.toString(),
          name: avatar.name,
          level: avatar.level,
          rarity: avatar.rarity,
          rank: avatar.rank
        })
      })
      let best_avatars = []
      lodash.forEach(chall.best_avatar, (avatar) => {
        best_avatars.push({
          avatar_id: avatar.avatar_id.toString(),
          dps: avatar.dps,
        })
      })

      tmp.avatars = avatars
      tmp.best_avatars = best_avatars
      this.challs.push(tmp)
    })
    let time
    time = moment(new Date(data.schedule.start_time * 1000))
    this.start_time = time.format('MM-DD HH:mm:ss')
    time = moment(new Date(data.schedule.end_time * 1000))
    this.end_time = time.format('MM-DD HH:mm:ss')
  }

  getData () {
    return Data.getData(this, 'best,challs,start_time,end_time')
  }

  getAvatars () {
    let ret = {}
    lodash.forEach(this.challs, (chall) => {
      lodash.forEach(chall.avatars || [], (avatar) => {
        if (avatar.avatar_id) {
          ret[avatar.avatar_id] = true
        }
      })
    })
    return lodash.keys(ret)
  }

  addFakeCharacters (avatarData) {
    // 组队模式下，将请求数据与自己角色的数据进行比对
    // 如果
    // 1. 自己没有该角色
    // 2. 请求数据角色等级比自己的角色要高
    // 3. 请求数据角色命座比自己的角色要高
    // 若至少满足上述其一，就认为组队模式下该角色是别人的角色
    // （请求数据中没有字段来区分是自己的角色还是别人的角色，所以只能看个大概就是）
    let ret = {}
    lodash.forEach(this.challs, (chall) => {
      lodash.forEach(chall.avatars || [], (avatar) => {
        if (avatar.avatar_id) {
          let chall_avatar_id = avatar.avatar_id
          let buildFakeCharacters = false
          if (!(chall_avatar_id in ret)) {
            if (chall_avatar_id in avatarData) {
              let own_avatar = avatarData[chall_avatar_id]
              if ((own_avatar.cons < avatar.rank) || (own_avatar.level < avatar.level)) {
                buildFakeCharacters = true
              }
            } else {
              buildFakeCharacters = true
            }
          }
          if (buildFakeCharacters) {
            let fakeCharacter = new Character({
              id: +chall_avatar_id,
              name: avatar.name
            })
            let detailInfo = fakeCharacter.getDetail()
            ret[chall_avatar_id] = {
              id: +chall_avatar_id,
              name: avatar.name,
              level: avatar.level,
              star: detailInfo.star,
              cons: avatar.rank,
              elem: detailInfo.elem,
              abbr: detailInfo.abbr,
              face: fakeCharacter.face,
              qFace: fakeCharacter.qFace,
              side: fakeCharacter.side,
              gacha: fakeCharacter.gacha
            }
          } else {
            ret[chall_avatar_id] = avatarData[chall_avatar_id]
          }
        }
      })
    })
    return ret
  }

  applyPopularity (rawAvatarData) {
    return lodash.mapValues(rawAvatarData, (avatar) => {
      avatar.is_popularity = this.popularity_avatar_ids.has(avatar.id.toString())
      return avatar
    })
  }
}
