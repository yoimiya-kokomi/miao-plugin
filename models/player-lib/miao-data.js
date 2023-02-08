import { Character, Artifact } from '../index.js'
import lodash from 'lodash'

const attrMap = {
  HP: 'hpPlus',
  HP_PERCENT: 'hp',
  ATTACK: 'atkPlus',
  ATTACK_PERCENT: 'atk',
  DEFENSE: 'defPlus',
  DEFENSE_PERCENT: 'def',
  FIRE_ADD_HURT: '',
  ICE_ADD_HURT: 'cryo',
  ROCK_ADD_HURT: 'geo',
  ELEC_ADD_HURT: 'electro',
  WIND_ADD_HURT: 'anemo',
  WATER_ADD_HURT: 'hydro',
  PHYSICAL_ADD_HURT: 'phy',
  GRASS_ADD_HURT: 'dendro',
  HEAL_ADD: 'heal',
  ELEMENT_MASTERY: 'mastery',
  CRITICAL: 'cpct',
  CRITICAL_HURT: 'cdmg',
  CHARGE_EFFICIENCY: 'recharge'
}


let MiaoData = {
  key: 'miao',
  name: '喵喵Api',

  getData (uid, data) {
    let ret = {
      uid,
      chars: {}
    }
    if (data.cacheExpireAt) {
      let exp = Math.max(0, Math.round(data.cacheExpireAt - (new Date() / 1000)))
      ret.ttl = Math.max(60, exp)
    }
    return ret
  },

  getAvatar (ds) {
    let char = Character.get(ds.id)
    return {
      id: ds.id,
      name: char ? char.name : '',
      dataSource: 'miao',
      level: ds.level
    }
  },
  setAvatar (player, ds) {
    let char = Character.get(ds.id)
    let avatar = player.getAvatar(ds.id)
    let talentRet = MiaoData.getTalent(char.id, ds.skill)
    avatar.setAvatar({
      level: ds.level,
      cons: ds.constellationNum || 0,
      fetter: ds.fetterLevel,
      costume: char.checkCostume(ds.costumeID) ? ds.costumeID : 0,
      elem: talentRet.elem,
      weapon: MiaoData.getWeapon(ds.weapon),
      talent: talentRet.talent,
      artis: MiaoData.getArtifact(ds.reliquary)
    }, 'miao')
    return avatar
  },
  getWeapon (weapon) {
    return {
      name: weapon.name,
      star: weapon.rank,
      level: weapon.level,
      promote: weapon.promoteLevel,
      affix: (weapon.affixLevel || 0) + 1
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
      let idx = {
        生之花: 1,
        死之羽: 2,
        时之沙: 3,
        空之杯: 4,
        理之冠: 5
      }[ds.type]
      if (!idx) {
        return
      }
      ret[idx] = {
        name: ds.name,
        set: Artifact.getSetNameByArti(ds.name) || '',
        level: ds.level,
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
  }
}
export default MiaoData
