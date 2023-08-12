import fs from 'fs'
import lodash from 'lodash'
import Base from './Base.js'
import { Character } from './index.js'
import { attrMap as attrMapGS } from '../resources/meta/artifact/index.js'
import { attrMap as attrMapSR } from '../resources/meta-sr/artifact/index.js'
import DmgBuffs from './profile/DmgBuffs.js'
import DmgAttr from './profile/DmgAttr.js'
import DmgCalc from './profile/DmgCalc.js'
import { Common, MiaoError } from '#miao'

export default class ProfileDmg extends Base {
  constructor (profile = {}, game = 'gs') {
    super()
    this.profile = profile
    this.game = game
    if (profile && profile.id) {
      let { id } = profile
      this.char = Character.get(id)
    }
  }

  static dmgRulePath (name, game = 'gs') {
    const _path = process.cwd()
    const meta = game === 'sr' ? 'meta-sr' : 'meta'
    let path = `${_path}/plugins/miao-plugin/resources/${meta}/character/${name}/calc_user.js`
    if (fs.existsSync(path)) {
      return path
    }
    path = `${_path}/plugins/miao-plugin/resources/${meta}/character/${name}/calc_auto.js`
    if (fs.existsSync(path) && Common.cfg('teamCalc')) {
      return path
    }
    path = `${_path}/plugins/miao-plugin/resources/${meta}/character/${name}/calc.js`
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
    let { isSr, isGs } = this
    lodash.forEach((isSr ? 'a,a2,e,e2,q,t' : 'a,e,q').split(','), (key) => {
      let level = lodash.isNumber(talentData[key]) ? talentData[key] : (talentData[key]?.level || 1)
      let map = {}
      if (isGs && detail.talentData) {
        lodash.forEach(detail.talentData[key], (ds, key) => {
          map[key] = ds[level - 1]
        })
      } else if (isSr && detail.talent && detail.talent[key]) {
        lodash.forEach(detail.talent[key].tables, (ds) => {
          map[ds.name] = ds.values[level - 1]
        })
      }
      ret[key] = map
    })
    return ret
  }

  trees () {
    let ret = {}
    let reg = /\d{4}(\d{3})/
    lodash.forEach(this.profile.trees, (t) => {
      let regRet = reg.exec(t)
      if (regRet && regRet[1]) {
        ret[regRet[1]] = true
      }
    })
    return ret
  }

  // 获取buff列表
  getBuffs (buffs) {
    return DmgBuffs.getBuffs(this.profile, buffs, this.game)
  }

  async getCalcRule () {
    const cfgPath = ProfileDmg.dmgRulePath(this.char?.name, this.char?.game)
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
        enemyName: cfg.enemyName || this.isGs ? '小宝' : '弱点敌人' // 敌人名称
      }
    }
    return false
  }

  async calcData ({ enemyLv = 91, mode = 'profile', dmgIdx = 0, idxIsInput = false }) {
    if (!this.char || !this.profile) {
      return false
    }
    let { profile } = this
    let { game } = this.char
    let sp = this.detail?.sp
    let charCalcData = await this.getCalcRule()

    if (!charCalcData) {
      return false
    }
    let { buffs, details, defParams, mainAttr, defDmgIdx, defDmgKey, enemyName } = charCalcData

    let talent = this.talent()

    let meta = {
      cons: profile.cons * 1,
      talent,
      trees: this.trees()
    }

    let { id, weapon, attr } = profile

    defParams = defParams || {}

    let originalAttr = DmgAttr.getAttr({ id, weapon, attr, char: this.char, game, sp })

    buffs = this.getBuffs(buffs)

    let { msg } = DmgAttr.calcAttr({ originalAttr, buffs, meta, params: defParams || {} })
    let msgList = []

    let ret = []
    let detailMap = []
    let dmgRet = []
    let dmgDetail = {}

    // 用户手动输入伤害序号
    if (idxIsInput) {
      // 从1开始，所以需要 - 1
      dmgIdx = --dmgIdx < 0 ? 0 : dmgIdx
    }

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
      let params = lodash.merge({}, defParams, detail?.params || {})
      let { attr, msg } = DmgAttr.calcAttr({ originalAttr, buffs, meta, params, talent: detail.talent || '' })
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

      let dmg = DmgCalc.getDmgFn({ ds, attr, level: profile.level, enemyLv, showDetail: detail.showDetail, game })
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
      msgList.push(msg)
    })

    if (mode === 'dmg') {
      let detail
      if (idxIsInput && detailMap[dmgIdx]) {
        detail = detailMap[dmgIdx]
      } else if (idxIsInput) {
        // 当用户输入的下标错误时，提示错误
        throw new MiaoError(`序号输入错误：${this.char.name}最多只支持${detailMap.length}种伤害计算哦`)
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

      let attrMap = game === 'gs' ? attrMapGS : attrMapSR

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
            talent: detail.talent || '',
            game
          })
          let ds = lodash.merge({ talent }, DmgAttr.getDs(attr, meta, params))
          let dmg = DmgCalc.getDmgFn({ ds, attr, level: profile.level, enemyLv, game })
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
      // 根据当前计算的伤害，显示对应的buff列表
      msg: msgList[idxIsInput ? dmgIdx : (defDmgIdx > -1 ? defDmgIdx : dmgIdx)] || msg,
      msgList,
      dmgRet,
      enemyName,
      dmgCfg: dmgDetail,
      enemyLv
    }
  }
}
