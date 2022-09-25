/*
* 角色培养及天赋材料
* */
import lodash from 'lodash'
import Base from './Base.js'
import { Data } from '../components/index.js'
import MaterialMeta from './material-lib/MaterialMeta.js'

let data = Data.readJSON('resources/meta/material/data.json')
let abbr = await Data.importDefault('resources/meta/material/abbr.js')
let mMap = {}
let getItem = (ds) => {
  mMap[ds.name] = {
    type: ds.type,
    name: ds.name,
    star: ds.star
  }
  return mMap[ds.name]
}
lodash.forEach(data, (ds) => {
  let ret = getItem(ds)
  if (ds.items) {
    let items = {}
    lodash.forEach(ds.items, (item) => {
      getItem(item)
      items[item.star] = item.title
    })
    ret.items = items
  }
})

class Material extends Base {
  constructor (name) {
    super(name)
    let meta = mMap[name]
    if (!meta) {
      return false
    }
    let cache = this._getCache(`material:${name}`)
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
    let name = this.name
    if (this.type === 'talent') {
      return Data.regRet(/「(.+)」/, name, 1) || name
    }
    return abbr[name] || name
  }

  get title () {
    return this.name
  }

  get label () {
    let abbr = this.abbr
    if (this.type === 'talent') {
      return MaterialMeta.getTalentLabel(abbr)
    }
    return abbr
  }

  get img () {
    return `meta/material/${this.type}/${this.name}.webp`
  }

  get icon () {
    return this.img
  }

  getSource () {
    if (this.type === 'talent') {
      return MaterialMeta.getTalentWeek(this.name)
    }
    return ''
  }
}

Material.get = function (name) {
  if (mMap[name]) {
    return new Material(name)
  }
  return false
}

export default Material
