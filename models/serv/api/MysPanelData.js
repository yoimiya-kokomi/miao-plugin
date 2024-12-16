import { Character, Artifact, Weapon } from '#miao.models'
import { artifactMainIdMapping, artifactAttrIdsMapping } from './MysPanelMappings.js'
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


    let wtf = {
      level: ds.base.level,
      cons: ds.base.actived_constellation_num,
      fetter: ds.base.fetter,
      // ds.costumes 是个数组，暂时不知道怎么用
      elem: ds.base.elem,
      weapon: MysPanelData.getWeapon(ds.weapon),
      talent: MysPanelData.getTalent(char, ds.skills),
      artis: MysPanelData.getArtifact(ds.relics)
    }
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

  getArtifactAttrIds(rarity, sub_property_list) {
    let attrIds = []
    lodash.forEach(sub_property_list, (sub_property) => {
      const { property_type, value, times} = sub_property
      const combination = artifactAttrIdsMapping[rarity][times][property_type][value]
      if (combination === undefined) {
        logger.error(`[米游社更新面板] 圣遗物强化原始数据转换发生错误`)
        logger.error(`[米游社更新面板] 请复制以下数据汇报至 github miao-plugin 仓库的 issue 处，感谢您的合作`)
        logger.error(`[米游社更新面板] [rarity = ${rarity}]`)
        logger.error(`[米游社更新面板] [times = ${times}]`)
        logger.error(`[米游社更新面板] [property_type = ${property_type}]`)
        logger.error(`[米游社更新面板] [value = ${value}]`)
        throw new Error('Invalid combination')
      }
      attrIds = [ ...attrIds, ...combination ]
    })
    return attrIds
  }
}
export default MysPanelData
