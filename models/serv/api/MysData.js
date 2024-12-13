import { Character, Artifact, Weapon } from '#miao.models'
import { artifactMainIdMapping, artifactAttrIdsMapping } from './MysMappings.js'
import lodash from 'lodash'

let MysData = {
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
      weapon: MysData.getWeapon(ds.weapon),
      talent: MysData.getTalent(char, ds.skills),
      artis: MysData.getArtifact(ds.relics)
    }, 'mys')
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
        level: Math.min(20, ((ds.level) || 1) - 1),
        star: ds.rarity || 5,
        mainId: MysData.getArtifactMainId(ds.rarity, ds.main_property),
        attrIds: MysData.getArtifactAttrIds(ds.rarity, ds.sub_property_list)
      }
    })
    return ret
  },

  getArtifactMainId(rarity, main_property) {
    return artifactMainIdMapping[main_property] 
  },

  getArtifactAttrIds(rarity, sub_property_list) {
    let attrIds = []
    lodash.forEach(sub_property_list, (sub_property) => {
      const { property_type, value, times} = sub_property
      const combination = artifactAttrIdsMapping[rarity][times][property_type][value]
      attrIds = [ ...attrIds, combination ]
    })
    return attrIds
  }
}
export default MysData
