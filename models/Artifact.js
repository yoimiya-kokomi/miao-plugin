/*
* 圣遗物
* */
import Base from './Base.js'
import { ArtifactSet } from './index.js'
import ArtisMark from './artis/ArtisMark.js'
import ArtisAttr from './artis/ArtisAttr.js'
import { Meta } from '#miao'

class Artifact extends Base {

  constructor (data, game = 'gs') {
    if (!data) {
      return false
    }
    super()
    let name = data.id || data.name
    let cache = this._getCache(`arti:${game}:${name}`)
    if (cache) {
      return cache
    }
    this.game = game
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

  }

  get img () {
    return this.isGs ?
      `meta-gs/artifact/imgs/${this.setName}/${this.idx}.webp` :
      `meta-sr/artifact/${this.setName}/arti-${this.idx}.webp`
  }

  static get (name, game = 'gs') {
    if (!name) {
      return false
    }
    // 传入为artis对象
    if (name.id || name.name) {
      return Artifact.get(name.id || name.name, name.game || game)
    }
    // 兼容圣遗物ID获取
    if (game === 'gs' && /^\d{5}$/.test(name)) {
      name = name.toString()
      let artiSet = ArtifactSet.get(name)
      if (artiSet) {
        return artiSet.getArti([4, 2, 5, 1, 3][name[3] - 1])
      }
    }
    // 根据名字查询
    let data = Meta.getData(game, 'arti', name)
    if (data) {
      return new Artifact(data, game)
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

  static getArtisKeyTitle (game = 'gs') {
    return ArtisMark.getKeyTitleMap(game)
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

  // 获取圣遗物属性数据
  getAttrData (arti, idx = 1, game = 'gs') {
    return ArtisAttr.getData(arti, idx, game)
  }
}

export default Artifact
