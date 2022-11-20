/**
 * 面板属性计算
 * @type {{}}
 */

import { Weapon } from '../index.js'
import { attrNameMap } from '../../resources/meta/artifact/artis-mark.js'
import lodash from 'lodash'

class AttrCalc {
  constructor (profile) {
    this.profile = profile
    this.char = profile.char
  }

  static getAttr (profile) {
    let attr = new AttrCalc(profile)
    if (profile?.char?.name !== '纳西妲') {
      return false
    }
    return attr.calc()
  }

  calc (profile) {
    this.init()
    this.setCharAttr()
    this.setWeaponAttr()
    this.setArtisAttr()
    console.log(this.attr)
  }

  init () {
    this.attr = {
      atkBase: 0,
      atkPct: 0,
      atkPlus: 0,
      hpBase: 0,
      hpPct: 0,
      hpPlus: 0,
      defBase: 0,
      defPct: 0,
      defPlus: 0,
      mastery: 0,
      recharge: 100,
      shield: 0,
      heal: 0,
      dmg: 0,
      phy: 0,
      cpct: 5,
      cdmg: 50
    }
  }

  setCharAttr (affix = '') {
    let { char, level } = this.profile
    let metaAttr = char.detail?.attr || {}
    let { keys, details } = metaAttr
    let lvLeft = 0
    let lvRight = 0
    let lvStep = [1, 20, 50, 60, 70, 80, 90]
    for (let idx = 0; idx < lvStep.length - 1; idx++) {
      if (level >= lvStep[idx] && level <= lvStep[idx + 1]) {
        lvLeft = lvStep[idx]
        lvRight = lvStep[idx + 1]
      }
    }
    let detailLeft = details[lvLeft + '+'] || details[lvLeft]
    let detailRight = details[lvRight]

    let getLvData = (idx) => {
      let valueLeft = detailLeft[idx]
      let valueRight = detailRight[idx]
      return valueLeft * 1 + ((valueRight - valueLeft) * (level - lvLeft) / (lvRight - lvLeft))
    }
    let attr = this.attr
    attr.hpBase += getLvData(0)
    attr.atkBase += getLvData(1)
    attr.defBase += getLvData(2)
    attr[keys[3]] += details[lvRight][3]
  }

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
    let attr = this.attr
    let wAttr = weapon?.detail?.attr
    let wAtk = wAttr.atk
    let valueLeft = wAtk[lvLeft + '+'] || wAtk[lvLeft]
    let valueRight = wAtk[lvRight]
    attr.atkBase += valueLeft * 1 + ((valueRight - valueLeft) * (level - lvLeft) / (lvRight - lvLeft))
    let wBonus = wAttr.bonusData
    valueLeft = wBonus[lvLeft + '+'] || wBonus[lvLeft]
    valueRight = wBonus[lvRight]
    let valueStep = (valueRight - valueLeft) / ((lvRight - lvLeft) / 5)
    let add = valueLeft + Math.floor((level - lvLeft) / 5) * valueStep
    attr[wAttr.bonusKey] += add
  }

  setArtisAttr () {
    let artis = this.profile?.artis
    let attr = this.attr
    artis.forEach((arti) => {
      this.calcArtisAttr(arti.main)
      lodash.forEach(arti.attrs, (ds) => {
        this.calcArtisAttr(ds)
      })
    })
  }

  calcArtisAttr (ds) {
    let title = ds.title
    let key = attrNameMap[title]
    if (/元素伤害/.test(title)) {
      key = 'dmg'
    }
    if (!key) {
      console.log(title)
      return false
    }
    if (['atk', 'hp', 'def'].includes(key)) {
      key = key + 'Pct'
    }
    this.attr[key] += ds.value * 1
  }

  static getArtisKey (ds) {

  }
}

export default AttrCalc
