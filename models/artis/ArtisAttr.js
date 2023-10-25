import { Format, Meta } from '#miao'
import lodash from 'lodash'

let AttrGS = {
  getMain (id, level, star) {
    const { mainIdMap, attrMap } = Meta.getMeta('gs', 'arti')
    let key = mainIdMap[id]
    if (!key) {
      return false
    }
    let attrCfg = attrMap[Format.isElem(key) ? 'dmg' : key]
    let posEff = ['hpPlus', 'atkPlus', 'defPlus'].includes(key) ? 2 : 1
    let starEff = { 1: 0.21, 2: 0.36, 3: 0.6, 4: 0.9, 5: 1 }
    return {
      id,
      key,
      value: attrCfg.value * (1.2 + 0.34 * level) * posEff * (starEff[star || 5])
    }
  },

  getAttr (ids, star = 5) {
    let ret = []
    let tmp = {}
    const { attrIdMap, attrMap } = Meta.getMeta('gs', 'arti')
    lodash.forEach(ids, (id) => {
      let cfg = attrIdMap[id]
      if (!cfg) {
        return true
      }
      let { key, value } = cfg
      if (!tmp[key]) {
        tmp[key] = {
          key,
          upNum: 0,
          eff: 0,
          value: 0
        }
        ret.push(tmp[key])
      }
      tmp[key].value += value * (attrMap[key].format === 'pct' ? 100 : 1)
      tmp[key].upNum++
      tmp[key].eff += value / attrMap[key].value * (attrMap[key].format === 'pct' ? 100 : 1)
    })
    return ret
  },

  getData (mainId, attrIds, level, star) {
    return {
      main: AttrGS.getMain(mainId, level, star),
      attrs: AttrGS.getAttr(attrIds, star)
    }
  }

}

let AttrSR = {
  getData (mainId, attrIds, level, star, idx = 1) {
    const { metaData } = Meta.getMeta('sr', 'arti')
    let mainKey = metaData.mainIdx[idx][mainId]
    let starCfg = metaData.starData[star]
    let mainCfg = starCfg.main[mainKey]
    if (!mainId || !mainCfg) {
      return false
    }
    let main = {
      id: mainId,
      key: mainKey,
      value: mainCfg.base + mainCfg.step * level
    }
    let attrs = []
    lodash.forEach(attrIds, (ds) => {
      let _ds = ds
      if (lodash.isString(ds)) {
        let [id, count, step] = ds.split(',')
        ds = { id, count, step }
      }
      let attrCfg = starCfg.sub[ds.id]
      if (!attrCfg) {
        console.log('not found attr', ds, _ds)
        return true
      }
      let value = attrCfg?.base * ds.count + attrCfg.step * ds.step
      attrs.push({
        ...ds,
        key: attrCfg?.key,
        upNum: ds.count,
        eff: value / (attrCfg.base + attrCfg.step * 2),
        value
      })
    })
    return {
      main,
      attrs
    }
  }
}
export default {
  getData (arti, idx = 1, game = 'gs') {
    let tmp = game === 'gs' ? AttrGS : AttrSR
    return tmp.getData(arti.mainId, arti.attrIds, arti.level, arti.star, idx)
  },

  hasAttr (arti) {
    if (arti.isSr) {
      return true
    }
    let ret = true
    arti.forEach((ds) => {
      if (ds.name) {
        return !!(ds.mainId && ds.attrIds)
      }
    })
    return ret
  }
}
