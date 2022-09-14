import { usefulAttr } from '../../resources/meta/reliquaries/artis-mark.js'
import { Data } from '../../components/index.js'
import fs from 'fs'

let charCfg = {}

async function init () {
  let charPath = process.cwd() + '/plugins/miao-plugin/resources/meta/character'
  let chars = fs.readdirSync(charPath)
  for (let char of chars) {
    if (fs.existsSync(`${charPath}/${char}/artis.js`)) {
      charCfg[char] = await Data.importModule(`resources/meta/character/${char}/artis.js`)
    }
    // 允许自定义配置文件，会覆盖喵喵版评分规则
    if (fs.existsSync(`${charPath}/${char}/artis_user.js`)) {
      charCfg[char] = await Data.importModule(`resources/meta/character/${char}/artis_user.js`)
    }
  }
}

await init()
const CharArtis = {
  reduceWeight (weight, key, plus, max) {
    let original = weight[key] || 0
    if (original < max) {
      weight[key] = Math.max(original + plus, max)
      return true
    }
    return false
  },
  getCharArtisCfg (char, profile, artis) {
    let { attr, weapon } = profile

    let rule = function (title, attrWeight) {
      return {
        title,
        attrWeight
      }
    }

    let def = function (attrWeight) {
      let title = []
      let weight = attrWeight || usefulAttr[char.name] || { atk: 75, cp: 100, cd: 100 }
      let check = (key, max = 75, maxPlus = 75, isWeapon = true) => {
        let original = weight[key] || 0
        if (original < max) {
          let plus = isWeapon ? maxPlus * (1 + weapon.affix / 5) / 2 : maxPlus
          weight[key] = Math.min(Math.round(original + plus), max)
          return true
        }
        return false
      }
      let wn = weapon.name

      // 增加攻击力或直接伤害类武器判定
      const weaponCfg = {
        磐岩结绿: {
          attr: 'hp',
          abbr: '绿剑'
        },
        赤角石溃杵: {
          attr: 'def',
          abbr: '赤角'
        },
        猎人之径: {
          attr: 'mastery'
        },
        薙草之稻光: {
          attr: 'recharge',
          abbr: '薙刀'
        }
      }
      if (weight.atk > 0 && weaponCfg[wn]) {
        let wCfg = weaponCfg[wn]
        if (check(wCfg.attr, wCfg.max || 75, wCfg.plus || 75)) {
          title.push(wCfg.abbr || wn)
        }
      }

      // 不与攻击力挂钩的武器判定
      if (wn === '辰砂之纺锤' && check('def')) {
        title.push('纺锤')
      }

      // 圣遗物判定
      if (artis.is('绝缘4') && check('recharge', 75, 45, false)) {
        title.push('绝缘4')
      }

      title = title.length > 0 ? title.join('') : '通用'
      return {
        title: `${char.abbr}-${title}`,
        attrWeight: weight
      }
    }

    let charRule = charCfg[char.name]?.default || function ({ def }) {
      return def(usefulAttr[char.name] || { atk: 75, cp: 100, cd: 100 })
    }

    if (charRule) {
      return charRule({ attr, artis, rule, def, weapon, cons: profile.cons })
    }
  }
}
export default CharArtis
