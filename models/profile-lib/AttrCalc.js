/**
 * 面板属性计算
 * @type {{}}
 */

import { Weapon, ProfileAttr } from '../index.js'
import { Format } from '../../components/index.js'
import { calc as artisBuffs } from '../../resources/meta/artifact/index.js'
import { calc as weaponBuffs } from '../../resources/meta/weapon/index.js'
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

  /**
   * 面板属性计算
   * @returns {{}}
   */
  calc () {
    this.attr = ProfileAttr.create({
      recharge: 100,
      cpct: 5,
      cdmg: 50
    })
    this.setCharAttr()
    this.setWeaponAttr()
    this.setArtisAttr()
    if (process.argv.includes('web-debug')) {
      // console.log(this.attr, this.attr.getAttr())
    }
    return this.attr.getAttr()
  }

  addAttr (key, val) {
    this.attr.addAttr(key, val)
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
    this.addAttr('hpBase', getLvData(0))
    this.addAttr('atkBase', getLvData(1))
    this.addAttr('defBase', getLvData(2))
    this.addAttr(keys[3], getLvData(3, true))

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
    let wData = this.profile?.weapon
    let weapon = Weapon.get(wData?.name)
    let level = wData.level
    let promote = lodash.isUndefined(wData.promote) ? -1 : wData.promote
    let lvLeft = 1
    let lvRight = 20
    let lvStep = [1, 20, 40, 50, 60, 70, 80, 90]
    let currPromote = 0
    for (let idx = 0; idx < lvStep.length - 1; idx++) {
      if (promote === -1 || (currPromote === promote)) {
        if (level >= lvStep[idx] && level <= lvStep[idx + 1]) {
          lvLeft = lvStep[idx]
          lvRight = lvStep[idx + 1]
          break
        }
      }
      currPromote++
    }
    let wAttr = weapon?.detail?.attr || {}
    let wAtk = wAttr.atk || {}
    let valueLeft = wAtk[lvLeft + '+'] || wAtk[lvLeft] || {}
    let valueRight = wAtk[lvRight] || {}
    this.addAttr('atkBase', valueLeft * 1 + ((valueRight - valueLeft) * (level - lvLeft) / (lvRight - lvLeft)))
    let wBonus = wAttr.bonusData || {}
    valueLeft = wBonus[lvLeft + '+'] || wBonus[lvLeft]
    valueRight = wBonus[lvRight]
    let stepCount = Math.ceil((lvRight - lvLeft) / 5)
    let valueStep = (valueRight - valueLeft) / stepCount
    let add = valueLeft + (stepCount - Math.ceil((lvRight - level) / 5)) * valueStep
    this.addAttr(wAttr.bonusKey, add)

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
  }
}

export default AttrCalc
