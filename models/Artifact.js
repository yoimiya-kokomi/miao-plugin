/*
* 圣遗物
* */
import Base from './Base.js'
import { Format } from '../components/index.js'
import { ArtifactSet } from './index.js'
import { artiMap, attrMap, mainIdMap, attrIdMap } from '../resources/meta/artifact/index.js'
import lodash from 'lodash'

class Artifact extends Base {
  static getAttrs

  constructor (name) {
    super()
    let cache = this._getCache(`arti:${name}`)
    if (cache) {
      return cache
    }
    let data = artiMap[name]
    if (!data) {
      return false
    }
    this.name = name
    this.meta = data
    return this._cache()
  }

  get artiSet () {
    return ArtifactSet.get(this.set)
  }

  get setName () {
    return this.set
  }

  get img () {
    return `meta/artifact/imgs/${this.setName}/${this.idx}.webp`
  }

  static get (name) {
    if (artiMap[name]) {
      return new Artifact(name)
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
    let starEff = { 1: 0.21, 2: 0.36, 3: 0.6, 4: 0.8, 5: 1 }
    lodash.forEach(ids, (id) => {
      let cfg = attrIdMap[id]
      if (!cfg) {
        return true
      }
      let { key, eff } = cfg
      if (!tmp[key]) {
        tmp[key] = {
          key,
          eff: 0,
          upNum: 0
        }
        ret.push(tmp[key])
      }
      tmp[key].eff += eff
      tmp[key].upNum++
    })
    lodash.forEach(tmp, (ds, key) => {
      if (attrMap[key]) {
        ds.value = attrMap[key].value * ds.eff * starEff[star]
      }
    })
    return ret
  }
}

export default Artifact
