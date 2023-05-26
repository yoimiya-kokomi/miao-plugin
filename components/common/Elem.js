import { Data } from '../index.js'
import lodash from 'lodash'

const elemAlias = {
  anemo: '风,蒙德',
  geo: '岩,璃月',
  electro: '雷,电,雷电,稻妻',
  dendro: '草,须弥',
  pyro: '火,纳塔',
  hydro: '水,枫丹',
  cryo: '冰,至冬'
}

const elemAliasSR = {
  fire: '火',
  ice: '冰',
  wind: '风',
  elec: '雷',
  phy: '物理',
  quantum: '量子',
  imaginary: '虚数'
}

// 元素属性映射, 名称=>elem
let elemMap = {}
let elemMapSR = {}

// 标准元素名
let elemTitleMap = {}
let elemTitleMapSR = elemAliasSR

lodash.forEach(elemAlias, (txt, key) => {
  elemMap[key] = key
  elemTitleMap[key] = txt[0]
  Data.eachStr(txt, (t) => (elemMap[t] = key))
})
lodash.forEach(elemAliasSR, (txt, key) => {
  elemMapSR[key] = key
  elemMapSR[txt] = key
})

const Elem = {
  // 根据名称获取元素key
  elem (elem = '', defElem = '', game = 'gs') {
    elem = elem.toLowerCase()
    return (game === 'gs' ? elemMap : elemMapSR)[elem] || defElem
  },

  // 根据key获取元素名
  elemName (elem = '', defName = '') {
    return elemTitleMap[Elem.elem(elem)] || defName
  },

  // 从字符串中匹配元素
  matchElem (name = '', defElem = '', withName = false) {
    const elemReg = new RegExp(`^(${lodash.keys(elemMap).join('|')})`)
    let elemRet = elemReg.exec(name)
    let elem = (elemRet && elemRet[1]) ? Elem.elem(elemRet[1]) : defElem
    if (elem) {
      if (withName) {
        return {
          elem,
          name: name.replace(elemReg, '')
        }
      }
      return elem
    }
    return ''
  },

  eachElem (fn, game = 'gs') {
    lodash.forEach(game === 'gs' ? elemTitleMap : elemTitleMapSR, (title, key) => {
      fn(key, title)
    })
  },

  isElem (elem = '', game = 'gs') {
    return !!(game === 'gs' ? elemMap : elemMapSR)[elem]
  },

  sameElem (key1, key2, game = 'gs') {
    let map = (game === 'gs' ? elemMap : elemMapSR)
    return map[key1] === map[key2]
  }
}
export default Elem
