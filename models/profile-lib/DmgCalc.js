/*
* 伤害计算 - 计算伤害
* */
import { eleBaseDmg } from './DmgCalcMeta.js'
import DmgMastery from './DmgMastery.js'

let DmgCalc = {
  calcRet (fnArgs = {}, data = {}) {
    let {
      pctNum, // 技能倍率
      talent, // 天赋类型
      ele, // 元素反应
      basicNum, // 基础数值
      mode // 模式
    } = fnArgs
    let {
      ds, // 数据集
      attr, // 属性
      level, // 面板数据
      enemyLv, // 敌人等级
      showDetail = false // 是否展示详情
    } = data
    let calc = ds.calc

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
    let defNum = (level + 100) / ((level + 100) + (enemyLv + 100) * (1 - enemyDef) * (1 - enemyIgnore))

    // 抗性区
    let kx = attr.kx
    if (ele === 'swirl'/* || (ele === 'phy' && (attr.element === '雷' || attr.element === '冰'))*/) {
      kx = attr.fykx
    }
    kx = 10 - (kx || 0)
    let kNum = 0.9
    if (kx >= 75) {
      kNum = 1 / (1 + 3 * kx / 100)
    } else if (kx >= 0) {
      kNum = (100 - kx) / 100
    } else {
      kNum = 1 - kx / 200
    }

    cpctNum = Math.max(0, Math.min(1, cpctNum))
    if (cpctNum === 0) {
      cdmgNum = 0
    }

    const isEle = ele !== false && ele !== 'phy'
    // 反应区
    let eleNum = isEle ? DmgMastery.getBasePct(ele, attr.element) : 1
    let eleBase = isEle ? 1 + attr[ele] / 100 + DmgMastery.getMultiple(ele, calc(attr.mastery)) : 1
    let dmgBase = (mode === 'basic') ? basicNum : atkNum * pctNum * (1 + multiNum) + plusNum
    let ret = {}

    switch (ele) {
      case 'vaporize':
      case 'melt': {
        ret = {
          dmg: dmgBase * dmgNum * (1 + cdmgNum) * defNum * kNum * eleBase * eleNum,
          avg: dmgBase * dmgNum * (1 + cpctNum * cdmgNum) * defNum * kNum * eleBase * eleNum
        }
        break
      }

      case 'burning':
      case 'superConduct':
      case 'swirl':
      case 'electroCharged':
      case 'shatter':
      case 'overloaded':
      case 'bloom':
      case 'burgeon':
      case 'hyperBloom': {
        eleBase *= eleBaseDmg[level]
        ret = { avg: eleBase * eleNum * kNum }
        break
      }

      case 'aggravate':
      case 'spread': {
        eleBase *= eleBaseDmg[level]
        dmgBase += eleBase * eleNum
        ret = {
          dmg: dmgBase * dmgNum * (1 + cdmgNum) * defNum * kNum,
          avg: dmgBase * dmgNum * (1 + cpctNum * cdmgNum) * defNum * kNum
        }
        break
      }

      default: {
        ret = {
          dmg: dmgBase * dmgNum * (1 + cdmgNum) * defNum * kNum,
          avg: dmgBase * dmgNum * (1 + cpctNum * cdmgNum) * defNum * kNum
        }
      }
    }

    if (showDetail) {
      console.log('Attr', attr)
      console.log({ mode, dmgBase, atkNum, pctNum, multiNum, plusNum, dmgNum, cpctNum, cdmgNum, defNum, eleNum, kNum })
      console.log('Ret', ret)
    }

    return ret
  },
  getDmgFn (data) {
    let { showDetail, attr, ds } = data
    let { calc } = ds

    let dmgFn = function (pctNum = 0, talent = false, ele = false, basicNum = 0, mode = 'talent') {
      return DmgCalc.calcRet({ pctNum, talent, ele, basicNum, mode }, data)
    }

    dmgFn.basic = function (basicNum = 0, talent = false, ele = false) {
      return dmgFn(0, talent, ele, basicNum, 'basic')
    }

    dmgFn.reaction = function (ele = false) {
      return dmgFn(0, 'fy', ele, 0, 'basic')
    }

    // 计算治疗
    dmgFn.heal = function (num) {
      if (showDetail) {
        console.log(num, calc(attr.heal), attr.heal.inc)
      }
      return {
        avg: num * (1 + calc(attr.heal) / 100 + attr.heal.inc / 100)
      }
    }

    // 计算护盾
    dmgFn.shield = function (num) {
      return {
        avg: num * (calc(attr.shield) / 100) * (attr.shield.inc / 100)
      }
    }
    // 扩散方法
    dmgFn.swirl = function () {
      return dmgFn(0, 'fy', 'swirl')
    }

    return dmgFn
  }
}
export default DmgCalc
