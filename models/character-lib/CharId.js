import lodash from 'lodash'
import { Data } from '../../components/index.js'
import { charPosIdx, elemAlias } from './CharMeta.js'

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
// 元素属性映射
let elemMap = {}
// 元素名
let elemTitleMap = {}

let gsCfg

async function init () {
  let { sysCfg, diyCfg } = await Data.importCfg('character')
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

  gsCfg = await Data.importDefault('plugins/genshin/model/gsCfg.js', 'root')
  console.log(gsCfg)
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

lodash.forEach(elemAlias, (txt, key) => {
  elemMap[key] = key
  elemTitleMap[key] = txt[0]
  Data.eachStr(txt, (t) => (elemMap[t] = key))
})

const CharId = {
  aliasMap,
  idMap,
  abbrMap,
  wifeMap,
  idSort,
  getId (ds = '') {
    if (!ds) {
      return false
    }
    const ret = (id, elem = '') => {
      return { id, elem, name: idMap[id] }
    }
    if (!lodash.isObject(ds)) {
      ds = lodash.trim(ds || '').toLowerCase()
      // 尝试使用元素起始匹配
      let em = CharId.matchElem(ds)
      if (em && aliasMap[em.name] && CharId.isTraveler(aliasMap[em.name])) {
        return ret(aliasMap[em.name], em.elem)
      }
      // 直接匹配
      if (aliasMap[ds]) {
        return ret(aliasMap[ds])
      }
      // 调用V3方法匹配
      if (gsCfg && gsCfg.getRole) {
        let roleRet = gsCfg.getRole(ds)
        if (roleRet.name && aliasMap[roleRet.name]) {
          return ret(aliasMap[roleRet.name])
        }
      }
      // 无匹配结果
      return false
    }
    // 获取字段进行匹配
    let { id = '', name = '' } = ds
    let elem = CharId.getElem(ds.elem || ds.element) || ''
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

  isTraveler (id) {
    if (id) {
      return [10000007, 10000005, 20000000].includes(id * 1)
    }
    return false
  },

  // 获取元素
  getElem (elem = '') {
    elem = elem.toLowerCase()
    return elemMap[elem] || false
  },

  // 获取元素名
  getElemName (elem = '') {
    return elemTitleMap[CharId.getElem(elem)]
  },

  // 名字匹配元素
  matchElem (name = '', defElem = '') {
    const elemReg = new RegExp(`^(${lodash.keys(elemMap).join('|')})`)
    let elemRet = elemReg.exec(name)
    if (elemRet && elemRet[1]) {
      return {
        elem: CharId.getElem(elemRet[1]),
        name: name.replace(elemReg, '')
      }
    } else if (defElem) {
      return {
        elem: CharId.getElem(defElem),
        name
      }
    }
    return false
  },

  getTravelerId (id) {
    return id * 1 === 10000005 ? 10000005 : 10000007
  }
}
export default CharId
