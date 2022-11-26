import Base from './Base.js'
import { Data } from '../components/index.js'
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

  get icon () {
    return this.img
  }

  get detail () {
    return this.getDetail()
  }

  getDetail () {
    if (this._detail) {
      return this._detail
    }
    const path = 'resources/meta/weapon'
    try {
      this._detail = Data.readJSON(`${path}/${this.type}/${this.name}/data.json`)
    } catch (e) {
      console.log(e)
    }
    return this._detail
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
}

export default Weapon
