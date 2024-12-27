import { Meta } from '#miao'
import { Character, Artifact, Weapon } from '#miao.models'
import { artifactMainIdMapping, propertyType2attrName, fixedAttrNames } from './MysPanelMappings.js'
import lodash from 'lodash'

let MysPanelData = {
  setAvatar (player, ds) {
    let char = Character.get(ds.base.id)
    let avatar = player.getAvatar(ds.base.id, true)
    if (!char) {
      return false
    }

    avatar.setAvatar({
      level: ds.base.level,
      cons: ds.base.actived_constellation_num,
      fetter: ds.base.fetter,
      // ds.costumes 是个数组，暂时不知道怎么用
      elem: ds.base.elem,
      weapon: MysPanelData.getWeapon(ds.weapon),
      talent: MysPanelData.getTalent(char, ds.skills),
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

  getTalent (char, ds = {}) {
    // 照抄 EnkaData 实现
    let { talentId = {}, talentElem = {} } = char.meta
    let elem = ''
    let idx = 0
    let ret = {}
    lodash.forEach(ds, (talent_data) => {
      const id = talent_data.skill_id
      const lv = talent_data.level
      let key
      if (talentId[id]) {
        let key = talentId[id]
        elem = elem || talentElem[id]
        ret[key] = lv
      } else if (talent_data.skill_type == 1) { // 1 主动技能；2 被动技能
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
