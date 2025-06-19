import { Meta } from '#miao'
import { Character, Artifact, Weapon } from '#miao.models'
import { propertyType2attrName } from './MysPanelHSRMappings.js'
import lodash from 'lodash'

let MysPanelHSRData = {
  setAvatar (player, ds) {
    let char = Character.get(ds.id)
    let avatar = player.getAvatar(ds.id, true)
    if (!char) {
      return false
    }

    avatar.setAvatar({
      level: ds.level,
      cons: ds.rank,
      weapon: ds.equip ? MysPanelHSRData.getWeapon(ds.equip) : null,
      talent: MysPanelHSRData.getTalent(
        char,
        ds.rank,
        ds.skills,
        ds.servant_detail?.servant_skills || []
      ),
      trees: MysPanelHSRData.getTrees(ds.skills),
      artis: MysPanelHSRData.getArtifact([...ds.relics, ...ds.ornaments])
    }, 'mysPanelHSR')
    return avatar
  },

  getWeapon (data) {
    return {
      id: data.id,
      level: data.level, // 等级
      affix: data.rank // 叠影
    }
  },

  getTalent (char, cons, ds = {}, servant_skills = []) {
    let { talentId = {}, talentCons = {} } = char.meta
    let idx = 0
    let ret = {}
    const skillKeys = ['a', 'e', 'q', 't', 'z', 'me', 'mt']
    lodash.forEach(ds, (talent_data) => {
      const id = talent_data.point_id
      const lv = talent_data.level
      let key
      if (talentId[id]) {
        key = talentId[id]
        ret[key] = lv
      } else if (talent_data.point_type == 2) {
        key = skillKeys[idx] || `unk${idx}`
        idx++
        ret[key] = ret[key] || lv
      }
    })
    if (Array.isArray(servant_skills) && servant_skills.length !== 0) {
      let me = servant_skills[0]?.level ?? 0
      let mt = servant_skills[1]?.level ?? 0
      ret['me'] = me
      ret['mt'] = mt
    }
    if (cons >= 3) {
      lodash.forEach(talentCons, (lv, key) => {
        let addTalent = { a: 1, e: 2, q: 2, t: 2, me: 1, mt: 1 }
        if (lv != 0 && ret[key] && cons >= lv) ret[key] = Math.max(1, ret[key] - addTalent[key])
      })
    }
    return ret
  },

  getTrees (data) {
    return lodash(data)
      .filter(skill => skill.point_type !== 2 && skill.is_activated)
      .map('point_id')
      .value()
  },

  getArtifact (data) {
    let ret = {}
    lodash.forEach(data, (ds) => {
      let idx = ds.pos
      if (!idx) {
        return
      }
      let arti = Artifact.get(ds.id, 'sr')
      if (!arti) {
        return true
      }
      // 只需要计算增益个数即可
      ret[idx] = {
        id: ds.id,
        level: Math.min(15, (ds.level) || 0),
        star: ds.rarity || 5,
        mainId: MysPanelHSRData.getArtifactMainId(idx, ds.main_property),
        attrIds: MysPanelHSRData.getArtifactAttrIds(ds.rarity, ds.properties)
      }
    })
    return ret
  },

  getArtifactMainId(pos, main_property) {
    const { metaData } = Meta.getMeta('sr', 'arti')
    const propertyName = propertyType2attrName[main_property.property_type]
    const propertyName2Id = lodash.invert(metaData['mainIdx'][pos])
    const ret = +propertyName2Id[propertyName]
    return ret
  },

  getArtifactAttrId(rarity, curTime, propertyType, valueStr) {
    const { metaData } = Meta.getMeta('sr', 'arti')
    const propertyName = propertyType2attrName[propertyType]
    const subAttrInfo = metaData['starData'][rarity]['sub']
    const propertyId = lodash.findKey(subAttrInfo, obj => obj.key === propertyName);
    // base: 最大取值
    // step: 减去的多少
    const {base, step} = subAttrInfo[propertyId]
    // Is valueStr a fixed value or a percentage?
    let destValueSum
    if (valueStr.substring(-1) == '%') {
      destValueSum = parseFloat(valueStr.slice(0, -1))
    } else {
      destValueSum = parseFloat(valueStr);
    }
    const numSteps = Math.round((destValueSum - (curTime * base)) / step)
    return `${propertyId},${curTime},${numSteps}`;
  },

  getArtifactAttrIds(rarity, sub_property_list) {
    let attrIds = []
    lodash.forEach(sub_property_list, (sub_property) => {
      const { property_type, value, times} = sub_property
      const combination = MysPanelHSRData.getArtifactAttrId(rarity, times, property_type, value)
      attrIds = [ ...attrIds, combination ]
    })
    return attrIds
  }
}
export default MysPanelHSRData
