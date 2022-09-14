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
  getCharArtisCfg (char, profile, artis) {
    let { attr } = profile

    let rule = function (title, attrWeight) {
      return {
        title,
        attrWeight
      }
    }

    let def = function (attrWeight) {
      let title = '通用'
      let weight = attrWeight || usefulAttr[char.name] || { atk: 75, cp: 100, cd: 100, def: 0 }
      if (profile.weapon.name==='磐岩结绿'){
        weight.hp = weight.hp + 10 + 3 * profile.weapon.affix
        title = '绿剑'
      }
      if (profile.weapon.name==='护摩之杖'){
        weight.hp = weight.hp + 10 + 3 * profile.weapon.affix
        title = '护膜'
      }
      // 判定薙刀精炼收益，需要考虑本身充能是否已经足够高收益以及是否为云堇（通过防御力收益）
      if (profile.weapon.name==='薙草之稻光' && weight.recharge < 65){
        weight.recharge = weight.recharge + 10 + 3 * profile.weapon.affix
        title = '薙刀'
      }
      if (artis.is('绝缘4') && weight.recharge < 75) {
        weight.recharge = 75
        title = '绝缘4'
      }
      return {
        title: `${char.abbr}-${title}`,
        attrWeight: weight
      }
    }

    let charRule = charCfg[char.name]?.default || function ({ def }) {
      return def(usefulAttr[char.name] || { atk: 75, cp: 100, cd: 100 })
    }

    if (charRule) {
      return charRule({ attr, artis, rule, def, weapon: profile.weapon, cons: profile.cons })
    }
  }
}
export default CharArtis
