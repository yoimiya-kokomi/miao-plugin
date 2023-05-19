import Base from './Base.js'
import { Data, Format } from '#miao'
import { weaponData, weaponAbbr, weaponAlias, weaponType, weaponSet } from '../resources/meta/weapon/index.js'
import { weaponData as weaponDataSR, weaponAlias as weaponAliasSR } from '../resources/meta-sr/weapon/index.js'

import lodash from 'lodash'

class Weapon extends Base {
  constructor (name, game = 'gs') {
    super(name)
    let meta = game === 'gs' ? weaponData[name] : weaponDataSR[name]
    if (!meta) {
      return false
    }
    let cache = this._getCache(`weapon:${game}:${name}`)
    if (cache) {
      return cache
    }
    this.id = meta.id
    this.name = meta.name
    this.meta = meta
    this.type = meta.type
    this.star = meta.star
    this.game = game
    return this._cache()
  }

  get abbr () {
    return weaponAbbr[this.name] || this.name
  }

  get title () {
    return this.name
  }

  get img () {
    return `${this.isGs ? 'meta' : 'meta-sr'}/weapon/${this.type}/${this.name}/icon.webp`
  }

  get imgs () {
    if (this.isGs) {
      return {
        icon: `meta/weapon/${this.type}/${this.name}/icon.webp`,
        icon2: `meta/weapon/${this.type}/${this.name}/awaken.webp`,
        gacha: `meta/weapon/${this.type}/${this.name}/gacha.webp`
      }
    } else {
      return {
        icon: `meta-sr/weapon/${this.type}/${this.name}/icon.webp`,
        icon2: `meta-sr/weapon/${this.type}/${this.name}/icon-s.webp`,
        gacha: `meta-sr/weapon/${this.type}/${this.name}/splash.webp`
      }
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

  get maxPromote () {
    return this.star <= 2 ? 4 : 6
  }

  get maxAffix () {
    let datas = this.detail?.affixData?.datas || {}
    return (datas['0'] && datas['0'][4]) ? 5 : 1
  }

  static isWeaponSet (name) {
    return weaponSet.includes(name)
  }

  static get (name, game = 'gs', type = '') {
    name = lodash.trim(name)
    let alias = game === 'gs' ? weaponAlias : weaponAliasSR
    if (alias[name]) {
      return new Weapon(alias[name], game)
    }
    if (type && game === 'gs') {
      let name2 = name + (weaponType[type] || type)
      if (weaponAlias[name2]) {
        return new Weapon(weaponAlias[name2])
      }
    }
    return false
  }

  static async forEach (fn, type = '') {
    for (let name in weaponData) {
      let ds = weaponData[name]
      let w = Weapon.get(ds.name)
      if (!w || (type && type !== w.type)) {
        continue
      }
      await fn(w)
    }
  }

  getDetail () {
    if (this._detail) {
      return this._detail
    }
    const path = this.isGs ? 'resources/meta/weapon' : 'resources/meta-sr/weapon'
    try {
      this._detail = Data.readJSON(`${path}/${this.type}/${this.name}/data.json`, 'miao')
    } catch (e) {
      console.log(e)
    }
    return this._detail
  }

  calcAttr (level, promote = -1) {
    let metaAttr = this.detail?.attr
    if (!metaAttr) {
      return false
    }
    if (this.isSr) {
      let lvAttr = metaAttr[promote]
      let ret = {}
      lodash.forEach(lvAttr.attrs, (v, k) => {
        ret[k] = v * 1
      })
      lodash.forEach(this.detail?.growAttr, (v, k) => {
        ret[k] = ret[k] * 1 + v * (level - 1)
      })
      return ret
    }

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

  getAffixDesc (affix = 1) {
    let skill = this.detail.skill
    let { name, desc, tables } = skill
    let reg = /\$(\d)\[[i|f1]\](\%?)/g
    let ret
    while ((ret = reg.exec(desc)) !== null) {
      let idx = ret[1]
      let pct = ret[2]
      let value = tables[idx - 1][affix - 1]
      if (pct === '%') {
        value = Format.percent(value)
      }
      desc = desc.replaceAll(ret[0], value)
    }
    return {
      name: skill.name,
      desc
    }
  }
}

export default Weapon
