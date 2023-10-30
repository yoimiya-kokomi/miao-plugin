/*
* 角色培养及天赋材料
* */
import lodash from 'lodash'
import Base from './Base.js'
import { Data } from '#miao'
import MaterialMeta from './material/MaterialMeta.js'

let data = Data.readJSON('resources/meta-gs/material/data.json','miao')
let abbr = await Data.importDefault('resources/meta-gs/material/abbr.js', 'miao')
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
    if (this.type === 'talent') {
      let talentData = MaterialMeta.getTalentData(this.name)
      lodash.extend(this, talentData)
    }
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
    return `meta-gs/material/${this.type}/${this.name}.webp`
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

  static get (name) {
    if (mMap[name]) {
      return new Material(name)
    }
    return false
  }

  static forEach (type = 'all', fn, filter = false) {
    if (!lodash.isFunction(filter)) {
      filter = () => true
    }
    lodash.forEach(mMap, (ds, name) => {
      if (type !== 'all' && type !== ds.type) {
        return true
      }
      let obj = new Material(name)
      if (filter(obj)) {
        return fn(obj) !== false
      }
    })
  }
}

export default Material
