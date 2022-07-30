import fs from 'fs'
import lodash from 'lodash'
import Format from './Format.js'
import { Character } from './models.js'

import { eleBaseDmg, eleMap, attrMap } from './calc/calc-meta.js'
import { Mastery } from './calc/mastery.js'

let Calc = {

  async getCharCalcRule (name) {
    const _path = process.cwd()
    const cfgPath = `${_path}/plugins/miao-plugin/resources/meta/character/${name}/calc.js`

    let details; let buffs = []; let defParams = {}; let defDmgIdx = -1; let mainAttr = 'atk,cpct,cdmg'; let enemyName = '小宝'
    if (fs.existsSync(cfgPath)) {
      let fileData = await import(`file://${cfgPath}`)
      details = fileData.details || false
      buffs = fileData.buffs || []
      defParams = fileData.defParams || {}
      if (fileData.defDmgIdx) {
        defDmgIdx = fileData.defDmgIdx
      }
      if (fileData.mainAttr) {
        mainAttr = fileData.mainAttr
      }
      if (fileData.enemyName) {
        enemyName = fileData.enemyName
      }
    }

    if (details) {
      return { details, buffs, defParams, defDmgIdx, mainAttr, enemyName }
    }
    return false
  },

  // 获取基础属性
  attr (profile) {
    let ret = {}
    let { attr } = profile

    ret.dataSource = profile.dataSource || 'miao'

    // 基础属性
    lodash.forEach('atk,def,hp'.split(','), (key) => {
      ret[key] = {
        base: attr[`${key}Base`] * 1 || 0,
        plus: attr[key] * 1 - attr[`${key}Base`] * 1 || 0,
        pct: 0
      }
    })

    lodash.forEach('mastery,recharge'.split(','), (key) => {
      ret[key] = {
        base: attr[key] * 1 || 0,
        plus: 0,
        pct: 0
      }
    })

    lodash.forEach({ cRate: 'cpct', cDmg: 'cdmg', hInc: 'heal' }, (val, key) => {
      ret[val] = {
        base: attr[key] * 1 || 0,
        plus: 0,
        pct: 0,
        inc: 0
      }
    })

    lodash.forEach('dmg,phy'.split(','), (key) => {
      ret[key] = {
        base: attr[key + 'Bonus'] * 1 || 0,
        plus: 0,
        pct: 0
      }
    })

    // 技能属性记录
    lodash.forEach('a,a2,a3,e,q'.split(','), (key) => {
      ret[key] = {
        pct: 0, // 倍率加成
        multi: 0, // 独立倍率乘区加成

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

    let char = Character.get(profile)
    ret.weapon = profile.weapon
    ret.weaponType = char.weaponType
    ret.element = eleMap[char.elem.toLowerCase()]
    ret.refine = (profile.weapon.affix * 1 - 1) || 0

    ret.multi = 0

    ret.zf = 0
    ret.rh = 0
    ret.gd = 0
    ret.ks = 0

    ret.kx = 0
    ret.fykx = 0

    return ret
  },

  // 获取天赋数据
  talent (profile, char) {
    let ret = {}

    let talentData = profile.talent || {}

    lodash.forEach(['a', 'e', 'q'], (key) => {
      let td = talentData[key] || {}
      let lv = td.level_current * 1 || 1

      let map = {}

      lodash.forEach(char.talent[key].tables, (tr) => {
        let val = tr.values[lv - 1]
        val = val.replace(/[^\x00-\xff]/g, '').trim()
        let valArr = []; let valArr2 = []
        lodash.forEach(val.split('/'), (v, idx) => {
          let valNum = 0
          lodash.forEach(v.split('+'), (v) => {
            v = v.split('*')
            let v1 = v[0].replace('%', '').trim()
            valNum += v1 * (v[1] || 1)
            valArr2.push(v1)
          })
          valArr.push(valNum)
        })

        if (isNaN(valArr[0])) {
          map[tr.name] = false
        } else if (valArr.length === 1) {
          map[tr.name] = valArr[0]
        } else {
          map[tr.name] = valArr
        }
        map[tr.name + '2'] = valArr2
      })
      ret[key] = map
    })
    return ret
  },

  getDs (attr, meta, params) {
    return {
      ...meta,
      attr,
      params,
      refine: attr.refine,
      weaponType: attr.weaponType,
      weapon: attr.weapon,
      element: eleMap[attr.element] || attr.element,
      calc (ds) {
        return (ds.base || 0) + (ds.plus || 0) + ((ds.base || 0) * (ds.pct || 0) / 100)
      }
    }
  },

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
      let ds = Calc.getDs(attr, meta, params)

      ds.currentTalent = talent

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
          buff.data[key] = Mastery.getMultiple(key, mastery)
          //  buff.data[key] = masteryNum;
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

        if (['zf', 'rh', 'kx', 'gd', 'ks', 'fykx'].includes(key)) {
          attr[key] += val * 1 || 0
        }
      })
      msg.push(title)
    })

    return {
      attr, msg
    }
  },

  async weapon (weaponName) {
    const _path = process.cwd()
    const cfgPath = `${_path}/plugins/miao-plugin/resources/meta/weapons/calc.js`

    let weapons = {}
    if (fs.existsSync(cfgPath)) {
      let fileData = await import(`file://${cfgPath}`)
      weapons = fileData.weapons || {}
    }

    let weaponCfg = weapons[weaponName] || []
    if (lodash.isPlainObject(weaponCfg)) {
      weaponCfg = [weaponCfg]
    }

    lodash.forEach(weaponCfg, (ds) => {
      if (!/：/.test(ds.title)) {
        ds.title = `${weaponName}：${ds.title}`
      }
      if (ds.refine) {
        ds.data = ds.data || {}
        lodash.forEach(ds.refine, (r, key) => {
          ds.data[key] = ({ refine }) => r[refine] * (ds.buffCount || 1)
        })
      }
    })

    return weaponCfg
  },

  async reliquaries (sets) {
    const _path = process.cwd()
    const cfgPath = `${_path}/plugins/miao-plugin/resources/meta/reliquaries/calc.js`

    let buffs = {}
    if (fs.existsSync(cfgPath)) {
      let fileData = await import(`file://${cfgPath}`)
      buffs = fileData.buffs || {}
    }

    let setMap = {}

    lodash.forEach(sets, (set) => {
      if (set && set.set) {
        let name = set.set
        setMap[name] = (setMap[name] || 0) + 1
      }
    })

    let retBuffs = []

    lodash.forEach(setMap, (count, setName) => {
      if (count >= 2 && buffs[setName + 2]) {
        retBuffs.push(buffs[setName + 2])
      }
      if (count >= 4 && buffs[setName + 4]) {
        retBuffs.push(buffs[setName + 4])
      }
    })
    return retBuffs
  },

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
      let lv = profile.lv
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
      let eleNum = 1; let eleBase = 0

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
  },

  async calcData ({ profile, char, enemyLv = 91, mode = 'profile', dmgIdx = 0 }) {
    let charCalcData = await Calc.getCharCalcRule(char.name)

    if (!charCalcData) {
      return false
    }
    let talent = Calc.talent(profile, char)

    let meta = {
      cons: profile.cons * 1,
      talent
    }

    let { buffs, details, defParams, mainAttr, defDmgIdx, enemyName } = charCalcData

    defParams = defParams || {}

    let originalAttr = Calc.attr(profile)

    let weaponBuffs = await Calc.weapon(profile.weapon.name)
    let reliBuffs = await Calc.reliquaries(profile.artis)
    buffs = lodash.concat(buffs, weaponBuffs, reliBuffs)

    lodash.forEach(buffs, (buff) => {
      buff.sort = lodash.isUndefined(buff.sort) ? 1 : buff.sort
    })

    buffs = lodash.sortBy(buffs, ['sort'])

    let { msg } = Calc.calcAttr({ originalAttr, buffs, meta, params: defParams || {} })

    let ret = []; let detailMap = []; let dmgRet = []; let dmgDetail = {}

    lodash.forEach(details, (detail, detailSysIdx) => {
      if (lodash.isFunction(detail)) {
        let { attr } = Calc.calcAttr({ originalAttr, buffs, meta })
        let ds = lodash.merge({ talent }, Calc.getDs(attr, meta))
        detail = detail({ ...ds, attr, profile })
      }
      let params = lodash.merge({}, defParams, detail.params || {})
      let { attr } = Calc.calcAttr({ originalAttr, buffs, meta, params, talent: detail.talent || '' })
      if (detail.check && !detail.check(Calc.getDs(attr, meta, params))) {
        return
      }
      if (detail.cons && meta.cons * 1 < detail.cons * 1) {
        return
      }
      let ds = lodash.merge({ talent }, Calc.getDs(attr, meta, params))

      let dmg = Calc.getDmgFn({ ds, attr, profile, enemyLv, showDetail: detail.showDetail })
      let basicDmgRet

      if (detail.dmg) {
        basicDmgRet = detail.dmg(ds, dmg)
        detail.userIdx = detailMap.length
        detailMap.push(detail)
        ret.push({
          title: detail.title,
          ...basicDmgRet
        })
      }
    })

    if (mode === 'dmg') {
      let detail
      if (dmgIdx && detailMap[dmgIdx - 1]) {
        detail = detailMap[dmgIdx - 1]
      } else if (!lodash.isUndefined(defDmgIdx) && details[defDmgIdx]) {
        detail = details[defDmgIdx]
      } else {
        detail = detailMap[0]
      }

      dmgDetail = {
        title: detail.title,
        userIdx: detail.userIdx,
        basicRet: lodash.merge({}, ret[detail.userIdx]),
        attr: []
      }

      mainAttr = mainAttr.split(',')
      let params = lodash.merge({}, defParams, detail.params || {})
      let basicDmg = dmgDetail.basicRet
      lodash.forEach(mainAttr, (reduceAttr) => {
        dmgDetail.attr.push(attrMap[reduceAttr])
        let rowData = []
        lodash.forEach(mainAttr, (incAttr) => {
          if (incAttr === reduceAttr) {
            rowData.push({ type: 'na' })
            return
          }
          let { attr } = Calc.calcAttr({
            originalAttr,
            buffs,
            meta,
            params,
            incAttr,
            reduceAttr,
            talent: detail.talent || ''
          })
          let ds = lodash.merge({ talent }, Calc.getDs(attr, meta, params))
          let dmg = Calc.getDmgFn({ ds, attr, profile, enemyLv })
          if (detail.dmg) {
            let dmgCalcRet = detail.dmg(ds, dmg)
            rowData.push({
              type: dmgCalcRet.avg === basicDmg.avg ? 'avg' : (dmgCalcRet.avg > basicDmg.avg ? 'gt' : 'lt'),
              ...dmgCalcRet
            })
          }
        })
        dmgRet.push(rowData)
      })
    }

    return {
      ret,
      msg,
      dmgRet,
      enemyName,
      dmgCfg: dmgDetail
    }
  }

}

export default Calc
