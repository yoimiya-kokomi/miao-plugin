import { Format, Meta } from '#miao'
import { Character, Artifact, Weapon } from '#miao.models'
import { artifactMainIdMapping, propertyType2attrName, fixedAttrNames } from './MysPanelMappings.js'
import lodash from 'lodash'

let MysPanelData = {
  setAvatar (player, ds) {
    let { id, element, level, fetter, actived_constellation_num } = ds.base
    let elem = Format.elem(element)
    let char = Character.get({ id, elem })
    let avatar = player.getAvatar(id, true)
    if (!char) {
      return false
    }

    avatar.setAvatar({
      level,
      elem,
      fetter,
      cons: actived_constellation_num,
      costume: ds.costumes?.[0]?.id || 0,
      weapon: MysPanelData.getWeapon(ds.weapon),
      talent: MysPanelData.getTalent(char, actived_constellation_num, ds.skills),
      artis: MysPanelData.getArtifact(ds.relics)
    }, 'mysPanel')
    return avatar
  },

  getWeapon (data) {
    let w = Weapon.get(data.id)
    return {
      name: w ? w.name : data.name,
      level: data.level, // 等级
      promote: data.promote_level, // 突破
      affix: data.affix_level // 精炼
    }
  },

  getTalent(char, cons, ds = []) {
    let { talentId = {}, talentCons = {} } = char.meta
    let idx = 0
    let ret = {}
    lodash.forEach(ds, (talent_data) => {
      let key
      if (talentId[talent_data.skill_id]) {
        let key = talentId[talent_data.skill_id]
        ret[key] = talent_data.level
      } else if (talent_data.skill_type == 1) { // 1 主动技能；2 被动技能
        key = ['a', 'e', 'q'][idx++]
        ret[key] = ret[key] || talent_data.level
      }
    })
    // 减去命座加成
    if (cons >= 3) {
      lodash.forEach(talentCons, (lv, key) => {
        if (lv != 0 && ret[key] && cons >= lv) {
          ret[key] = Math.max(1, ret[key] - 3)
        }
      })
    }
    return ret
  },

  getArtifact (data) {
    let ret = {}
    lodash.forEach(data, (ds) => {
      let idx = ds.pos
      if (!idx) {
        return
      }
      let arti = Artifact.get(ds.id)
      if (!arti) {
        return true
      }
      // 难点：mainId 和 attrIds 的获取
      // 由于 mys 只有属性、强化次数和最终值这三项，没有
      // 因此只能后期“拼凑”出一个大概的强化过程
      ret[idx] = {
        name: arti.name,
        level: Math.min(20, (ds.level) || 0),
        star: ds.rarity || 5,
        mainId: MysPanelData.getArtifactMainId(ds.rarity, ds.main_property),
        attrIds: MysPanelData.getArtifactAttrIds(ds.rarity, ds.sub_property_list)
      }
    })
    return ret
  },

  getArtifactMainId(rarity, main_property) {
    return artifactMainIdMapping[main_property.property_type]
  },

  getArtifactAttrIdCombination(rarity, curTime, propertyType, valueStr) {
    const attrName = propertyType2attrName[propertyType];
    let destValueSum;

    if (fixedAttrNames.includes(attrName)) {
      destValueSum = parseFloat(valueStr);
    } else {
      destValueSum = parseFloat(valueStr.slice(0, -1)) * 0.01;
    }

    const { attrIdMap, attrMap } = Meta.getMeta('gs', 'arti')
    const curValues = Object.entries(attrIdMap)
        .filter(([k, v]) => k.startsWith(rarity) && v.key === attrName)
        .map(([k, v]) => [v.value, k]);

    let bestErr = 1e6;
    let bestArr = [];

    // 使用递归实现 itertools.product
    function product(arrays, repeat) {
      if (repeat === 0) return [[]];
      const result = [];
      const subProduct = product(arrays, repeat - 1);
      for (const array of arrays) {
        for (const sub of subProduct) {
          result.push([array, ...sub]);
        }
      }
      return result;
    }

    const combinations = product(curValues, curTime + 1);

    for (const curValuesCombination of combinations) {
      const curValueSum = curValuesCombination.reduce((sum, [v]) => sum + v, 0);
      const curArr = curValuesCombination.map(([, attrId]) => attrId);

      const err = Math.abs(destValueSum - curValueSum);
      if (err < bestErr) {
        bestErr = err;
        bestArr = curArr;
      }
    }

    return bestArr;
  },

  getArtifactAttrIds(rarity, sub_property_list) {
    let attrIds = []
    lodash.forEach(sub_property_list, (sub_property) => {
      const { property_type, value, times} = sub_property
      const combination = MysPanelData.getArtifactAttrIdCombination(rarity, times, property_type, value)
      attrIds = [ ...attrIds, ...combination ]
    })
    return attrIds
  }
}
export default MysPanelData
