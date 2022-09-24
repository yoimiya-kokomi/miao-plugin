import Base from './Base.js'
import { ArtifactSet } from './index.js'
import { abbr, artiMap, attrMap } from '../resources/meta/artifact/index.js'

class Artifact extends Base {
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

  static get (name) {
    if (artiMap[name]) {
      return new Artifact(name)
    }
    return false
  }

  get img () {
    return `meta/artifact/${this.setName}/${this.idx}.webp`
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
}

// 根据圣遗物名称获取套装
// getSetByArti

// 获取指定圣遗物套装指定位置的名字
// getArtiBySet

// getAbbrBySet
// getMeta
export default Artifact
