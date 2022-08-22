import lodash from 'lodash'
import { Character } from '../index.js'
import { eleBaseDmg, eleMap, } from './calc-meta.js'
import Mastery from './Mastery.js'

let Calc = {
  getDmgFn ({ ds, attr, profile, enemyLv, showDetail = false }) {
    let { calc } = ds

    let dmgFn = function (pctNum = 0, talent = false, ele = false, basicNum = 0, mode = 'talent') {
      let { atk, dmg, phy, cdmg, cpct } = attr
      // 攻击区
      let atkNum = calc(atk)

      // 倍率独立乘区
      let multiNum = attr.multi / 100

      // 增伤区
      let dmgNum = (1 + dmg.base / 100 + dmg.plus / 100)

      if (ele === 'phy') {
        dmgNum = (1 + phy.base / 100 + phy.plus / 100)
      }

      // console.log({ base: Format.comma(dmg.base, 2), plus: Format.comma(dmg.plus, 2) })

      let cpctNum = cpct.base / 100 + cpct.plus / 100

      // 爆伤区
      let cdmgNum = cdmg.base / 100 + cdmg.plus / 100

      let enemyDef = attr.enemy.def / 100
      let enemyIgnore = attr.enemy.ignore / 100

      let plusNum = 0

      if (talent && attr[talent]) {
        pctNum = pctNum / 100

        let ds = attr[talent]

        pctNum += ds.pct / 100
        dmgNum += ds.dmg / 100
        cpctNum += ds.cpct / 100
        cdmgNum += ds.cdmg / 100
        enemyDef += ds.def / 100
        enemyIgnore += ds.ignore / 100
        multiNum += ds.multi / 100
        plusNum += ds.plus
      }

      // 防御区
      let lv = profile.lv || profile.level
      let defNum = (lv + 100) / ((lv + 100) + (enemyLv + 100) * (1 - enemyDef) * (1 - enemyIgnore))

      // 抗性区
      let kx = attr.kx
      if (talent === 'fy') {
        kx = attr.fykx
      }
      kx = 10 - (kx || 0)
      let kNum = 0.9
      if (kx >= 0) {
        kNum = (100 - kx) / 100
      } else {
        kNum = 1 - kx / 200
      }

      // 反应区
      let eleNum = 1
      let eleBase = 0

      if (ele === 'ks' || ele === 'gd') {
        eleBase = eleBaseDmg[lv] || 0
      }

      if (ele === 'phy') {
        // do nothing
      } else if (ele) {
        eleNum = Mastery.getBasePct(ele, attr.element)

        if (attr[ele]) {
          eleNum = eleNum * (1 + attr[ele] / 100)
        }
      }

      cpctNum = Math.max(0, Math.min(1, cpctNum))
      if (cpctNum === 0) {
        cdmgNum = 0
      }

      let ret = {}
      if (mode === 'basic') {
        ret = {
          dmg: basicNum * dmgNum * (1 + cdmgNum) * defNum * kNum * eleNum,
          avg: basicNum * dmgNum * (1 + cpctNum * cdmgNum) * defNum * kNum * eleNum
        }
      } else if (eleBase) {
        ret = {
          avg: eleBase * kNum * eleNum
        }
      } else {
        // 计算最终伤害
        ret = {
          dmg: (atkNum * pctNum * (1 + multiNum) + plusNum) * dmgNum * (1 + cdmgNum) * defNum * kNum * eleNum,
          avg: (atkNum * pctNum * (1 + multiNum) + plusNum) * dmgNum * (1 + cpctNum * cdmgNum) * defNum * kNum * eleNum
        }
      }

      if (showDetail) {
        console.log(attr, { atkNum, pctNum, multiNum, plusNum, dmgNum, cpctNum, cdmgNum, defNum, eleNum, kNum }, ret)
      }

      return ret
    }

    dmgFn.basic = function (basicNum = 0, talent = false, ele = false) {
      return dmgFn(0, talent, ele, basicNum, 'basic')
    }

    dmgFn.heal = function (num) {
      if (showDetail) {
        console.log(num, calc(attr.heal), attr.heal.inc)
      }
      return {
        avg: num * (1 + calc(attr.heal) / 100 + attr.heal.inc / 100)
      }
    }

    dmgFn.shield = function (num) {
      return {
        avg: num * (calc(attr.shield) / 100) * (attr.shield.inc / 100)
      }
    }
    dmgFn.ks = function () {
      return dmgFn(0, 'fy', 'ks')
    }

    return dmgFn
  }

}

export default Calc
