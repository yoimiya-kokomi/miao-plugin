import Base from './Base.js'
import lodash from 'lodash'
import Data from '../Data.js'
import Artifact from './Artifact.js';

export default class Avatars extends Base {
  constructor (datas) {
    super()
    let avatars = {}
    lodash.forEach(datas, (avatar) => {
      let data = Data.getData(avatar, 'id,name,level,star:rarity,cons:actived_constellation_num,fetter')
      data.weapon = Data.getData(avatar.weapon, 'name,affix:affix_level,level,star:rarity')
      let artis = {}
      let sets = {}
      lodash.forEach(avatar.reliquaries, (arti) => {
        artis[arti.pos] = Data.getData(arti, 'name,level,set:set.name')
        sets[arti.set.name] = (sets[arti.set.name] || 0) + 1
      })
      data.artis = artis
      data.set = {}
      for (let set in sets) {
        if (sets[set] >= 4) {
          data.set[set] = 4
        } else if (sets[set] >= 2) {
          data.set[set] = 2
        }
      }
      data.sets = []
      lodash.forEach(data.set, (v, k) => {
        let name = Artifact.getArtiBySet(k)
        if (name) {
          data.sets.push(name)
        }
      })
      avatars[data.id] = data
    })
    this.avatars = avatars
  }

  getData (ids, withTalent = false) {
    let rets = {}
    let avatars = this.avatars
    lodash.forEach(ids, (id) => {
      rets[id] = avatars[id] || {}
    })
    return rets
  }
}
