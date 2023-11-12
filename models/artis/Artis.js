/**
 * 面板圣遗物
 */
import lodash from 'lodash'
import { Artifact, ArtifactSet } from '#miao.models'
import { Data, Format } from '#miao'
import Base from '../Base.js'
import ArtisAttr from './ArtisAttr.js'
import ArtisSet from './ArtisSet.js'
import ArtisMark from './ArtisMark.js'

export default class Artis extends Base {
  constructor (game = 'gs', isProfile = false) {
    super()
    this.game = game
    this.artis = {}
    this.isProfile = !!isProfile
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
        return fn(ds, idx)
      }
    })
  }

  eachIdx (fn) {
    for (let idx = 1; idx <= (this.isGs ? 5 : 6); idx++) {
      this.artis[idx] = this.artis[idx] || {}
      let ret = fn(this.artis[idx], idx)
      if (ret === false) {
        break
      }
    }
  }

  setArtisData (ds = {}) {
    this.eachIdx((arti, idx) => {
      this.setArtis(idx, ds[idx] || ds[`arti${idx}`] || {})
    })
  }

  getDetail () {
    let ret = {}
    for (let idx = 1; idx <= 5; idx++) {
      let ds = this.artis[idx]
      if (ds && (ds.name || ds.id)) {
        let artis = Artifact.get(ds)
        if (!artis) {
          continue
        }
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

  // 有圣遗物词条
  get hasAttr () {
    return ArtisAttr.hasAttr(this)
  }

  setArtisBase (idx = 1, ds = {}) {
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
      arti.set = ds.set || Artifact.getSetNameByArti(arti.name) || ''
      arti.level = ds.level || 1
      arti.star = ds.star || 5
    }
  }

  setArtis (idx = 1, ds = {}) {
    idx = idx.toString().replace('arti', '') * 1 || 1
    this.setArtisBase(idx, ds)
    if (!this.isProfile) {
      return
    }
    let arti = this.artis[idx]
    if (!ds.attrIds || !ds.mainId) {
      return false
    }
    arti.mainId = ds.mainId
    arti.attrIds = ds.attrIds
    let artiObj = Artifact.get(arti.id || arti.name, this.game)
    if (!artiObj) {
      return false
    }
    let attr = artiObj.getAttrData(arti, idx, this.game)
    if (!attr) {
      console.log('attr id error', ds.main, ds.mainId, idx, arti.level, arti.star)
      return false
    }
    arti.main = attr.main
    arti.attrs = attr.attrs
  }

  // 获取保存数据
  toJSON () {
    let ret = {}
    this.eachIdx((ds, idx) => {
      let key = this.isGs ? 'name' : 'id'
      let tmp = {
        level: ds.level || 1
      }
      if (!ds[key]) {
        return true
      }
      tmp[key] = ds[key]
      if (this.isGs) {
        tmp.star = ds.star || 5
      }
      // 如果不为面板数据，则不保存mainId和attrIds
      if (!this.isProfile) {
        ret[idx] = tmp
        return true
      }
      if (!ds.mainId || !ds.attrIds) {
        return true
      }
      ret[idx] = tmp
      tmp.mainId = ds.mainId || ds.main?.id
      if (this.isSr) {
        tmp.attrIds = []
        lodash.forEach(ds.attrs, (as) => {
          tmp.attrIds.push([as?.id || '', as?.count || 1, as?.step || 0].join(','))
        })
      } else {
        tmp.attrIds = ds.attrIds
      }
    })
    return ret
  }

  // 获取指定idx的主词条
  getMainAttr (idx = '') {
    if (!idx) {
      let ret = {}
      this.eachIdx((arti, idx) => {
        ret[idx] = this.getMainAttr(idx)
      })
      return ret
    }
    let main = this.artis[idx]?.main
    if (!main) {
      return ''
    }
    return main.key || ''
  }

  is (check, pos = '') {
    if (pos) {
      return this.isAttr(check, pos)
    }
    let sets = this.getSetData()?.abbrs || []
    let ret = false
    Data.eachStr(check, (s) => {
      if (sets.includes(s)) {
        ret = true
        return false
      }
    })
    return ret
  }

  isAttr (attr, pos = '') {
    let mainAttr = this.getMainAttr()
    let check = true
    pos = pos || (this.isGs ? '3,4,5' : '3,4,5,6')
    let dmgIdx = this.isGs ? 4 : 5
    let attrs = attr.split(',')
    Data.eachStr(pos.toString(), (p) => {
      let posAttr = mainAttr[p]
      if (!attrs.includes(posAttr)) {
        if (p === dmgIdx && attrs.includes('dmg') && Format.isElem(posAttr)) {
          return true
        }
        /* if (/Plus$/.test(posAttr) && attrs.includes(posAttr.replace('Pct', ''))) {
          return true
        } */
        return check = false
      }
    })
    return check
  }

  isSameArtis (target) {
    let k = (ds) => [ds?.name || '', ds?.level || '', ds?.star || ''].join('|')
    let ret = true
    this.eachIdx((ds, idx) => {
      if (k(ds) !== k(target[idx])) {
        return ret = false
      }
    })
    return ret
  }

  getAllAttr () {
    let ret = {}
    let add = (ds) => {
      if (!ds) {
        return
      }
      let key = ds.key
      if (!ret[key]) {
        ret[key] = {
          key,
          value: 0,
          upNum: 0,
          eff: 0
        }
      }
      let tmp = ret[key]
      tmp.value += ds.value
      if (ds.eff && ds.upNum) {
        tmp.eff += ds.eff
        tmp.upNum += ds.upNum
      }
    }
    this.forEach((arti) => {
      // add(arti.main)
      lodash.forEach(arti.attrs, (attr) => {
        add(attr)
      })
    })
    ret = lodash.sortBy(lodash.values(ret), ['eff']).reverse()
    return ArtisMark.formatArti(ret, false, false, this.game)
  }
}
