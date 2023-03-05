import lodash from 'lodash'
import Base from './Base.js'

const baseAttr = 'atk,def,hp,mastery,recharge,cpct,cdmg,dmg,phy,heal,shield'.split(',')
let attrReg = new RegExp(`^(${baseAttr.join('|')})(Base|Plus|Pct|Inc)$`)

class ProfileAttr extends Base {
  constructor (data = null) {
    super()
    this.init(data)
  }

  static create (data = null) {
    return new ProfileAttr(data)
  }

  init (data) {
    // 基础属性
    this._attr = {}
    this._base = {}
    let attr = this._attr
    let base = this._base
    lodash.forEach(baseAttr, (key) => {
      attr[key] = {
        base: 0,
        plus: 0,
        pct: 0
      }
      base[key] = 0
    })
    if (data) {
      this.setAttr(data, true)
    }
  }

  /**
   * getter
   *
   * @param key
   * @returns {*|number}
   * @private
   */
  _get (key) {
    let attr = this._attr
    if (baseAttr.includes(key)) {
      let a = attr[key]
      return a.base * (1 + a.pct / 100) + a.plus
    }

    let testRet = attrReg.exec(key)
    if (testRet && testRet[1] && testRet[2]) {
      let key = testRet[1]
      let key2 = testRet[2].toLowerCase()
      return attr[key][key2] || 0
    }
  }

  /**
   * 添加或追加Attr数据
   * @param key
   * @param val
   * @param base
   * @returns {boolean}
   */
  addAttr (key, val, isBase = false) {
    let attr = this._attr
    let base = this._base
    if (baseAttr.includes(key)) {
      attr[key].plus += val * 1
      if (isBase) {
        base[key] = (base[key] || 0) + val * 1
      }
      return true
    }

    let testRet = attrReg.exec(key)
    if (testRet && testRet[1] && testRet[2]) {
      let key = testRet[1]
      let key2 = testRet[2].toLowerCase()
      attr[key][key2] = attr[key][key2] || 0
      attr[key][key2] += val * 1
      if (key2 === 'base' || isBase) {
        base[key] = (base[key] || 0) + val * 1
      }
      return true
    }
    return false
  }

  /**
   * 设置属性
   * @param data
   * @param withBase：带有base数据的初始化设置，会将atk/hp/def视作结果数据而非plus数据
   */
  setAttr (data, withBase = false) {
    if (withBase) {
      lodash.forEach(['hp', 'def', 'atk'], (key) => {
        let base = `${key}Base`
        if (data[key] && data[base]) {
          data[`${key}Plus`] = data[key] - data[base]
          delete data[key]
        }
      })
    }
    lodash.forEach(data, (val, key) => {
      this.addAttr(key, val)
    })
  }

  getAttr () {
    let ret = {}
    lodash.forEach(baseAttr, (key) => {
      ret[key] = this[key]
      if (['hp', 'atk', 'def'].includes(key)) {
        ret[`${key}Base`] = this[`${key}Base`]
      }
    })
    ret._calc = true
    return ret
  }

  getBase () {
    return this._base
  }
}

export default ProfileAttr
