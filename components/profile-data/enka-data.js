import lodash from 'lodash'
import enkaMeta from './enka-meta.js'
import { Character, ArtifactSet, ProfileData } from '../../models/index.js'

const artiIdx = {
  EQUIP_BRACER: 1,
  EQUIP_NECKLACE: 2,
  EQUIP_SHOES: 3,
  EQUIP_RING: 4,
  EQUIP_DRESS: 5
}

const attrMap = {
  HP: '小生命',
  HP_PERCENT: '大生命',
  ATTACK: '小攻击',
  ATTACK_PERCENT: '大攻击',
  DEFENSE: '小防御',
  DEFENSE_PERCENT: '大防御',
  FIRE_ADD_HURT: '火元素伤害加成',
  ICE_ADD_HURT: '冰元素伤害加成',
  ROCK_ADD_HURT: '岩元素伤害加成',
  ELEC_ADD_HURT: '雷元素伤害加成',
  WIND_ADD_HURT: '风元素伤害加成',
  WATER_ADD_HURT: '水元素伤害加成',
  PHYSICAL_ADD_HURT: '物理伤害加成',
  GRASS_ADD_HURT: '草元素伤害加成',
  HEAL_ADD: '治疗加成',
  ELEMENT_MASTERY: '元素精通',
  CRITICAL: '暴击率',
  CRITICAL_HURT: '暴击伤害',
  CHARGE_EFFICIENCY: '充能效率'
}

let EnkaData = {
  getProfile (data) {
    let char = Character.get(data.avatarId)
    let profile = new ProfileData({ id: char.id })
    profile.setBasic({
      level: data.propMap['4001'].val * 1,
      cons: data.talentIdList ? data.talentIdList.length : 0,
      fetter: data.fetterInfo.expLevel,
      costume: char.checkCostume(data.costumeId) ? data.costumeId : 0,
      dataSource: 'enka'
    })
    profile.setAttr(EnkaData.getAttr(data.fightPropMap))
    profile.setWeapon(EnkaData.getWeapon(data.equipList))
    profile.setArtis(EnkaData.getArtifact(data.equipList))
    let talentRet = EnkaData.getTalent(char.id, data.skillLevelMap)
    profile.setTalent(talentRet.talent, 'original')
    // 为旅行者增加elem
    if (talentRet.elem) {
      profile.elem = talentRet.elem
    }
    return EnkaData.dataFix(profile)
  },
  getAttr (data) {
    let ret = {}
    let attrKey = {
      // atk: 2001,
      atkBase: 4,
      def: 2002,
      defBase: 7,
      hp: 2000,
      hpBase: 1,
      mastery: 28,
      cpct: {
        src: 20,
        pct: true
      },
      cdmg: {
        src: 22,
        pct: true
      },
      heal: {
        src: 26,
        pct: true
      },
      recharge: {
        src: 23,
        pct: true
      }
    }
    lodash.forEach(attrKey, (cfg, key) => {
      if (!lodash.isObject(cfg)) {
        cfg = { src: cfg }
      }
      let val = data[cfg.src] || 0
      if (cfg.pct) {
        val = val * 100
      }
      ret[key] = val
    })
    ret.atk = data['4'] * (1 + (data['6'] || 0)) + (data['5'] || 0)
    let maxDmg = 0
    // 火40  水42 风44 岩45 冰46 雷46
    // 41 雷
    lodash.forEach('40,41,42,43,44,45,45,46'.split(','), (key) => {
      maxDmg = Math.max(data[key] * 1, maxDmg)
    })
    // phy 30
    ret.dmg = maxDmg * 100
    ret.phy = data['30'] * 100

    return ret
  },

  getArtifact (data) {
    let ret = {}

    let get = function (d) {
      if (!d) {
        return []
      }
      let id = d.appendPropId || d.mainPropId || ''
      id = id.replace('FIGHT_PROP_', '')
      if (!attrMap[id]) {
        return []
      }
      return [attrMap[id], d.statValue]
    }
    lodash.forEach(data, (ds) => {
      let flat = ds.flat || {}
      let sub = flat.reliquarySubstats || []
      let idx = artiIdx[flat.equipType]
      if (!idx) {
        return
      }
      let setName = enkaMeta[flat.setNameTextMapHash] || ''
      ret[idx] = {
        name: ArtifactSet.getArtiNameBySet(setName, idx),
        set: setName,
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
      name: enkaMeta[flat.nameTextMapHash],
      star: flat.rankLevel,
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
        ret[key] = {
          original: lv
        }
      } else {
        key = ['a', 'e', 'q'][idx++]
        ret[key] = ret[key] || {
          original: lv
        }
      }
    })
    return {
      elem: elem,
      talent: ret
    }
  },
  dataFix (ret) {
    if (ret._fix) {
      return ret
    }
    let { attr, id, weapon } = ret
    let count = 0
    id = id * 1
    switch (id) {
      case 10000052:
        // 雷神被动加成fix
        attr.dmg = Math.max(0, attr.dmg - (attr.recharge - 100) * 0.4)
        break
      case 10000041:
        // 莫娜被动fix
        attr.dmg = Math.max(0, attr.dmg - attr.recharge * 0.2)
        break
      case 10000070:
        // 妮露满命效果fix
        if (ret.cons === 6) {
          count = Math.floor(attr.hp / 1000)
          attr.cpct = Math.max(5, attr.cpct - Math.min(30, count * 0.6))
          attr.cdmg = Math.max(50, attr.cdmg - Math.min(60, count * 1.2))
        }
        break
    }
    let wDmg = {
      息灾: 12,
      波乱月白经津: 12,
      雾切之回光: 12,
      猎人之径: 12
    }
    let { name, affix } = weapon
    // 修正武器的加伤
    if (wDmg[name]) {
      attr.dmg = Math.max(0, attr.dmg - wDmg[name] - wDmg[name] * (affix - 1) / 4)
    }
    ret._fix = true
    return ret
  }
}

export default EnkaData
