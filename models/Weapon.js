import Base from './Base.js'
import { Data } from '#miao'
import { weaponData, weaponAbbr, weaponAlias, weaponType, weaponSet } from '../resources/meta/weapon/index.js'
import lodash from 'lodash'

class Weapon extends Base {
  constructor (name) {
    super(name)
    let meta = weaponData[name]
    if (!meta) {
      return false
    }
    let cache = this._getCache(`weapon:${name}`)
    if (cache) {
      return cache
    }
    this.id = meta.id
    this.name = meta.name
    this.meta = meta
    this.type = meta.type
    this.star = meta.star
    return this._cache()
  }

  get abbr () {
    return weaponAbbr[this.name] || this.name
  }

  get title () {
    return this.name
  }

  get img () {
    return `meta/weapon/${this.type}/${this.name}/icon.webp`
  }

  get imgs () {
    return {
      icon: `meta/weapon/${this.type}/${this.name}/icon.webp`,
      icon2: `meta/weapon/${this.type}/${this.name}/awaken.webp`,
      gacha: `meta/weapon/${this.type}/${this.name}/gacha.webp`
    }
  }

  get icon () {
    return this.img
  }

  get detail () {
    return this.getDetail()
  }

  get maxLv () {
    return this.star <= 2 ? 70 : 90
  }

  get maxAffix () {
    let datas = this.detail?.affixData?.datas || {}
    return (datas['0'] && datas['0'][4]) ? 5 : 1
  }

  static isWeaponSet (name) {
    return weaponSet.includes(name)
  }

  static get (name, type = '') {
    name = lodash.trim(name)
    if (weaponAlias[name]) {
      return new Weapon(weaponAlias[name])
    }
    if (type) {
      let name2 = name + (weaponType[type] || type)
      if (weaponAlias[name2]) {
        return new Weapon(weaponAlias[name2])
      }
    }
    return false
  }

  getDetail () {
    if (this._detail) {
      return this._detail
    }
    const path = 'resources/meta/weapon'
    try {
      this._detail = Data.readJSON(`${path}/${this.type}/${this.name}/data.json`,'miao')
    } catch (e) {
      console.log(e)
    }
    return this._detail
  }

  calcAttr (level, promote = -1) {
    let lvLeft = 1
    let lvRight = 20
    let lvStep = [1, 20, 40, 50, 60, 70, 80, 90]
    let currPromote = 0
    for (let idx = 0; idx < lvStep.length - 1; idx++) {
      if (promote === -1 || (currPromote === promote)) {
        if (level >= lvStep[idx] && level <= lvStep[idx + 1]) {
          lvLeft = lvStep[idx]
          lvRight = lvStep[idx + 1]
          break
        }
      }
      currPromote++
    }
    let wAttr = this?.detail?.attr || {}
    let wAtk = wAttr.atk || {}
    let valueLeft = wAtk[lvLeft + '+'] || wAtk[lvLeft] || {}
    let valueRight = wAtk[lvRight] || {}
    let atkBase = valueLeft * 1 + ((valueRight - valueLeft) * (level - lvLeft) / (lvRight - lvLeft))
    let wBonus = wAttr.bonusData || {}
    valueLeft = wBonus[lvLeft + '+'] || wBonus[lvLeft]
    valueRight = wBonus[lvRight]
    let stepCount = Math.ceil((lvRight - lvLeft) / 5)
    let valueStep = (valueRight - valueLeft) / stepCount
    let value = valueLeft + (stepCount - Math.ceil((lvRight - level) / 5)) * valueStep
    return {
      atkBase,
      attr: {
        key: wAttr.bonusKey,
        value
      }
    }
  }

  getAffixInfo (affix) {
    let d = this.getDetail()
    let ad = this.detail.affixData
    let txt = ad.text
    lodash.forEach(ad.datas, (ds, idx) => {
      txt = txt.replace(`$[${idx}]`, ds[affix - 1])
    })
    return {
      name: d.name,
      star: d.star,
      desc: d.desc,
      imgs: this.imgs,
      affix,
      affixTitle: d.affixTitle,
      affixDetail: txt
    }
  }
}

export default Weapon
