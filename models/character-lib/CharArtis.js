import { usefulAttr } from '../../resources/meta/reliquaries/artis-mark.js'

const CharArtis = {
  getCharArtisCfg (char, profile, artis) {
    let { attr, weapon } = profile
    let cn = '通用'
    let check = true

    // 实验性实现，后期逐步迁移至配置文件
    switch (char.name) {
      case '芭芭拉':
        if (attr.cpct * 2 + attr.cdmg >= 180 && artis.mainAttr(4) === 'dmg') {
          cn = '暴力'
        }
        break
      case '钟离':
        for (let idx = 3; idx <= 5; idx++) {
          check = check && (artis.mainAttr(idx) === '大生命')
        }
        if (check) {
          cn = '血牛'
        }
        break
      case '雷电将军':
        if (weapon.name === '薙草之稻光' && weapon.affix >= 3) {
          cn = '高精'
        }
        break
    }

    if (cn !== '通用' && usefulAttr[`${char.name}-${cn}`]) {
      return {
        title: `${char.abbr}-${cn}`,
        attrWeight: usefulAttr[`${char.name}-${cn}`]
      }
    } else {
      let artisSet = artis.getSetData()?.sets || {}
      let weight = usefulAttr[char.name] || { atk: 75, cp: 100, cd: 100 }
      if (artisSet['绝缘之旗印'] === 4 && weight.recharge < 75) {
        weight.recharge = 75
        cn = '绝缘4'
      }
      return {
        title: `${char.abbr}-${cn}`,
        attrWeight: weight
      }
    }
  }
}
export default CharArtis
