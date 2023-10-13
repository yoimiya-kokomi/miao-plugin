/*
* 圣遗物套装
* */
import lodash from 'lodash'
import Base from './Base.js'
import { abbr, aliasMap, artiMap, artiSetMap, calc as artisBuffs } from '../resources/meta/artifact/index.js'
import { abbr as abbrSR, aliasMap as aliasMapSR, artiMap as artiMapSR, artisBuffs as artisBuffsSR, artiSetMap as artiSetMapSR } from '../resources/meta-sr/artifact/index.js'

import { Artifact } from './index.js'

class ArtifactSet extends Base {
  constructor (name, game = 'gs') {
    super()
    let cache = this._getCache(`arti-set:${game}:${name}`)
    if (cache) {
      return cache
    }
    let data = (game === 'gs' ? artiSetMap : artiSetMapSR)[name]
    if (!data) {
      if (artiSetMapSR[name]) {
        data = artiSetMapSR[name]
        game = 'sr'
      } else {
        return false
      }
    }
    this.game = game
    this.meta = data
    return this._cache()
  }

  get img () {
    let arti = Artifact.get(this.sets[1] || this.sets[5], this.game)
    return arti ? arti.img : ''
  }

  get abbr () {
    return this.game === 'gs' ? (abbr[this.name] || this.name) : (abbrSR[this.name] || this.name)
  }

  static getByArti (name) {
    if (artiMap[name]) {
      return ArtifactSet.get(artiMap[name].set)
    }
    if (artiMapSR[name]) {
      return ArtifactSet.get(artiMap[name].set, 'sr')
    }
    return false
  }

  static get (name) {
    if (artiSetMap[name]) {
      return new ArtifactSet(name, 'gs')
    }
    if (artiSetMapSR[name]) {
      return new ArtifactSet(name, 'sr')
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
    let artiBuffsMap = game === 'sr' ? artisBuffsSR : artisBuffs
    let ret = (artiBuffsMap[name] && artiBuffsMap[name][num]) || artiBuffsMap[name + num]
    if (!ret) return false
    if (lodash.isPlainObject(ret)) return [ret]
    return ret
  }

  getArtiName (idx = 1) {
    return this.sets[idx]
  }

  getArti (idx = 1) {
    return Artifact.get(this.getArtiName(idx))
  }

  static getAliasMap (game = 'gs') {
    return game === 'gs' ? aliasMap : aliasMapSR
  }
}

export default ArtifactSet
