import { Data } from '#miao'
import lodash from 'lodash'

const MetaStore = {}

class MetaData {
  constructor (game = 'gs', type = '') {
    this.game = game
    this.type = type
    this.data = {}
    this.alias = {}
    this.abbr = {}
    this.cfg = {}
  }

  // 添加数据
  addData (datas, pk = 'id') {
    let { data, alias } = this
    lodash.forEach(datas, (ds, id) => {
      id = ds[pk] || id
      data[id] = ds
      if (ds.name && ds.name !== id) {
        alias[ds.name] = id
      }
    })
  }

  addDataItem (id, ds) {
    let { data, alias } = this
    data[id] = ds
    alias[id] = id
    if (ds.name) {
      alias[ds.name] = id
    }
  }

  // 添加简写
  addAbbr (ds) {
    let { abbr, alias } = this
    lodash.forEach(ds, (txt, id) => {
      abbr[id] = lodash.trim(txt + '')
      alias[abbr] = alias[id] || id
    })
  }

  // 添加别名
  addAlias (ds) {
    let { alias } = this
    lodash.forEach(ds, (txt, id) => {
      lodash.forEach(txt.split(','), (t) => {
        alias[lodash.trim(t + '').toLowerCase()] = alias[id] || id
      })
    })
  }

  // 注册别名Fn
  addAliasFn (fn) {
    if (fn) {
      this.aliasFn = fn
    }
  }

  addCfg (cfgMap) {
    let { cfg } = this
    lodash.forEach(cfgMap, (v, k) => {
      cfg[k] = v
    })
  }

  getId (txt) {
    txt = lodash.trim(txt + '').toLowerCase()
    let { data, alias, aliasFn } = this
    if (data[txt]) {
      return txt
    }
    if (alias[txt]) {
      return alias[txt]
    }
    if (aliasFn) {
      let id = aliasFn(txt)
      if (alias[id]) {
        return alias
      }
    }
    return false
  }

  getData (txt) {
    let id = this.getId(txt)
    let { data } = this
    return data[id] || null
  }

  getCfg (key = '') {
    if (!key) {
      return this.cfg
    }
    return this.cfg[key]
  }

  getIds () {
    return lodash.keys(this.data)
  }
}

const MetaFn = (fnKey) => {
  return (game, type, args = '') => {
    let meta = Meta.getMeta(game, type)
    return meta[fnKey](args)
  }
}

const Meta = {
  addAliasFn (game, type, fn) {
    let meta = Meta.getMeta(game, type)
    meta.addAliasFn(fn)
  },

  // 获取存储
  getMeta (game, type) {
    let key = `${game}.${type}`
    if (!MetaStore[key]) {
      MetaStore[key] = new MetaData(game, type)
    }
    return MetaStore[key]
  },
  getId: MetaFn('getId'),
  getIds: MetaFn('getIds'),
  getData: MetaFn('getData'),
  getCfg: MetaFn('getCfg'),
  // 在各个游戏内匹配，以传入的game优先
  matchGame (game = 'gs', type, txt) {
    txt = lodash.trim(txt + '').toLowerCase()
    let games = game === 'gs' ? ['gs', 'sr'] : ['sr', 'gs']
    for (let currGame of games) {
      let id = Meta.getId(currGame, type, txt)
      if (id) {
        let data = Meta.getData(currGame, type, id)
        return { game, id, data }
      }
    }
    return false
  }
}
export default Meta
