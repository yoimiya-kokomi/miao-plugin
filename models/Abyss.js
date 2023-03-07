/*
* Mys深渊数据处理
* */

import lodash from 'lodash'
import moment from 'moment'
import Base from '../models/Base.js'
import { Data } from '#miao'

moment.locale('zh-cn')

export default class Abyss extends Base {
  constructor (data) {
    super()
    this.floors = {}
    let floors = this.floors
    lodash.forEach(data.floors, (floor) => {
      let levels = {}
      let floorData = {
        star: floor.star,
        index: floor.index,
        levels
      }
      lodash.forEach(floor.levels, (level) => {
        let ds = {
          star: level.star
        }
        levels[level.index] = ds

        lodash.forEach(level.battles, (battle) => {
          let key = battle.index === 1 ? 'up' : 'down'
          let tmp = {}
          tmp.timestamp = battle.timestamp
          let time = moment(new Date(battle.timestamp * 1000))
          tmp.time = time.format('MM-DD HH:mm:ss')
          let avatars = []
          lodash.forEach(battle.avatars, (avatar) => {
            avatars.push(avatar.id)
          })
          tmp.avatars = avatars
          ds[key] = tmp
        })
      })
      floorData.display = levels['3'] || levels['2'] || levels['1']
      floors[floor.index] = floorData
    })
    let keys = 'id:avatar_id,value'
    this.reveral = lodash.map(data.reveal_rank, (ds) => Data.getData(ds, keys))
    let stat = {}
    this.stat = stat
    lodash.forEach({
      defeat: 'defeat_rank',
      dmg: 'damage_rank',
      takeDmg: 'take_damage_rank',
      e: 'normal_skill_rank',
      q: 'energy_skill_rank'
    }, (key, dst) => {
      stat[dst] = Data.getData(data[key] ? data[key][0] : [], keys)
    })
    let st = moment(new Date(data.start_time * 1000))
    this.schedule = st.format('M') + '月' + (st.format('D') * 1 > 1 ? '下半' : '上半')
    this.maxFloor = data.max_floor
    this.total = data.total_battle_times
    this.time = moment().format('MM-DD HH:mm:ss')
  }

  getData (floor) {
    return Data.getData(this, 'reveral,stat,floors,time,schedule,maxFloor,total')
  }

  getAvatars () {
    let ret = {}
    lodash.forEach(this.reveral, (ds) => {
      if (ds.id) {
        ret[ds.id] = true
      }
    })
    lodash.forEach(this.stat, (ds) => {
      if (ds.id) {
        ret[ds.id] = true
      }
    })
    lodash.forEach(this.floors, (floor) => {
      let levels = floor?.levels || {}
      lodash.forEach(levels, (level) => {
        lodash.forEach(level.up?.avatars || [], (id) => {
          if (id) {
            ret[id] = true
          }
        })
        lodash.forEach(level.down?.avatars || [], (id) => {
          if (id) {
            ret[id] = true
          }
        })
      })
    })
    return lodash.keys(ret)
  }
}
