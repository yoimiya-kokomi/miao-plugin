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
      talent: MysPanelHSRData.getTalent(char, ds.skills),
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

  getTalent (char, ds = {}) {
    // 照抄 EnkaData 实现
    let { talentId = {}, talentElem = {} } = char.meta
    // 这里编号有出入，需要先洗一下
    // e.g. 800501 -> 8005001
    talentId = lodash.mapKeys(talentId, (value, key) => {
      return key.substring(0, 4) + '0' + key.substring(4)
    })
    let idx = 0
    let ret = {}
    lodash.forEach(ds, (talent_data) => {
      const id = talent_data.point_id
      const lv = talent_data.level
      let key
      if (talentId[id]) {
        let key = talentId[id]
        ret[key] = lv
      } else if (talent_data.point_type == 2) { // 1 属性加成；2 aeqtz；3 额外能力
        key = ['a', 'e', 'q', 't', 'z'][idx++]
        ret[key] = ret[key] || lv
      }
    })
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
