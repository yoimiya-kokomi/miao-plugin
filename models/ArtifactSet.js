/*
* 圣遗物套装
* */
import lodash from 'lodash'
import Base from './Base.js'
import { Meta } from '#miao'
import { abbr, aliasMap, artiMap, artiSetMap, calc as artisBuffs } from '../resources/meta/artifact/index.js'
import {
  abbr as abbrSR,
  aliasMap as aliasMapSR,
  artiMap as artiMapSR,
  artisBuffs as artisBuffsSR,
  artiSetMap as artiSetMapSR
} from '../resources/meta-sr/artifact/index.js'

import { Artifact } from './index.js'

class ArtifactSet extends Base {
  constructor (data, game = 'gs') {
    super()
    if(!data){
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

  static get (name, game = 'gs') {
    let data = Meta.matchGame(game, 'artiSet', name)
    if (data) {
      return new ArtifactSet(data.data, data.game)
    }
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

  static getAliasMap (game = 'gs') {
    return game === 'gs' ? aliasMap : aliasMapSR
  }

  // 循环圣遗物套装
  static eachSet (sets, fn, game = 'gs') {
    lodash.forEach(sets || [], (v, k) => {
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
    return this.sets[idx]
  }

  getArti (idx = 1) {
    return Artifact.get(this.getArtiName(idx), this.game)
  }
}

export default ArtifactSet
