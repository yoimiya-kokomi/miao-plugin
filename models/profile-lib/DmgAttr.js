/*
* 伤害计算 - 属性计算
* */
import { attrMap, eleMap } from './DmgCalcMeta.js'
import lodash from 'lodash'
import DmgMastery from './DmgMastery.js'
import { Format } from '../../components/index.js'

let DmgAttr = {
  // 计算并返回指定属性值
  getAttrValue (ds) {
    return (ds.base || 0) + (ds.plus || 0) + ((ds.base || 0) * (ds.pct || 0) / 100)
  },

  // 获取profile对应attr属性值
  getAttr ({ id, attr, weapon, char }) {
    let ret = {}

    // 基础属性
    lodash.forEach('atk,def,hp'.split(','), (key) => {
      ret[key] = {
        base: attr[`${key}Base`] * 1 || 0,
        plus: attr[key] * 1 - attr[`${key}Base`] * 1 || 0,
        pct: 0
      }
    })

    lodash.forEach('mastery,recharge,cpct,cdmg,heal,dmg,phy'.split(','), (key) => {
      ret[key] = {
        base: attr[key] * 1 || 0, // 基础值
        plus: 0, // 加成值
        pct: 0, // 百分比加成
        inc: 0 // 提高：护盾增效&治疗增效
      }
    })

    // 技能属性记录
    lodash.forEach('a,a2,a3,e,q'.split(','), (key) => {
      ret[key] = {
        pct: 0, // 倍率加成
        multi: 0, // 独立倍率乘区加成，宵宫E等

        plus: 0, // 伤害值提高
        dmg: 0, // 伤害提高
        cpct: 0, // 暴击提高
        cdmg: 0, // 爆伤提高

        def: 0, // 防御降低
        ignore: 0 // 无视防御
      }
    })

    ret.enemy = {
      def: 0, // 降低防御
      ignore: 0, // 无视防御
      phy: 0 // 物理防御
    }

    ret.shield = {
      base: 100, // 基础
      plus: 0, // 护盾强效
      inc: 100 // 吸收倍率
    }

    ret.weapon = weapon // 武器
    ret.weaponType = char.weaponType // 武器类型
    ret.element = eleMap[char.elem.toLowerCase()] // 元素类型
    ret.refine = ((weapon.affix || ret.refine || 1) * 1 - 1) || 0 // 武器精炼
    ret.multi = 0 // 倍率独立乘区
    ret.vaporize = 0 // 蒸发
    ret.melt = 0 // 融化
    ret.burning = 0 // 燃烧
    ret.superconduct = 0 // 超导
    ret.swirl = 0 // 扩散
    ret.electro_charged = 0 // 感电
    ret.shatter = 0 // 碎冰
    ret.overloaded = 0 // 超载
    ret.bloom = 0 // 绽放
    ret.burgeon = 0 // 烈绽放
    ret.hyperbloom = 0 // 超绽放
    ret.aggravate = 0 // 超激化
    ret.spread = 0 // 蔓激化
    ret.kx = 0 // 敌人抗性降低
    ret.fykx = 0 // 敌人反应抗性降低
    return ret
  },

  // 获取数据集
  getDs (attr, meta, params) {
    return {
      ...meta,
      attr,
      params,
      refine: attr.refine,
      weaponType: attr.weaponType,
      weapon: attr.weapon,
      element: eleMap[attr.element] || attr.element,
      // 计算属性
      calc: DmgAttr.getAttrValue
    }
  },

  // 计算属性
  calcAttr ({ originalAttr, buffs, meta, params = {}, incAttr = '', reduceAttr = '', talent = '' }) {
    let attr = lodash.merge({}, originalAttr)
    let msg = []

    if (incAttr && attrMap[incAttr]) {
      let aCfg = attrMap[incAttr]
      attr[incAttr][aCfg.type] += aCfg.val
    }
    if (reduceAttr && attrMap[reduceAttr]) {
      let aCfg = attrMap[reduceAttr]
      attr[reduceAttr][aCfg.type] -= aCfg.val
    }

    lodash.forEach(buffs, (buff) => {
      let ds = DmgAttr.getDs(attr, meta, params)

      ds.currentTalent = talent

      let mKey = {
        vaporize: '蒸发',
        melt: '融化',
        swirl: '扩散'
      }
      if (lodash.isString(buff) && mKey[buff]) {
        buff = {
          vaporize: {
            title: `元素精通：${mKey[buff]}伤害提高[${buff}]%`,
            mastery: buff
          }
        }
      }

      // 如果存在rule，则进行计算
      if (buff.check && !buff.check(ds)) {
        return
      }
      if (buff.cons) {
        if (ds.cons * 1 < buff.cons * 1) {
          return
        }
      }

      let title = buff.title

      if (buff.mastery) {
        let mastery = Math.max(0, attr.mastery.base + attr.mastery.plus)
        // let masteryNum = 2.78 * mastery / (mastery + 1400) * 100;
        buff.data = buff.data || {}
        lodash.forEach(buff.mastery.split(','), (key) => {
          buff.data[key] = DmgMastery.getMultiple(key, mastery)
        })
      }

      lodash.forEach(buff.data, (val, key) => {
        if (lodash.isFunction(val)) {
          val = val(ds)
        }

        title = title.replace(`[${key}]`, Format.comma(val, 1))
        // 技能提高
        let tRet = /^(a|a2|a3|e|q)(Def|Ignore|Dmg|Plus|Pct|Cpct|Cdmg|Multi)$/.exec(key)
        if (tRet) {
          attr[tRet[1]][tRet[2].toLowerCase()] += val * 1 || 0
          return
        }
        let aRet = /^(hp|def|atk|mastery|cpct|cdmg|heal|recharge|dmg|phy|shield)(Plus|Pct|Inc)?$/.exec(key)
        if (aRet) {
          attr[aRet[1]][aRet[2] ? aRet[2].toLowerCase() : 'plus'] += val * 1 || 0
          return
        }
        if (key === 'enemyDef') {
          attr.enemy.def += val * 1 || 0
          return
        }

        if (['vaporize', 'melt', 'burning', 'superconduct', 'swirl', 'electro_charged', 'shatter', 'overloaded', 'bloom', 'burgeon', 'hyperbloom', 'aggravate' , 'spread' ,'kx',  'fykx'].includes(key)) {
          attr[key] += val * 1 || 0
        }
      })
      msg.push(title)
    })

    return {
      attr, msg
    }
  }
}
export default DmgAttr
