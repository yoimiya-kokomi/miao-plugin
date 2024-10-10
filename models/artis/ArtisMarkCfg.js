import lodash from 'lodash'
import ArtisMark from './ArtisMark.js'
import { Meta } from '#miao'

const weaponCfg = {
  磐岩结绿: {
    attr: 'hp',
    abbr: '绿剑',
    max: 30,
    min: 15
  },
  猎人之径: {
    attr: 'mastery'
  },
  薙草之稻光: {
    attr: 'recharge',
    abbr: '薙刀'
  },
  护摩之杖: {
    attr: 'hp',
    abbr: '护摩',
    max: 18,
    min: 10
  }
}

const ArtisMarkCfg = {
  getCharArtisCfg (profile) {
    let { attr, weapon, elem, char, artis, game } = profile
    let { isGs } = char
    let { usefulAttr } = Meta.getMeta(game, 'arti')

    let rule = function (title, attrWeight) {
      return {
        title,
        attrWeight
      }
    }

    let def = function (attrWeight) {
      let title = []

      let weight = lodash.extend({}, attrWeight || usefulAttr[char.name] || {})
      let check = (key, max = 75, maxPlus = 75, isWeapon = true) => {
        let original = weight[key] || 0
        if (original < max) {
          let plus = isWeapon ? maxPlus * (1 + weapon.affix / 5) / 2 : maxPlus
          weight[key] = Math.min(Math.round(original + plus), max)
          return true
        }
        return false
      }

      /* maxAffix_attr 精5武器权重
      minAffix_attr 精1武器权重 */
      let weaponCheck = (key, maxAffix_attr = 20, minAffix_attr = 10, max = 100) => {
        let original = weight[key] || 0
        if (original == max) {
          return false
        } else {
          let plus = minAffix_attr + (maxAffix_attr - minAffix_attr) * (weapon.affix - 1) / 4
          weight[key] = Math.min(Math.round(original + plus), max)
          return true
        }
      }

      let wn = weapon?.name || ''

      if (isGs) {
        // 对原神一些特殊情况做适配与判定

        // 增加攻击力或直接伤害类武器判定
        if (weight.atk > 0 && weaponCfg[wn]) {
          let wCfg = weaponCfg[wn]
          if (weaponCheck(wCfg.attr, wCfg.max || 20, wCfg.min || 10)) {
            title.push(wCfg.abbr || wn)
          }
        }

        // 圣遗物判定，如果是绝缘4，将充能权重拉高至沙漏圣遗物当前最高权重齐平
        let maxWeight = Math.max(weight.atk || 0, weight.hp || 0, weight.def || 0, weight.mastery || 0)
        if (artis.is('绝缘4') && check('recharge', maxWeight, 75, false)) {
          title.push('绝缘4')
        }
      }

      title = title.length > 0 ? title.join('') : '通用'
      return {
        title: `${char.abbr}-${title}`,
        attrWeight: weight
      }
    }

    let charRule = char.getArtisCfg() || function ({ def }) {
      let defaultAttrWeight = isGs ? { atk: 75, cpct: 100, cdmg: 100, dmg: 100, phy: 100 } : { atk: 75, cpct: 100, cdmg: 100, dmg: 100, speed: 100 }
      return def(usefulAttr[char.name] || defaultAttrWeight)
    }

    if (charRule) {
      return charRule({ attr, elem, artis, rule, def, weapon, cons: profile.cons })
    }
  },

  getCfg (profile) {
    let { char } = profile
    let { game } = char
    let { attrWeight, title } = ArtisMarkCfg.getCharArtisCfg(profile)
    let attrs = {}
    let baseAttr = char.baseAttr || { hp: 14000, atk: 230, def: 700 }
    let { attrMap } = Meta.getMeta(game, 'arti')
    lodash.forEach(attrMap, (attr, key) => {
      let k = attr.base || ''
      let weight = attrWeight[k || key]
      if (!weight || weight * 1 === 0) {
        return true
      }
      let ret = {
        ...attr, weight, fixWeight: weight, mark: weight / attr.value
      }
      if (!k) {
        ret.mark = weight / attr.value
      } else {
        let plus = k === 'atk' ? 520 : 0
        ret.mark = weight / attrMap[k].value / (baseAttr[k] + plus) * 100
        ret.fixWeight = weight * attr.value / attrMap[k].value / (baseAttr[k] + plus) * 100
      }
      attrs[key] = ret
    })
    let posMaxMark = ArtisMark.getMaxMark(attrs, game)
    // 返回内容待梳理简化
    return {
      attrs,
      classTitle: title,
      posMaxMark
    }
  }
}
export default ArtisMarkCfg
