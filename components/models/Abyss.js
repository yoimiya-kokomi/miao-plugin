import Base from '../models/Base.js'
import lodash from 'lodash'
import Data from '../Data.js'
import moment from 'moment'

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
  }

  getData (floor) {
    return Data.getData(this, 'reveral,stat,floors')
  }

  getDisplayAvatars () {
    let ret = {}
    lodash.forEach(this.floors, (floor) => {
      let display = floor?.display || {}
      lodash.forEach(display.up?.avatars || [], (id) => {
        ret[id] = true
      })
      lodash.forEach(display.down?.avatars || [], (id) => {
        ret[id] = true
      })
    })
    return lodash.keys(ret)
  }
}
