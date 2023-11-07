import lodash from 'lodash'
import { Character, Artifact, Weapon } from '#miao.models'

const artisIdxMap = {
  EQUIP_BRACER: 1,
  EQUIP_NECKLACE: 2,
  EQUIP_SHOES: 3,
  EQUIP_RING: 4,
  EQUIP_DRESS: 5,
  生之花: 1,
  死之羽: 2,
  时之沙: 3,
  空之杯: 4,
  理之冠: 5
}


let EnkaData = {
  setAvatar (player, data, dataSource = 'enka') {
    let char = Character.get(data.avatarId)
    if (!char) {
      return
    }
    let avatar = player.getAvatar(char.id, true)
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
    }, dataSource)
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
    let { weapon } = ds
    let w = Weapon.get(ds.itemId)
    return {
      name: w ? w.name : '',
      level: weapon.level,
      promote: weapon.promoteLevel,
      affix: (lodash.values(weapon.affixMap)[0] || 0) + 1
    }
  },

  getTalent (charid, ds = {}) {
    let char = Character.get(charid)
    let { talentId = {}, talentElem = {} } = char.meta
    let elem = ''
    let idx = 0
    let ret = {}
    lodash.forEach(ds, (lv, id) => {
      let key
      if (talentId[id]) {
        let key = talentId[id]
        elem = elem || talentElem[id]
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
    lodash.forEach(data, (ds) => {
      let flat = ds.flat || {}
      let re = ds.reliquary
      let idx = artisIdxMap[flat.equipType]
      if (!idx) {
        return
      }
      let arti = Artifact.get(ds.itemId)
      if (!arti) {
        return true
      }
      ret[idx] = {
        name: arti.name,
        level: Math.min(20, ((re.level) || 1) - 1),
        star: flat.rankLevel || 5,
        mainId: re.mainPropId,
        attrIds: re.appendPropIdList
      }
    })
    return ret
  }
}

export default EnkaData
