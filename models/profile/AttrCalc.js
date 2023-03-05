/**
 * 面板属性计算
 * @type {{}}
 */

import { Weapon, ProfileAttr } from '../index.js'
import { Format } from '../../components/index.js'
import { calc as artisBuffs } from '../../resources/meta/artifact/index.js'
import { weaponBuffs } from '../../resources/meta/weapon/index.js'
import lodash from 'lodash'

class AttrCalc {
  constructor (profile) {
    this.profile = profile
    this.char = profile.char
  }

  /**
   * 静态调用入口
   * @param profile
   * @returns {AttrCalc}
   */
  static create (profile) {
    return new AttrCalc(profile)
  }

  static calcPromote (lv) {
    if (lv === 20) {
      return 1
    }
    if (lv === 90) {
      return 6
    }
    let lvs = [1, 20, 40, 50, 60, 70, 80, 90]
    let promote = 0
    for (let idx = 0; idx < lvs.length - 1; idx++) {
      if (lv >= lvs[idx] && lv <= lvs[idx + 1]) {
        return promote
      }
      promote++
    }
    return promote
  }

  /**
   * 面板属性计算
   * @returns {{}}
   */
  calc () {
    this.attr = ProfileAttr.create({})
    this.addAttr('recharge', 100, true)
    this.addAttr('cpct', 5, true)
    this.addAttr('cdmg', 50, true)
    this.setCharAttr()
    this.setWeaponAttr()
    this.setArtisAttr()
    return this.attr.getAttr()
  }

  getBase () {
    return this.attr.getBase()
  }


  addAttr (key, val, isBase = false) {
    this.attr.addAttr(key, val, isBase)
  }

  /**
   * 计算角色属性
   * @param affix
   */
  setCharAttr (affix = '') {
    let { char, level, promote } = this.profile
    let metaAttr = char.detail?.attr || {}
    let { keys = {}, details = {} } = metaAttr
    let lvLeft = 0
    let lvRight = 0
    let lvStep = [1, 20, 40, 50, 60, 70, 80, 90]
    let currPromote = 0
    for (let idx = 0; idx < lvStep.length - 1; idx++) {
      if (currPromote === promote) {
        if (level >= lvStep[idx] && level <= lvStep[idx + 1]) {
          lvLeft = lvStep[idx]
          lvRight = lvStep[idx + 1]
          break
        }
      }
      currPromote++
    }
    let detailLeft = details[lvLeft + '+'] || details[lvLeft] || {}
    let detailRight = details[lvRight] || {}

    let getLvData = (idx, step = false) => {
      let valueLeft = detailLeft[idx]
      let valueRight = detailRight[idx]
      if (!step) {
        return valueLeft * 1 + ((valueRight - valueLeft) * (level - lvLeft) / (lvRight - lvLeft))
      } else {
        return valueLeft * 1 + ((valueRight - valueLeft) * Math.floor((level - lvLeft) / 5) / Math.round(((lvRight - lvLeft) / 5)))
      }
    }
    this.addAttr('hpBase', getLvData(0), true)
    this.addAttr('atkBase', getLvData(1), true)
    this.addAttr('defBase', getLvData(2), true)
    this.addAttr(keys[3], getLvData(3, true), true)

    let charBuffs = char.getCalcRule()
    lodash.forEach(charBuffs.buffs, (buff) => {
      if (!buff.isStatic) {
        return true
      }
      if (buff) {
        lodash.forEach(buff.data, (val, key) => {
          this.addAttr(key, val)
        })
      }
    })
  }

  /**
   * 计算武器属性
   */
  setWeaponAttr () {
    let wData = this.profile?.weapon || {}
    let weapon = Weapon.get(wData?.name)
    let wCalcRet = weapon.calcAttr(wData.level, wData.promote)

    if (wCalcRet) {
      this.addAttr('atkBase', wCalcRet.atkBase)
      this.addAttr(wCalcRet.attr?.key, wCalcRet.attr?.value)
    }

    let wBuffs = weaponBuffs[weapon.name] || []
    if (lodash.isPlainObject(wBuffs)) {
      wBuffs = [wBuffs]
    }
    let affix = wData.affix || 1
    lodash.forEach(wBuffs, (buff) => {
      if (!buff.isStatic) {
        return true
      }
      if (buff) {
        lodash.forEach(buff.refine, (r, key) => {
          this.addAttr(key, r[affix - 1] * (buff.buffCount || 1))
        })
      }
    })
  }

  /**
   * 计算圣遗物属性
   */
  setArtisAttr () {
    let artis = this.profile?.artis
    // 计算圣遗物词条
    artis.forEach((arti) => {
      this.calcArtisAttr(arti.main, this.char)
      lodash.forEach(arti.attrs, (ds) => {
        this.calcArtisAttr(ds)
      })
    })
    // 计算圣遗物静态加成
    artis.eachArtisSet((set, num) => {
      let buff = artisBuffs[set.name] && artisBuffs[set.name][num]
      if (!buff || !buff.isStatic) {
        return true
      }
      if (buff.elem && !this.char.isElem(buff.elem)) {
        return true
      }
      lodash.forEach(buff.data, (val, key) => {
        this.addAttr(key, val)
      })
    })
  }

  /**
   * 计算单条圣遗物词缀
   * @param ds
   * @returns {boolean}
   */
  calcArtisAttr (ds, char) {
    if (!ds) {
      return false
    }
    let key = ds.key
    if (Format.isElem(key) && char.elem === key) {
      key = 'dmg'
    }
    if (!key) {
      return false
    }
    if (['atk', 'hp', 'def'].includes(key)) {
      key = key + 'Pct'
    }
    this.attr.addAttr(key, ds.value * 1)
  }
}

export default AttrCalc
