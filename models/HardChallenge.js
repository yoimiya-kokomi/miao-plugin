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
    this.best = data.single.best
    this.challs = []
    this.popularity_avatar_ids = new Set(lodash.map(popularity, (item) => item.avatar_id.toString()))
    lodash.forEach(data.single.challenge, (chall) => {
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

  applyPopularity (rawAvatarData) {
    return lodash.mapValues(rawAvatarData, (avatar) => {
      avatar.is_popularity = this.popularity_avatar_ids.has(avatar.id.toString())
      return avatar
    })
  }
}
