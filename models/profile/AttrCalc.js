/**
 * 面板属性计算
 * @type {{}}
 */

import { Weapon, ProfileAttr } from '../index.js'
import { Format } from '#miao'
import { calc as artisBuffs } from '../../resources/meta/artifact/index.js'
import { artisBuffs as artisBuffsSR } from '../../resources/meta-sr/artifact/index.js'
import { weaponBuffs } from '../../resources/meta/weapon/index.js'
import lodash from 'lodash'

class AttrCalc {
  constructor (profile) {
    this.profile = profile
    this.char = profile.char
    this.game = this.char.game
  }

  get isGs () {
    return this.game === 'gs'
  }

  get isSr () {
    return this.game === 'sr'
  }

  /**
   * 静态调用入口
   * @param profile
   * @returns {AttrCalc}
   */
  static create (profile) {
    return new AttrCalc(profile)
  }

  // 只有原神才需要
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
    this.attr = ProfileAttr.create(this.char, {})
    if (this.isGs) {
      this.addAttr('recharge', 100, true)
      this.addAttr('cpct', 5, true)
      this.addAttr('cdmg', 50, true)
    }
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
    let { char, level, promote, trees } = this.profile
    let metaAttr = char.detail?.attr || {}
    let self = this
    if (this.isSr) {
      // 星铁面板属性
      let attr = char.getLvAttr(level, promote)
      lodash.forEach(attr, (v, k) => {
        k = k + (['hp', 'atk', 'def'].includes(k) ? 'Base' : '')
        self.addAttr(k, v, true)
      })

      let tree = char.detail?.tree || {}
      lodash.forEach(trees || [], (tid) => {
        let tCfg = tree[tid]
        if (tCfg) {
          let key = tCfg.key
          if (['atk', 'hp', 'def'].includes(key)) {
            key = key + 'Pct'
          }
          self.addAttr(key, tCfg.value)
        }
      })
      return
    }

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
    this.addAttr(keys[3], getLvData(3, true), !/(hp|atk|def)/.test(keys[3]))

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
    let weapon = Weapon.get(wData?.name || wData?.id, this.game)
    let wCalcRet = weapon.calcAttr(wData.level, wData.promote)
    let self = this

    let buffs = weapon.getWeaponBuffs(wData.affix, true)
    if (this.isSr) {
      // 星铁面板属性
      lodash.forEach(wCalcRet, (v, k) => {
        k = k + (['hp', 'atk', 'def'].includes(k) ? 'Base' : '')
        self.addAttr(k, v, true)
      })
      // 检查武器类型
      if (weapon.type === this.char.weapon) {
        // todo sr&gs 统一
        let wBuffs = weapon.getWeaponBuffs(wData.affix, true)
        lodash.forEach(wBuffs, (buff) => {
          lodash.forEach(buff.data || [], (v, k) => {
            self.addAttr(k, v)
          })
        })
      }
      return
    }

    // 原神属性
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
        this.calcArtisAttr(ds, this.char)
      })
    })
    let artiBuffsMap = this.isSr ? artisBuffsSR : artisBuffs
    // 计算圣遗物静态加成
    artis.eachArtisSet((set, num) => {
      let buff = (artiBuffsMap[set.name] && artiBuffsMap[set.name][num]) || artiBuffsMap[set.name + num]
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
   * @param char
   * @param autoPct
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
