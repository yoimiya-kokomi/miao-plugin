import { Character, ProfileData } from '../../models/index.js'
import lodash from 'lodash'
import { artiIdx, artiSetMap, attrMap } from './miao-meta.js'

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
  getProfile (ds) {
    let char = Character.get(ds.id)
    let profile = new ProfileData({ id: char.id })
    profile.setBasic({
      level: ds.level,
      cons: ds.constellationNum || 0,
      fetter: ds.fetterLevel,
      costume: char.checkCostume(ds.costumeID) ? ds.costumeID : 0,
      dataSource: 'miao'
    })
    profile.setAttr(MiaoData.getAttr(ds.combatValue))
    profile.setWeapon(MiaoData.getWeapon(ds.weapon))
    profile.setArtis(MiaoData.getArtifact(ds.reliquary))
    let talentRet = MiaoData.getTalent(char.id, ds.skill)
    profile.setTalent(talentRet.talent)
    if (talentRet.elem) {
      profile.elem = talentRet.elem
    }
    return profile
  },
  getAttr (data) {
    let ret = {}
    lodash.forEach({
      atk: 'attack',
      atkBase: 'baseATK',
      hp: 'health',
      hpBase: 'baseHP',
      def: 'defense',
      defBase: 'baseDEF',
      mastery: 'elementMastery',
      cpct: {
        src: 'critRate',
        pct: true
      },
      cdmg: {
        src: 'critDamage',
        pct: true
      },
      heal: {
        src: 'heal',
        pct: true
      },
      recharge: {
        src: 'recharge',
        pct: true
      }
    }, (cfg, key) => {
      if (!lodash.isObject(cfg)) {
        cfg = { src: cfg }
      }
      let val = data[cfg.src] || 0
      if (cfg.pct) {
        val = val * 100
      }
      ret[key] = val
    })
    let maxDmg = 0
    let hurt = data.addHurt || {}
    lodash.forEach('fire,elec,water,grass,wind,rock,ice'.split(','), (key) => {
      maxDmg = Math.max(hurt[key] * 100, maxDmg)
    })
    ret.dmg = maxDmg
    ret.phy = hurt.physical * 100
    return ret
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
      return [attrMap[name], value]
    }

    lodash.forEach(data, (ds) => {
      let sub = ds.appendAffix || []
      let idx = artiIdx[ds.type]
      if (!idx) {
        return
      }
      ret[`arti${idx}`] = {
        name: ds.name,
        set: artiSetMap[ds.name] || '',
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
