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

  static getMainById (id, level = 20, star) {
    let cfg = mainIdMap[id]
    if (!cfg) {
      return false
    }
    let attrCfg = attrMap[Format.isElem(cfg.key) ? 'dmg' : cfg.key]
    let eff = ['hpPlus', 'atkPlus', 'defPlus'].includes(cfg.key) ? 2 : 1
    return {
      key: cfg.key,
      value: attrCfg.value * (1.2 + 0.34 * level) * eff
    }
  }

  static getAttrsByIds (ids) {
    let ret = []
    let tmp = {}
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
        ds.value = attrMap[key].value * ds.eff
      }
    })
    return ret
  }
}

export default Artifact
