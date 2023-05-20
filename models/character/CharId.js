/**
 * 角色别名及角色ID相关
 * */
import lodash from 'lodash'
import { Data, Format } from '#miao'
import { charPosIdx } from './CharMeta.js'
import { aliasMap as aliasMapSR } from '../../resources/meta-sr/character/meta.js'


// 别名表
let aliasMap = {}
// ID表
let idMap = {}
// 简写表
let abbrMap = {}
// wife
let wifeMap = {}
// id排序
let idSort = {}

let gameMap = {}

let srData = Data.readJSON('/resources/meta-sr/character/data.json', 'miao')

async function init () {
  let { sysCfg, diyCfg } = await Data.importCfg('character')


  lodash.forEach(srData, (ds) => {
    let { id, name } = ds
    aliasMap[id] = id
    aliasMap[name] = id
    idMap[id] = name
    gameMap[id] = 'sr'
  })

  // 添加别名
  lodash.forEach(aliasMapSR, (v, k) => {
    aliasMap[v] = aliasMap[k]
  })

  lodash.forEach([diyCfg.customCharacters, sysCfg.characters], (roleIds) => {
    lodash.forEach(roleIds || {}, (aliases, id) => {
      aliases = aliases || []
      if (aliases.length === 0) {
        return
      }
      // 建立别名映射
      lodash.forEach(aliases || [], (alias) => {
        alias = alias.toLowerCase()
        aliasMap[alias] = id
      })
      aliasMap[id] = id
      idMap[id] = aliases[0]
      gameMap[id] = 'gs'
    })
  })

  lodash.forEach([sysCfg.wifeData, diyCfg.wifeData], (wifeData) => {
    lodash.forEach(wifeData || {}, (ids, type) => {
      type = Data.def({ girlfriend: 0, boyfriend: 1, daughter: 2, son: 3 }[type], type)
      if (!wifeMap[type]) {
        wifeMap[type] = {}
      }
      Data.eachStr(ids, (id) => {
        id = aliasMap[id]
        if (id) {
          wifeMap[type][id] = true
        }
      })
    })
  })
  abbrMap = sysCfg.abbr
}

await init()

lodash.forEach(charPosIdx, (chars, pos) => {
  chars = chars.split(',')
  lodash.forEach(chars, (name, idx) => {
    let id = aliasMap[name]
    if (id) {
      idSort[id] = pos * 100 + idx
    }
  })
})

const CharId = {
  aliasMap,
  idMap,
  gameMap,
  abbrMap,
  wifeMap,
  idSort,
  isGs (id) {
    return gameMap[id] === 'gs'
  },
  isSr (id) {
    return gameMap[id] === 'sr'
  },
  getId (ds = '', gsCfg = null, game = 'gs') {
    if (!ds) {
      return false
    }
    const ret = (id, elem = '') => {
      if (CharId.isSr(id)) {
        return { id, name: idMap[id], game: 'sr' }
      } else {
        return { id, elem, name: idMap[id], game: 'gs' }
      }
    }
    if (!lodash.isObject(ds)) {
      let original = lodash.trim(ds || '')
      ds = original.toLowerCase()
      // 尝试使用元素起始匹配
      let em = Format.matchElem(ds, '', true)
      if (em && aliasMap[em.name] && CharId.isTraveler(aliasMap[em.name])) {
        return ret(aliasMap[em.name], em.elem)
      }
      // 直接匹配
      if (aliasMap[ds]) {
        return ret(aliasMap[ds])
      }
      // 调用V3方法匹配
      if (gsCfg && gsCfg.getRole) {
        let roleRet = gsCfg.getRole(original)
        if (roleRet.name && aliasMap[roleRet.name]) {
          return ret(aliasMap[roleRet.name])
        }
      }
      // 无匹配结果
      return false
    }
    // 获取字段进行匹配
    let { id = '', name = '' } = ds
    let elem = Format.elem(ds.elem || ds.element)
    // 直接匹配
    if (aliasMap[id || name]) {
      return ret(aliasMap[id || name], elem)
    }
    // 尝试解析名字
    let nId = CharId.getId(ds.name)
    if (nId) {
      return ret(nId.id, elem || nId.elem || '')
    }
    // 无匹配结果
    return false
  },

  isTraveler (id, game = 'gs') {
    if (id) {
      return [10000007, 10000005, 20000000].includes(id * 1)
    }
    return false
  },

  getTravelerId (id, game = 'gs') {
    return id * 1 === 10000005 ? 10000005 : 10000007
  },

  getSrMeta (name) {
    return srData?.[aliasMap[name]] || {}
  }
}
export default CharId
