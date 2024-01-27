/*
* 角色培养及天赋材料
* */
import lodash from 'lodash'
import Base from './Base.js'
import { Data, Meta } from '#miao'

let data = Data.readJSON('resources/meta-gs/material/data.json', 'miao')
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
  constructor (data) {
    super()
    let cache = this._getCache(`material:${data.name}`)
    if (cache) {
      return cache
    }
    this.name = data.name
    this.meta = data
    this.type = data.type
    this.star = data.star
    return this._cache()
  }

  static get (name, game = 'gs') {
    let data = Meta.getData(game, 'material', name)
    if (data) {
      return new Material(data)
    }
    return false
  }

  static forEach (type = 'all', fn, filter = false, game = 'gs') {
    if (!lodash.isFunction(filter)) {
      filter = () => true
    }
    lodash.forEach(mMap, (ds, name) => {
      if (type !== 'all' && type !== ds.type) {
        return true
      }
      let obj = Material.get(name, game)
      if (filter(obj)) {
        return fn(obj) !== false
      }
    })
  }

  static forEachDaily (type = 'talent', fn) {
    const dailyData = Meta.getMeta('gs', 'material')
    lodash.forEach(dailyData[type] || {}, (name, city) => {

    })
  }

  get abbr () {
    let name = this.name
    if (this.type === 'talent') {
      return Data.regRet(/「(.+)」/, name, 1) || name
    }
    if (this.type === 'weapon') {
      return name.slice(0, 4)
    }
    return abbr[name] || name
  }

  get title () {
    return this.name
  }

  get label () {
    let abbr = this.abbr
    if (this.city) {
      return `${this.city}·${this.abbr}`
    }
    return abbr
  }

  get img () {
    return `meta-gs/material/${this.type}/${this.name}.webp`
  }

  get icon () {
    return this.img
  }

  get source () {
    return this.week ? ['周一/周四', '周二/周五', '周三/周六'][this.week - 1] : ''
  }
}

export default Material
