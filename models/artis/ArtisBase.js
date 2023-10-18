/**
 * 面板圣遗物
 */
import lodash from 'lodash'
import Base from '../Base.js'
import { Artifact, ArtifactSet } from '#miao.models'
import ArtisMark from './ArtisMark.js'
import ArtisSet from './ArtisSet.js'

export default class ArtisBase extends Base {
  constructor (game = 'gs') {
    super()
    this.game = game
    this.artis = {}
  }

  // 获取圣遗物套装数据
  getSetData () {
    return ArtisSet.getSetData(this)
  }

  get sets () {
    return this.getSetData().sets || {}
  }

  get names () {
    return this.getSetData().names || []
  }

  // 有圣遗物数据
  get hasArtis () {
    return !lodash.isEmpty(this.artis)
  }

  _get (key) {
    let artis = this.artis
    switch (key) {
      case 'length':
        return lodash.keys(artis).length
    }
    if (artis[key]) {
      return artis[key]
    }
  }

  forEach (fn) {
    lodash.forEach(this.artis, (ds, idx) => {
      if (ds.name) {
        fn(ds, idx)
      }
    })
  }

  eachIdx (fn) {
    for (let idx = 1; idx <= (this.isGs ? 5 : 6); idx++) {
      this.artis[idx] = this.artis[idx] || {}
      fn(this.artis[idx], idx)
    }
  }

  setArtisData (ds = {}) {
    this.eachIdx((arti, idx) => {
      this.setArtis(idx, ds[idx] || ds[`arti${idx}`] || {})
    })
  }

  setArtis (idx = 1, ds = {}) {
    this.artis[idx] = this.artis[idx] || {}
    let arti = this.artis[idx]

    if (this.isSr) {
      let artiObj = Artifact.get(ds.id, this.game)
      if (!artiObj) {
        return false
      }
      arti.id = artiObj.id || ds.id || arti.id || ''
      arti.name = artiObj.name || arti.name || ''
      arti.set = artiObj.setName || arti.set || ''
      arti.level = ds.level || arti.level || 1
      arti.star = artiObj.getStarById(ds.id) || arti.star || 5
    } else {
      arti.name = ds.name || arti.name || ''
      arti.set =  ds.set || Artifact.getSetNameByArti(arti.name) || ''
      arti.level = ds.level || 1
      arti.star =  ds.star || 5
    }
  }

  getDetail () {
    let ret = {}
    for (let idx = 1; idx <= 5; idx++) {
      let ds = this.artis[idx]
      if (ds) {
        let artis = Artifact.get(ds.name)
        let tmp = {
          ...artis?.getData('img,name,set'),
          level: ds.level || 1
        }
        if (ds.main && ds.attrs) {
          tmp.main = ds.main || null
          tmp.attrs = []
          for (let attrIdx in ds.attrs || []) {
            if (ds.attrs[attrIdx]) {
              tmp.attrs.push(ArtisMark.formatAttr(ds.attrs[attrIdx]))
            }
          }
        }
        ret[idx] = tmp
      }
    }
    return ret
  }

  eachArtisSet (fn) {
    ArtifactSet.eachSet(this.sets, fn, this.game)
  }
}
