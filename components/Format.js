import lodash from 'lodash'
import { Character } from '../models/index.js'

let CharId = Character.CharId

let Format = {
  int: function (d) {
    return parseInt(d)
  },
  comma: function (num, fix = 0) {
    num = parseFloat((num * 1).toFixed(fix))
    let [integer, decimal] = String.prototype.split.call(num, '.')
    integer = integer.replace(/\d(?=(\d{3})+$)/g, '$&,') // 正则先行断言
    return `${integer}${fix > 0 ? '.' + (decimal || lodash.repeat('0', fix)) : ''}`
  },
  pct: function (num, fix = 1) {
    return (num * 1).toFixed(fix) + '%'
  },
  percent: function (num, fix = 1) {
    return Format.pct(num * 100, fix)
  },

  elem: function (str, def = '') {
    let ret = CharId.matchElem(str, def)
    return ret ? ret.elem : def
  },

  elemName: function (elem, def = '') {
    return CharId.getElemName(elem) || def
  },

  isElem (elem) {
    return !!CharId.getElemName(elem)
  },

  elemTitleMap () {
    return CharId.elemTitleMap
  }

}

export default Format
