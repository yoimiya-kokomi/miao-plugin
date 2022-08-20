import Base from './Base.js'
import { Character } from './index.js'
import lodash from 'lodash'
import { attrMap } from './profile-lib/calc-meta.js'
import Calc from './profile-lib/Calc.js'

export default class ProfileDmg extends Base {
  constructor (profile = false) {
    super()
    this.profile = profile
    if (profile && profile.id) {
      let { id } = profile
      this.char = Character.get(id)
    }
  }

  async calcData ({ enemyLv = 91, mode = 'profile', dmgIdx = 0 }) {
    if (!this.char || !this.profile) {
      return false
    }
    let { profile, char } = this
    let charCalcData = await Calc.getCharCalcRule(this.char.name)

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
    let reliBuffs = await Calc.reliquaries(profile.artis?.artis || {})
    buffs = lodash.concat(buffs, weaponBuffs, reliBuffs)
    let mKey = {
      zf: '蒸发',
      rh: '融化',
      ks: '扩散'
    }
    lodash.forEach(buffs, (buff, idx) => {
      if (lodash.isString(buff) && mKey[buff]) {
        buff = {
          title: `元素精通：${mKey[buff]}伤害提高[${buff}]%`,
          mastery: buff
        }
        buffs[idx] = buff
      }
      buff.sort = lodash.isUndefined(buff.sort) ? 1 : buff.sort
    })

    buffs = lodash.sortBy(buffs, ['sort'])

    let { msg } = Calc.calcAttr({ originalAttr, buffs, meta, params: defParams || {} })

    let ret = []
    let detailMap = []
    let dmgRet = []
    let dmgDetail = {}

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
      if (detail.cons && meta.cons < detail.cons * 1) {
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
