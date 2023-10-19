/*
* 圣遗物
* */
import Base from './Base.js'
import { ArtifactSet } from './index.js'
import { artiMap, attrMap } from '../resources/meta/artifact/index.js'
import { idMap as idMapSR, artiMap as artiMapSR, abbr as abbrSR } from '../resources/meta-sr/artifact/index.js'
import ArtisMark from './artis/ArtisMark.js'
import ArtisAttr from './artis/ArtisAttr.js'

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

    // 传入为artis对象
    if (name.id || name.name) {
      return Artifact.get(name.id || name.name, name.game || game)
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

  getStarById (id) {
    return this.meta.ids[id] || ''
  }

  getIdByStar (star = 5) {
    let ids = this.meta.ids || {}
    for (let key in ids) {
      if (ids[key] * 1 === star) {
        return key
      }
    }
  }

  static getArtisKeyTitle (game = 'gs') {
    return ArtisMark.getKeyTitleMap(game)
  }

  // 获取圣遗物属性数据
  getAttrData (arti, idx = 1, game = 'gs') {
    return ArtisAttr.getData(arti, idx, game)
  }
}

export default Artifact
