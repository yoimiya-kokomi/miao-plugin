/*
* 圣遗物
* */
import Base from './Base.js'
import { Format } from '#miao'
import { ArtifactSet } from './index.js'
import { artiMap, attrMap, mainIdMap, attrIdMap } from '../resources/meta/artifact/index.js'
import { idMap as idMapSR, artiMap as artiMapSR, metaData as metaDataSR, abbr as abbrSR } from '../resources/meta-sr/artifact/index.js'
import lodash from 'lodash'

class Artifact extends Base {
  static getAttrs

  constructor (name, game = 'gs') {
    super()
    let cache = this._getCache(`arti:${game}:${name}`)
    if (cache) {
      return cache
    }
    this.game = game
    let data = (this.isGs ? artiMap : artiMapSR)[name]
    if (!data) {
      return false
    }
    this.id = data.id || ''
    this.name = data.name
    this.meta = data
    return this._cache()
  }

  get artiSet () {
    return ArtifactSet.get(this.set, this.game)
  }

  get setName () {
    return this.set
  }

  get abbr () {
    return (abbrSR && abbrSR[this.name]) || this.name
  }

  get img () {
    return this.isGs ? `meta/artifact/imgs/${this.setName}/${this.idx}.webp` : `meta-sr/artifact/${this.setName}/arti-${this.idx}.webp`
  }

  static get (name, game = 'gs') {
    if (!name) {
      return false
    }
    if (game === 'sr') {
      name = idMapSR[name]?.name || name
    }
    if ((game === 'gs' ? artiMap : artiMapSR)[name]) {
      return new Artifact(name, game)
    }
    return false
  }

  static getSetNameByArti (name) {
    let arti = Artifact.get(name)
    if (arti) {
      return arti.setName
    }
    return ''
  }

  static getMeta () {
    return {
      attrMap
    }
  }

  static getMainById (id, level = 20, star = 5) {
    let key = mainIdMap[id]
    if (!key) {
      return false
    }
    let attrCfg = attrMap[Format.isElem(key) ? 'dmg' : key]
    let posEff = ['hpPlus', 'atkPlus', 'defPlus'].includes(key) ? 2 : 1
    let starEff = { 1: 0.21, 2: 0.36, 3: 0.6, 4: 0.9, 5: 1 }
    return {
      key,
      value: attrCfg.value * (1.2 + 0.34 * level) * posEff * (starEff[star || 5])
    }
  }

  static getAttrsByIds (ids, star = 5) {
    let ret = []
    let tmp = {}
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
  }

  getStarById (id) {
    return this.meta.ids[id] || ''
  }

  getAttrData (mainId, attrData, level = 1, star = 5, idx = 1) {
    let mainKey = metaDataSR.mainIdx[idx][mainId]
    let starCfg = metaDataSR.starData[star]
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
    lodash.forEach(attrData, (ds) => {
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

export default Artifact
