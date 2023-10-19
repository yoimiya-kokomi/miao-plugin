import lodash from 'lodash'

const Store = {}

const Meta = {

  // 获取存储
  getStore (game, dataType) {
    Store[game] = Store[game] || {}
    Store[game][dataType] = Store[game][dataType] || {
      meta: {},
      alias: {},
      abbr: {}
    }
    return Store[game][dataType]
  },

  // 添加数据
  addMeta (game, dataType, data, pk = 'id') {
    let { meta, alias } = Meta.getStore(game, dataType)

    lodash.forEach(data, (ds, id) => {
      id = ds[pk] || id
      meta[id] = ds
      alias[id] = id
      if (ds.name) {
        alias[ds.name] = id
      }
    })
  },

  // 添加简写
  addAbbr (game, dataType, data) {
    let { abbr, alias } = Meta.getStore(game, dataType)
    lodash.forEach(data, (abbr, id) => {
      abbr[id] = abbr
      alias[abbr] = alias[id] || id
    })
  },

  // 添加别名
  addAlias (game, dataType, data) {
    let { alias } = Meta.getStore(game, dataType)
    lodash.forEach(data, (txt, id) => {
      lodash.forEach(txt.split(','), (t) => {
        alias[lodash.trim(t.toLowerCase())] = alias[id] || id
      })
    })
  },

  // 注册别名Fn
  addAliasFn (game, dataType, fn) {
    let store = Meta.getStore(game, dataType)
    if (fn) {
      store.aliasFn = fn
    }
  },

  // 根据别名获取数据ID
  getId (game, dataType, txt) {
    txt = lodash.trim(txt.toLowerCase())
    let { alias, aliasFn } = Meta.getStore(game, dataType)
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
  },

  // 在各个游戏内匹配，以传入的game优先
  matchGame (game = 'gs', dataType, txt) {
    txt = lodash.trim(txt.toLowerCase())
    let games = game === 'gs' ? ['gs', 'sr'] : ['sr', 'gs']
    for (let currGame of games) {
      let id = Meta.getId(currGame, dataType, txt)
      if (id) {
        let meta = Meta.getMeta(currGame, dataType, id)
        return { game, id, meta }
      }
    }
    return false
  },

  // 根据别名获取数据
  getMeta (game, dataType, txt) {
    txt = lodash.trim(txt.toLowerCase())
    let id = Meta.getId(game, dataType, txt)
    let { meta } = Meta.getStore(game, dataType)
    return meta[id]
  }

}
export default Meta
