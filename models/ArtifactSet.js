/*
* 圣遗物套装
* */
import lodash from 'lodash'
import Base from './Base.js'
import { Meta } from '#miao'

import { Artifact } from './index.js'

class ArtifactSet extends Base {
  constructor (data, game = 'gs') {
    super()
    if (!data) {
      return false
    }
    let name = data.name
    let cache = this._getCache(`arti-set:${game}:${name}`)
    if (cache) {
      return cache
    }
    this.game = game
    this.meta = data
    return this._cache()
  }

  get img () {
    let arti = Artifact.get(this.idxs[1] || this.idxs[5], this.game)
    return arti ? arti.img : ''
  }

  static getByArti (name) {
    let arti = Artifact.get(name)
    if (arti && arti.set) {
      return ArtifactSet.get(arti.set)
    }
    return false
  }

  static get (name, game = 'gs') {
    if (game === 'gs' && /^\d{5}$/.test(name)) {
      name = name.toString().slice(0, 2)
    }
    let data = Meta.matchGame(game, 'artiSet', name)
    if (data) {
      return new ArtifactSet(data.data, data.game)
    }
    return false
  }

  static getArtiNameBySet (set, idx = 1) {
    let artiSet = ArtifactSet.get(set)
    if (artiSet) {
      return artiSet.getArtiName(idx)
    }
    return ''
  }

  static getArtisSetBuff (name, num, game = 'gs') {
    let { artiBuffs } = Meta.getMeta(game, 'arti')
    let ret = (artiBuffs[name] && artiBuffs[name][num]) || artiBuffs[name + num]
    if (!ret) return false
    if (lodash.isPlainObject(ret)) return [ret]
    return ret
  }

  // 循环圣遗物套装
  static eachSet (idxs, fn, game = 'gs') {
    lodash.forEach(idxs || [], (v, k) => {
      let artisSet = ArtifactSet.get(k, game)
      if (artisSet) {
        if (v >= 4) {
          fn(artisSet, 2)
        }
        fn(artisSet, v)
      }
    })
  }

  getArtiName (idx = 1) {
    return this.idxs[idx]
  }

  getArti (idx = 1) {
    return Artifact.get(this.getArtiName(idx), this.game)
  }
}

export default ArtifactSet
