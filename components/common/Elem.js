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

}

// 元素属性映射, 名称=>elem
let elemMap = {}

// 标准元素名
let elemTitleMap = {}

lodash.forEach(elemAlias, (txt, key) => {
  elemMap[key] = key
  elemTitleMap[key] = txt[0]
  Data.eachStr(txt, (t) => (elemMap[t] = key))
})

const Elem = {
  // 根据名称获取元素key
  elem (elem = '', defElem = '') {
    elem = elem.toLowerCase()
    return elemMap[elem] || defElem
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

  eachElem (fn) {
    lodash.forEach(elemTitleMap, (title, key) => {
      fn(key, title)
    })
  },

  isElem (elem = '') {
    return !!elemMap[elem]
  }
}
export default Elem
