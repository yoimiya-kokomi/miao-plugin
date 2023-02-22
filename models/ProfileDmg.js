import fs from 'fs'
import lodash from 'lodash'
import Base from './Base.js'
import { Character } from './index.js'
import { attrMap } from '../resources/meta/artifact/index.js'
import DmgBuffs from './profile/DmgBuffs.js'
import DmgAttr from './profile/DmgAttr.js'
import DmgCalc from './profile/DmgCalc.js'
import { Common } from '../components/index.js'

export default class ProfileDmg extends Base {
  constructor (profile = {}) {
    super()
    this.profile = profile
    if (profile && profile.id) {
      let { id } = profile
      this.char = Character.get(id)
    }
  }

  static dmgRulePath (name) {
    const _path = process.cwd()
    let path = `${_path}/plugins/miao-plugin/resources/meta/character/${name}/calc_auto.js`
    if (fs.existsSync(path) && Common.cfg('teamCalc')) {
      return path
    }
    path = `${_path}/plugins/miao-plugin/resources/meta/character/${name}/calc.js`
    if (fs.existsSync(path)) {
      return path
    }
    return false
  }

  // 获取天赋数据
  talent () {
    let char = this.char
    let profile = this.profile
    let ret = {}
    let talentData = profile.talent || {}
    let detail = char.detail
    lodash.forEach(['a', 'e', 'q'], (key) => {
      let level = lodash.isNumber(talentData[key]) ? talentData[key] : (talentData[key]?.level || 1)
      let map = {}
      if (detail.talentData) {
        lodash.forEach(char.detail.talentData[key], (ds, key) => {
          map[key] = ds[level - 1]
        })
      } else {
        lodash.forEach(char.detail.talent[key].tables, (tr) => {
          let val = tr.values[level - 1]
          // eslint-disable-next-line no-control-regex
          val = val.replace(/[^\x00-\xff]/g, '').trim()
          val = val.replace(/[a-zA-Z]/g, '').trim()
          let valArr = []
          let valArr2 = []
          lodash.forEach(val.split('/'), (v, idx) => {
            let valNum = 0
            lodash.forEach(v.split('+'), (v) => {
              v = v.split('*')
              let v1 = v[0].replace('%', '').trim()
              valNum += v1 * (v[1] || 1)
              valArr2.push(v1 * 1)
            })
            valArr.push(valNum)
          })

          let name = tr.name2 || tr.name
          if (isNaN(valArr[0])) {
            map[name] = false
          } else if (valArr.length === 1) {
            map[name] = valArr[0]
          } else {
            map[name] = valArr
          }
          map[name + '2'] = valArr2
        })
      }
      ret[key] = map
    })
    return ret
  }

  // 获取buff列表
  getBuffs (buffs) {
    return DmgBuffs.getBuffs(this.profile, buffs)
  }

  async getCalcRule () {
    const cfgPath = ProfileDmg.dmgRulePath(this.char?.name)
    let cfg = {}
    if (cfgPath) {
      cfg = await import(`file://${cfgPath}`)
      return {
        details: cfg.details || false, // 计算详情
        buffs: cfg.buffs || [], // 角色buff
        defParams: cfg.defParams || {}, // 默认参数，一般为空
        defDmgIdx: cfg.defDmgIdx || -1, // 默认详情index
        defDmgKey: cfg.defDmgKey || '',
        mainAttr: cfg.mainAttr || 'atk,cpct,cdmg', // 伤害属性
        enemyName: cfg.enemyName || '小宝' // 敌人名称
      }
    }
    return false
  }

  async calcData ({ enemyLv = 91, mode = 'profile', dmgIdx = 0 }) {
    if (!this.char || !this.profile) {
      return false
    }
    let { profile } = this
    let charCalcData = await this.getCalcRule()

    if (!charCalcData) {
      return false
    }
    let { buffs, details, defParams, mainAttr, defDmgIdx, defDmgKey, enemyName } = charCalcData

    let talent = this.talent()

    let meta = {
      cons: profile.cons * 1,
      talent
    }
    let { id, weapon, attr } = profile

    defParams = defParams || {}

    let originalAttr = DmgAttr.getAttr({ id, weapon, attr, char: this.char })

    buffs = this.getBuffs(buffs)

    let { msg } = DmgAttr.calcAttr({ originalAttr, buffs, meta, params: defParams || {} })

    let ret = []
    let detailMap = []
    let dmgRet = []
    let dmgDetail = {}

    if (mode === 'single') {
      dmgIdx = defDmgIdx > -1 ? defDmgIdx : 0
    }

    lodash.forEach(details, (detail, detailSysIdx) => {
      if (mode === 'single') {
        if (defDmgKey) {
          if (detail.dmgKey !== defDmgKey) {
            return true
          }
        } else if (detailSysIdx !== dmgIdx) {
          return true
        }
      }

      if (lodash.isFunction(detail)) {
        let { attr } = DmgAttr.calcAttr({ originalAttr, buffs, meta })
        let ds = lodash.merge({ talent }, DmgAttr.getDs(attr, meta))
        detail = detail({ ...ds, attr, profile })
      }
      let params = lodash.merge({}, defParams, detail.params || {})
      let { attr } = DmgAttr.calcAttr({ originalAttr, buffs, meta, params, talent: detail.talent || '' })
      if (detail.isStatic) {
        return
      }
      if (detail.check && !detail.check(DmgAttr.getDs(attr, meta, params))) {
        return
      }
      if (detail.cons && meta.cons < detail.cons * 1) {
        return
      }
      let ds = lodash.merge({ talent }, DmgAttr.getDs(attr, meta, params))

      let dmg = DmgCalc.getDmgFn({ ds, attr, level: profile.level, enemyLv, showDetail: detail.showDetail })
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

      if (lodash.isFunction(detail)) {
        let { attr } = DmgAttr.calcAttr({ originalAttr, buffs, meta })
        let ds = lodash.merge({ talent }, DmgAttr.getDs(attr, meta))
        detail = detail({ ...ds, attr, profile })
      }
      dmgDetail = {
        title: detail.title,
        userIdx: detail.userIdx || defDmgIdx,
        basicRet: lodash.merge({}, ret[detail.userIdx] || ret[defDmgIdx]),
        attr: []
      }

      // 计算角色属性增减
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
          let { attr } = DmgAttr.calcAttr({
            originalAttr,
            buffs,
            meta,
            params,
            incAttr,
            reduceAttr,
            talent: detail.talent || ''
          })
          let ds = lodash.merge({ talent }, DmgAttr.getDs(attr, meta, params))
          let dmg = DmgCalc.getDmgFn({ ds, attr, level: profile.level, enemyLv })
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

    if (mode === 'single') {
      return ret[0]
    }
    return {
      ret,
      msg,
      dmgRet,
      enemyName,
      dmgCfg: dmgDetail,
      enemyLv
    }
  }
}
