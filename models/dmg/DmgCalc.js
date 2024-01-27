/*
* 伤害计算 - 计算伤害
* */
import { eleBaseDmg, erTitle, breakBaseDmg } from './DmgCalcMeta.js'
import DmgMastery from './DmgMastery.js'

let DmgCalc = {
  calcRet (fnArgs = {}, data = {}) {
    let {
      pctNum, // 技能倍率
      talent, // 天赋类型
      ele, // 元素反应
      basicNum, // 基础数值
      mode, // 模式
      dynamicData // 动态伤害计算数据
    } = fnArgs
    let {
      dynamicDmg = 0, // 动态增伤
      dynamicPhy = 0, // 动态物伤
      dynamicCpct = 0, // 动态暴击率
      dynamicCdmg = 0, // 动态暴击伤害
      dynamicEnemyDmg = 0 // 动态易伤
    } = dynamicData
    let {
      ds, // 数据集
      attr, // 属性
      level, // 面板数据
      enemyLv, // 敌人等级
      showDetail = false, // 是否展示详情
      game
    } = data
    let calc = ds.calc

    let { atk, dmg, phy, cdmg, cpct, enemyDmg } = attr

    // 攻击区
    let atkNum = calc(atk)

    // 倍率独立乘区
    let multiNum = attr.multi / 100

    // 增伤区
    let dmgNum = (1 + dmg.base / 100 + dmg.plus / 100 + dynamicDmg / 100)

    if (ele === 'phy') {
      dmgNum = (1 + phy.base / 100 + phy.plus / 100 + dynamicPhy / 100)
    }

    // 易伤区
    let enemyDmgNum = 1
    if (game === 'sr') {
      enemyDmgNum = 1 + enemyDmg.base / 100 + enemyDmg.plus / 100 + dynamicEnemyDmg / 100
    }

    // 暴击区
    let cpctNum = cpct.base / 100 + cpct.plus / 100 + dynamicCpct / 100

    // 爆伤区
    let cdmgNum = cdmg.base / 100 + cdmg.plus / 100 + dynamicCdmg / 100

    let enemyDef = attr.enemy.def / 100
    let enemyIgnore = attr.enemy.ignore / 100

    let plusNum = 0

    pctNum = pctNum / 100
    if (talent && attr[talent]) {
      let ds = attr[talent]

      pctNum += ds.pct / 100
      dmgNum += ds.dmg / 100
      enemyDmgNum += game === 'gs' ? 0 : ds.enemydmg / 100
      cpctNum += ds.cpct / 100
      cdmgNum += ds.cdmg / 100
      enemyDef += ds.def / 100
      enemyIgnore += ds.ignore / 100
      multiNum += ds.multi / 100
      plusNum += ds.plus
    }

    // 防御区
    let defNum = (level + 100) / ((level + 100) + (enemyLv + 100) * (1 - enemyDef) * (1 - enemyIgnore))
    if (game === 'sr') {
      let enemyDefdown = enemyDef + enemyIgnore <= 1 ? enemyDef + enemyIgnore : 1
      defNum = (200 + level * 10) / ((200 + level * 10) + (200 + enemyLv * 10) * (1 - enemyDefdown))
    }

    // 抗性区
    let kx = attr.kx
    let kNum = 0.9
    if (game === 'sr') {
      kNum = 1 + (kx / 100)
    } else {
      if (ele === 'swirl') {
        kx = attr.fykx
      }
      kx = 10 - (kx || 0)
      if (kx >= 75) {
        kNum = 1 / (1 + 3 * kx / 100)
      } else if (kx >= 0) {
        kNum = (100 - kx) / 100
      } else {
        kNum = 1 - kx / 200
      }
    }

    // 减伤区
    let dmgReduceNum = 1
    if (game === 'sr') {
      dmgReduceNum = 0.9
    }

    cpctNum = Math.max(0, Math.min(1, cpctNum))
    if (cpctNum === 0) {
      cdmgNum = 0
    }

    const isEle = ele !== false && ele !== 'phy'
    // 反应区
    let eleNum = 1
    let eleBase = 1
    if (game === 'gs') {
      eleNum = isEle ? DmgMastery.getBasePct(ele, attr.element) : 1
      eleBase = isEle ? 1 + attr[ele] / 100 + DmgMastery.getMultiple(ele, calc(attr.mastery)) : 1
    }

    let breakDotBase = 1
    let stanceNum = 1
    if (game === 'sr') {
      switch (ele) {
        case 'skillDot': {
          dmgNum += attr.dot.dmg / 100
          enemyDmgNum += attr.dot.enemydmg / 100
          break
        }
        case 'shock':
        case 'burn':
        case 'windShear':
        case 'bleed':
        case 'entanglement':
        case 'lightningBreak':
        case 'fireBreak':
        case 'windBreak':
        case 'physicalBreak':
        case 'quantumBreak':
        case 'imaginaryBreak':
        case 'iceBreak': {
          eleNum = DmgMastery.getBasePct(ele, attr.element)
          stanceNum = 1 + calc(attr.stance) / 100
          enemyDmgNum += attr.dot.enemydmg / 100
          break
        }
        default:
          break
      }
    }

    let dmgBase = (mode === 'basic') ? basicNum + plusNum : atkNum * pctNum * (1 + multiNum) + plusNum
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

      // 技能持续伤害 = 伤害值乘区 * 增伤区 * 易伤区 * 防御区 * 抗性区 * 减伤区
      case 'skillDot': {
        ret = {
          avg: dmgBase * dmgNum * enemyDmgNum * defNum * kNum * dmgReduceNum
        }
        break
      }

      // 未计算层数(风化、纠缠)和韧性条系数(击破、纠缠)
      // 常规击破伤害均需要计算减伤区（即按韧性条存在处理） 特例：阮梅终结技/秘技击破伤害不计算减伤
      // 击破伤害 = 基础伤害 * 属性击破伤害系数 * (1+击破特攻%) * 易伤区 * 防御区 * 抗性区 * 减伤区 * (敌方韧性+2)/4 * 层数系数
      // 击破持续伤害 = 基础伤害 * 属性持续伤害系数 * (1+击破特攻%) * 易伤区 * 防御区 * 抗性区 * 减伤区 * 层数系数
      case 'shock':
      case 'burn':
      case 'windShear':
      case 'bleed':
      case 'entanglement':
      case 'lightningBreak':
      case 'fireBreak':
      case 'windBreak':
      case 'physicalBreak':
      case 'quantumBreak' :
      case 'imaginaryBreak':
      case 'iceBreak': {
        breakDotBase *= breakBaseDmg[level]
        ret = {
          avg: breakDotBase * eleNum * stanceNum * enemyDmgNum * defNum * kNum * dmgReduceNum
        }
        break
      }

      default: {
        ret = {
          dmg: dmgBase * dmgNum * enemyDmgNum * (1 + cdmgNum) * defNum * kNum * dmgReduceNum,
          avg: dmgBase * dmgNum * enemyDmgNum * (1 + cpctNum * cdmgNum) * defNum * kNum * dmgReduceNum
        }
      }
    }

    if (showDetail) {
      console.log('Attr', attr)
      console.log({ mode, dmgBase, atkNum, pctNum, multiNum, plusNum, dmgNum, enemyDmgNum, stanceNum, cpctNum, cdmgNum, defNum, eleNum, kNum, dmgReduceNum })
      console.log('Ret', ret)
    }

    return ret
  },
  getDmgFn (data) {
    let { showDetail, attr, ds, game } = data
    let { calc } = ds

    let dmgFn = function (pctNum = 0, talent = false, ele = false, basicNum = 0, mode = 'talent', dynamicData = false) {
      if (ele) {
        ele = erTitle[ele] || ele
      }
      if (game === 'sr') {
        // 星铁meta数据天赋为百分比前数字
        pctNum = pctNum * 100
      }
      return DmgCalc.calcRet({ pctNum, talent, ele, basicNum, mode, dynamicData }, data)
    }

    dmgFn.basic = function (basicNum = 0, talent = false, ele = false, dynamicData = false) {
      return dmgFn(0, talent, ele, basicNum, 'basic', dynamicData)
    }

    dmgFn.reaction = function (ele = false) {
      return dmgFn(0, 'fy', ele, 0, 'basic')
    }

    dmgFn.dynamic = function (pctNum = 0, talent = false, dynamicData = false, ele = false) {
      return dmgFn(pctNum, talent, ele, 0, 'talent', dynamicData)
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
      if (showDetail) {
        console.log(num, calc(attr.shield), calc(attr.shield.inc))
      }
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
