import Base from './Base.js'
import { Data, Format } from '#miao'
import { weaponData, weaponAbbr, weaponAlias, weaponType, weaponSet, weaponBuffs } from '../resources/meta/weapon/index.js'
import {
  weaponData as weaponDataSR,
  weaponAlias as weaponAliasSR,
  weaponBuffs as weaponBuffsSR
} from '../resources/meta-sr/weapon/index.js'

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
    if(this.isSr){
      return 5
    }
    let data = this.detail?.affixData?.datas || {}
    return (data['0'] && data['0'][4]) ? 5 : 1
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

  // 获取精炼描述
  getAffixDesc (affix = 1) {
    let skill = this.detail.skill
    let { name, desc, tables } = skill
    let reg = /\$(\d)\[(?:i|f1)\](\%?)/g
    let ret
    while ((ret = reg.exec(desc)) !== null) {
      let idx = ret[1]
      let pct = ret[2]
      let value = tables?.[idx]?.[affix - 1]
      if (pct === '%') {
        value = Format.pct(value)
      } else {
        value = Format.comma(value)
      }
      desc = desc.replaceAll(ret[0], value)
    }
    return {
      name: skill.name,
      desc
    }
  }

  getWeaponBuffs () {
    let { isSr } = this
    let wBuffs = (isSr ? weaponBuffsSR : weaponBuffs)
    let buffs = wBuffs[this.id] || wBuffs[this.name]
    if (!buffs) {
      return false
    }
    if (lodash.isPlainObject(buffs) || lodash.isFunction(buffs)) {
      buffs = [buffs]
    }
    return buffs
  }

  getWeaponAffixBuffs (affix, isStatic = true) {
    let buffs = this.getWeaponBuffs()
    let ret = []
    let self = this
    let { detail } = this

    let tables = {}
    lodash.forEach(detail?.skill?.tables || {}, (ds, idx) => {
      tables[idx] = ds[affix - 1]
    })

    lodash.forEach(buffs, (ds) => {
      if (lodash.isFunction(ds)) {
        ds = ds(tables)
      }
      if (!!ds.isStatic !== !!isStatic) {
        return true
      }

      // 静态属性
      if (ds.isStatic) {
        let tmp = {}
        // 星铁武器格式
        if (ds.idx && ds.key) {
          if (!ds.idx || !ds.key) return true
          if (!tables[ds.idx]) return true
          tmp[ds.key] = tables[ds.idx]
        }
        if (ds.refine) {
          lodash.forEach(ds.refine, (r, key) => {
            tmp[key] = r[affix - 1] * (ds.buffCount || 1)
          })
        }
        if (!lodash.isEmpty(tmp)) {
          ret.push({
            isStatic: true,
            data: tmp
          })
        }
        return true
      }

      // 自动拼接标题
      if (!/：/.test(ds.title)) {
        ds.title = `${self.name}：${ds.title}`
      }
      ds.data = ds.data || {}
      // refine
      if (ds.idx && ds.key) {
        if (!ds.idx || !ds.key) return true
        if (!tables[ds.idx]) return true
        ds.data[ds.key] = tables[ds.idx]
      } else if (ds.refine) {

        lodash.forEach(ds.refine, (r, key) => {
          ds.data[key] = ({ refine }) => r[refine] * (ds.buffCount || 1)
        })
      }

      ret.push(ds)
    })

    return ret
  }
}

export default Weapon
