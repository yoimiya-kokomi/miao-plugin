import lodash from 'lodash'
import { attrMap, idsMap, artisIdxMap } from './ProfileMeta.js'
import { Character, ArtifactSet } from '../index.js'

let EnkaData = {
  setAvatar (player, data) {
    let char = Character.get(data.avatarId)
    if (!char) {
      return
    }
    let avatar = player.getAvatar(char.id)
    let talentRet = EnkaData.getTalent(char.id, data.skillLevelMap)
    avatar.setAvatar({
      level: data.propMap['4001'].val * 1,
      promote: data.propMap['1002'].val * 1,
      cons: data.talentIdList ? data.talentIdList.length : 0,
      fetter: data.fetterInfo.expLevel,
      costume: char.checkCostume(data.costumeId) ? data.costumeId : 0,
      elem: talentRet.elem,
      weapon: EnkaData.getWeapon(data.equipList),
      talent: talentRet.talent,
      artis: EnkaData.getArtifact(data.equipList)
    }, 'enka')
    return avatar
  },

  getWeapon (data) {
    let ds = {}
    lodash.forEach(data, (temp) => {
      if (temp.flat && temp.flat.itemType === 'ITEM_WEAPON') {
        ds = temp
        return false
      }
    })
    let { weapon, flat } = ds
    return {
      name: idsMap[flat.nameTextMapHash],
      level: weapon.level,
      promote: weapon.promoteLevel,
      affix: (lodash.values(weapon.affixMap)[0] || 0) + 1
    }
  },

  getTalent (charid, ds = {}) {
    let char = Character.get(charid)
    let { talentId = {}, talentElem = {}, talentKey = {} } = char.meta
    let elem = ''
    let idx = 0
    let ret = {}
    lodash.forEach(ds, (lv, id) => {
      let key
      if (talentId[id]) {
        let tid = talentId[id]
        key = talentKey[tid]
        elem = elem || talentElem[tid]
        ret[key] = lv
      } else {
        key = ['a', 'e', 'q'][idx++]
        ret[key] = ret[key] || lv
      }
    })
    return {
      elem: elem,
      talent: ret
    }
  },

  getArtifact (data) {
    let ret = {}
    let get = function (d) {
      if (!d) {
        return {}
      }
      let id = d.appendPropId || d.mainPropId || ''
      id = id.replace('FIGHT_PROP_', '')
      if (!attrMap[id]) {
        return {}
      }
      return { key: attrMap[id], value: d.statValue }
    }
    lodash.forEach(data, (ds) => {
      let flat = ds.flat || {}
      let sub = flat.reliquarySubstats || []
      let idx = artisIdxMap[flat.equipType]
      if (!idx) {
        return
      }
      let setName = idsMap[flat.setNameTextMapHash] || ''
      ret[idx] = {
        name: ArtifactSet.getArtiNameBySet(setName, idx),
        level: Math.min(20, ((ds.reliquary && ds.reliquary.level) || 1) - 1),
        main: get(flat.reliquaryMainstat),
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

export default EnkaData
