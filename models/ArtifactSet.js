import Base from './Base.js'
import { abbr, artiMap, artiSetMap } from '../resources/meta/artifact/index.js'
import { Artifact } from './index.js'

class ArtifactSet extends Base {
  constructor (name) {
    super()
    let cache = this._getCache(`arti-set:${name}`)
    if (cache) {
      return cache
    }
    let data = artiSetMap[name]
    if (!data) {
      return false
    }
    this.meta = data
    return this._cache()
  }

  get img () {
    let arti = Artifact.get(this.sets[1])
    return arti ? arti.img : ''
  }

  get abbr () {
    return abbr[this.name] || this.name
  }

  static getByArti (name) {
    if (artiMap[name]) {
      return ArtifactSet.get(artiMap[name].set)
    }
    return false
  }

  static get (name) {
    if (artiSetMap[name]) {
      return new ArtifactSet(name)
    }
    return false
  }

  getArtiName (idx = 1) {
    return this.sets[idx]
  }

  getArti (idx = 1) {
    return Artifact.get(this.getArtiName(idx))
  }

  static getArtiNameBySet (set, idx = 1) {
    let artiSet = ArtifactSet.get(set)
    if (artiSet) {
      return artiSet.getArti(idx)
    }
    return ''
  }
}

export default ArtifactSet
