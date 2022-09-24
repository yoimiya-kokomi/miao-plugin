import Base from './Base.js'
import { Data } from '../components/index.js'

let data = {}
let abbr = {}

class Weapon extends Base {
  constructor (name) {
    super(name)
    let meta = data[name]
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
    return abbr[this.name] || this.name
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
}

Weapon.get = function (name) {
  if (data[name]) {
    return new Weapon(name)
  }
  return false
}

export default Weapon

// lazy load
setTimeout(async function init () {
  let ret = await Data.importModule('resources/meta/weapon/index.js')
  data = ret.data
  abbr = ret.abbr
})
