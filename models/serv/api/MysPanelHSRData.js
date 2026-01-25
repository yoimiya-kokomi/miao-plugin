import { Meta } from "#miao"
import { Character, Artifact, Weapon } from "#miao.models"
import { propertyType2attrName } from "./MysPanelHSRMappings.js"
import lodash from "lodash"
import Attr from "../../attr/Attr.js"

let MysPanelHSRData = {
  setAvatar(player, ds) {
    let char = Character.get(ds.id)
    let avatar = player.getAvatar(ds.id, true)
    if (!char) {
      return false
    }

    if (String(ds.id).startsWith("2")) {
      ds.name = char.name
    }

    let level = ds.level
    let promote = Attr.calcPromote(level, "sr")
    let weaponPromote = ds.equip ? Attr.calcPromote(ds.equip.level, "sr") : null

    if ([20, 30, 40, 50, 60, 70].includes(level) || (ds.equip && [20, 30, 40, 50, 60, 70].includes(ds.equip.level))) {
      let baseHp = 0
      lodash.forEach(ds.properties, (p) => {
        if (p.property_type === 1) baseHp = p.base * 1
      })

      if (baseHp > 0) {
        let w = null
        let check = true
        if (ds.equip) {
          w = Weapon.get(ds.equip.id, "sr")
          if (!w) check = false
        }

        if (check) {
          let charPromotes = [promote]
          if ([20, 30, 40, 50, 60, 70].includes(level)) charPromotes.push(promote + 1)

          let weaponPromotes = []
          if (w) {
            let wLv = ds.equip.level
            let wPromote = weaponPromote
            weaponPromotes = [wPromote]
            if ([20, 30, 40, 50, 60, 70].includes(wLv)) weaponPromotes.push(wPromote + 1)
          } else {
            weaponPromotes = [null]
          }

          let minDiff = Infinity
          let bestCP = promote
          let bestWP = weaponPromote

          for (let cp of charPromotes) {
            for (let wp of weaponPromotes) {
              let charAttr = char.getLvAttr(level, cp)
              let wAttr = w ? w.calcAttr(ds.equip.level, wp) : { hp: 0 }
              if (charAttr && wAttr) {
                let diff = Math.abs(baseHp - (charAttr.hp + wAttr.hp))
                if (diff < minDiff) {
                  minDiff = diff
                  bestCP = cp
                  if (w) bestWP = wp
                }
              }
            }
          }
          promote = bestCP
          if (w) weaponPromote = bestWP
        }
      }
    }
    promote = Math.min(promote, 6)

    const setData = {
      level,
      promote,
      cons: ds.rank,
      weapon: ds.equip ? MysPanelHSRData.getWeapon(ds.equip, weaponPromote) : null,
      talent: MysPanelHSRData.getTalent(
        char,
        ds.rank,
        ds.skills,
        ds.servant_detail?.servant_skills || []
      ),
      trees: MysPanelHSRData.getTrees(ds.skills),
      artis: MysPanelHSRData.getArtifact([...ds.relics, ...ds.ornaments])
    }
    avatar.setAvatar(setData, "mysPanelHSR")

    // 速度修正，整数对齐
    const speedProp = lodash.find(ds.properties, p => [4].includes(p.property_type))
    if (speedProp && avatar.attr?.speed) {
      const targetSpeed = parseFloat(speedProp.final)
      const currentSpeed = avatar.attr.speed
      let speedDiff = targetSpeed - currentSpeed
      if (speedDiff > 0.2) {
        let fixed = false
        // 尝试分散修正，遍历所有圣遗物，每个速度词条加1步，直到补足差额
        let loopCount = 0
        while (speedDiff > 0.05 && loopCount < 20) {
          let hasSpeed = false
          lodash.forEach(setData.artis, (arti) => {
            if (speedDiff <= 0.05) return false
            lodash.forEach(arti.attrIds, (attr, idx) => {
              if (speedDiff <= 0.05) return false
              if (attr.startsWith("7,")) {
                let [id, count, step] = attr.split(",")
                step = parseInt(step) + 1
                arti.attrIds[idx] = `${id},${count},${step}`
                speedDiff -= (arti.star || 5) >= 5 ? 0.3 : 0.2
                fixed = true
                hasSpeed = true
              }
            })
          })
          if (!hasSpeed) break
          loopCount++
        }

        if (fixed) {
          avatar.setAvatar(setData, "mysPanelHSR")
        }
      }
    }

    return avatar
  },

  getWeapon(data, promote) {
    return {
      id: data.id,
      promote: Math.min(promote || 0, 6), // 突破
      level: data.level, // 等级
      affix: data.rank // 叠影
    }
  },

  getTalent(char, cons, ds = {}, servant_skills = []) {
    let { talentId = {}, talentCons = {} } = char.meta
    let idx = 0
    let ret = {}
    const skillKeys = ["a", "e", "q", "t", "z", "me", "mt"]
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
      ret["me"] = me
      ret["mt"] = mt
    }
    if (cons >= 3) {
      lodash.forEach(talentCons, (lv, key) => {
        let addTalent = { a: 1, e: 2, q: 2, t: 2, me: 1, mt: 1 }
        if (lv != 0 && ret[key] && cons >= lv) ret[key] = Math.max(1, ret[key] - addTalent[key])
      })
    }
    return ret
  },

  getTrees(data) {
    return lodash.map(lodash.filter(data,
      skill => skill.point_type !== 2 && skill.is_activated
    ), "point_id")
  },

  getArtifact(data) {
    let ret = {}
    lodash.forEach(data, (ds) => {
      let idx = ds.pos
      if (!idx) {
        return
      }
      let arti = Artifact.get(ds.id, "sr")
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
    const { metaData } = Meta.getMeta("sr", "arti")
    const propertyName = propertyType2attrName[main_property.property_type]
    const propertyName2Id = lodash.invert(metaData["mainIdx"][pos])
    const ret = +propertyName2Id[propertyName]
    return ret
  },

  getArtifactAttrId(rarity, curTime, propertyType, valueStr) {
    const { metaData } = Meta.getMeta("sr", "arti")
    const propertyName = propertyType2attrName[propertyType]
    const subAttrInfo = metaData["starData"][rarity]["sub"]
    const propertyId = lodash.findKey(subAttrInfo, obj => obj.key === propertyName);
    // base: 最大取值
    // step: 减去的多少
    const { base, step } = subAttrInfo[propertyId]
    // Is valueStr a fixed value or a percentage?
    let destValueSum
    if (valueStr.substring(-1) == "%") {
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
      const { property_type, value, times } = sub_property
      const combination = MysPanelHSRData.getArtifactAttrId(rarity, times, property_type, value)
      attrIds = [...attrIds, combination]
    })
    return attrIds
  }
}
export default MysPanelHSRData
