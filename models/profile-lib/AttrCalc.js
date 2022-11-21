/**
 * 面板属性计算
 * @type {{}}
 */

import { Weapon, ProfileAttr } from '../index.js'
import { attrNameMap } from '../../resources/meta/artifact/artis-mark.js'
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
   * @returns {boolean|void}
   */
  static getAttr (profile) {
    let attr = new AttrCalc(profile)
    if (!process.argv.includes('web-debug')) {
      return false
    }
    return attr.calc()
  }

  /**
   * 实例调用入口
   * @param profile
   */
  calc (profile) {
    this.attr = ProfileAttr.init({
      recharge: 100,
      cpct: 5,
      cdmg: 50
    })
    this.setCharAttr()
    this.setWeaponAttr()
    this.setArtisAttr()
    console.log(this.attr, this.attr.getAttr())
  }

  /**
   * 属性初始化
   */
  init () {
  }

  addAttr (key, val) {
    this.attr.addAttr(key, val)
  }

  /**
   * 计算角色属性
   * @param affix
   */
  setCharAttr (affix = '') {
    let { char, level } = this.profile
    let metaAttr = char.detail?.attr || {}
    let { keys = {}, details = {} } = metaAttr
    let lvLeft = 0
    let lvRight = 0
    let lvStep = [1, 20, 50, 60, 70, 80, 90]
    for (let idx = 0; idx < lvStep.length - 1; idx++) {
      if (level >= lvStep[idx] && level <= lvStep[idx + 1]) {
        lvLeft = lvStep[idx]
        lvRight = lvStep[idx + 1]
      }
    }
    let detailLeft = details[lvLeft + '+'] || details[lvLeft] || {}
    let detailRight = details[lvRight] || {}

    let getLvData = (idx) => {
      let valueLeft = detailLeft[idx]
      let valueRight = detailRight[idx]
      return valueLeft * 1 + ((valueRight - valueLeft) * (level - lvLeft) / (lvRight - lvLeft))
    }
    this.addAttr('hpBase', getLvData(0))
    this.addAttr('atkBase', getLvData(1))
    this.addAttr('defBase', getLvData(2))
    this.addAttr(keys[3], (details[lvRight] || [])[3])
  }

  /**
   * 计算武器属性
   */
  setWeaponAttr () {
    let wData = this.profile?.weapon
    let weapon = Weapon.get(wData?.name)
    let level = wData.level
    let lvLeft = 0
    let lvRight = 0
    let lvStep = [1, 20, 40, 50, 60, 70, 80, 90]
    for (let idx = 0; idx < lvStep.length - 1; idx++) {
      if (level >= lvStep[idx] && level <= lvStep[idx + 1]) {
        lvLeft = lvStep[idx]
        lvRight = lvStep[idx + 1]
      }
    }
    let wAttr = weapon?.detail?.attr
    let wAtk = wAttr.atk
    let valueLeft = wAtk[lvLeft + '+'] || wAtk[lvLeft]
    let valueRight = wAtk[lvRight]
    this.addAttr('atkBase', valueLeft * 1 + ((valueRight - valueLeft) * (level - lvLeft) / (lvRight - lvLeft)))
    let wBonus = wAttr.bonusData
    valueLeft = wBonus[lvLeft + '+'] || wBonus[lvLeft]
    valueRight = wBonus[lvRight]
    let valueStep = (valueRight - valueLeft) / ((lvRight - lvLeft) / 5)
    let add = valueLeft + Math.floor((level - lvLeft) / 5) * valueStep
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
          console.log(affix, key, r[affix - 1])
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
      this.calcArtisAttr(arti.main)
      lodash.forEach(arti.attrs, (ds) => {
        this.calcArtisAttr(ds)
      })
    })
    // 计算圣遗物静态加成
    artis.eachArtisSet((set, num) => {
      let buff = artisBuffs[set.name] && artisBuffs[set.name][num]
      if (!buff.isStatic) {
        return true
      }
      lodash.forEach(buff.data, (val, key) => {
        console.log(buff.title, key, val)
        this.addAttr(key, val)
      })
    })
  }

  /**
   * 计算单条圣遗物词缀
   * @param ds
   * @returns {boolean}
   */
  calcArtisAttr (ds) {
    let title = ds.title
    let key = attrNameMap[title]
    if (/元素伤害/.test(title)) {
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

  static getArtisKey (ds) {

  }
}

export default AttrCalc
