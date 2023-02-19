import { Character } from '../index.js'
import lodash from 'lodash'

import { attrMap, artisIdxMap } from './ProfileMeta.js'

let MiaoData = {
  setAvatar (player, ds) {
    let char = Character.get(ds.id)
    let avatar = player.getAvatar(ds.id, true)
    let talentRet = MiaoData.getTalent(char.id, ds.skill)
    avatar.setAvatar({
      level: ds.level,
      cons: ds.constellationNum || 0,
      promote: ds.promoteLevel,
      fetter: ds.fetterLevel,
      costume: char.checkCostume(ds.costumeID) ? ds.costumeID : 0,
      elem: talentRet.elem,
      weapon: MiaoData.getWeapon(ds.weapon),
      talent: talentRet.talent,
      artis: MiaoData.getArtifact(ds.reliquary)
    }, 'miao')
    return avatar
  },

  setAvatarNew (player, ds) {
    let char = Character.get(ds.id)
    let avatar = player.getAvatar(ds.id, true)
    let talentRet = MiaoData.getTalentNew(char.id, ds.talent)
    avatar.setAvatar({
      ...ds,
      elem: talentRet.elem,
      talent: talentRet.talent
    }, 'miao')
    return avatar
  },

  getWeapon (weapon) {
    return {
      name: weapon.name,
      level: weapon.level,
      promote: weapon.promoteLevel,
      affix: (weapon.affixLevel || 0) + 1
    }
  },

  getTalentNew (charid, data = {}) {
    let char = Character.get(charid)
    let { talentId = {}, talentElem = {}, talentKey = {} } = char.meta
    let elem = ''
    let idx = 0
    let ret = {}
    lodash.forEach(data, (level, id) => {
      let key
      if (talentId[id]) {
        let tid = talentId[id]
        key = talentKey[tid]
        elem = elem || talentElem[tid]
        ret[key] = level
      } else {
        key = ['a', 'e', 'q'][idx]
        ret[key] = level
      }
      idx++
    })
    return {
      talent: ret,
      elem
    }
  },

  getTalent (charid, data = {}) {
    let char = Character.get(charid)
    let { talentId = {}, talentElem = {}, talentKey = {} } = char.meta
    let elem = ''
    let idx = 0
    let ret = {}
    lodash.forEach(data, (ds) => {
      let key
      if (talentId[ds.id]) {
        let tid = talentId[ds.id]
        key = talentKey[tid]
        elem = elem || talentElem[tid]
        ret[key] = {
          level: ds.level
        }
      } else {
        key = ['a', 'e', 'q'][idx++]
        ret[key] = ret[key] || {
          level: ds.level
        }
      }
    })
    return {
      talent: ret,
      elem
    }
  },

  getArtifact (data) {
    let ret = {}
    let get = function (d) {
      if (!d) {
        return []
      }
      let name = d.name
      name = name.replace('FIGHT_PROP_', '')
      if (!attrMap[name]) {
        return []
      }
      let value = d.value
      if (value && value < 1) {
        value = value * 100
      }
      return { key: attrMap[name], value }
    }
    lodash.forEach(data, (ds) => {
      let sub = ds.appendAffix || []
      let idx = artisIdxMap[ds.type]
      if (!idx) {
        return
      }
      ret[idx] = {
        name: ds.name,
        level: ds.level,
        star: ds.rank,
        main: get(ds.mainAffix),
        attrs: [
          get(sub[0]),
          get(sub[1]),
          get(sub[2]),
          get(sub[3])
        ]
      }
    })
    return ret
  }
}
export default MiaoData
