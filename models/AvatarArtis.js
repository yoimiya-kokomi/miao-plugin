/**
 * 面板圣遗物
 */
import lodash from 'lodash'
import Base from './Base.js'
import { Artifact, ArtifactSet } from './index.js'
import { Format, Data } from '../components/index.js'
import ArtisMark from './profile-lib/ArtisMark.js'

export default class AvatarArtis extends Base {
  constructor (charid = 0) {
    super()
    this.charid = charid
    this.artis = {}
  }

  static isProfileArtis (ds) {
    let ret = true
    for (let idx = 1; idx <= 5; idx++) {
      if (ds[idx]) {
        if (!ds[idx].main || !ds[idx].attrs) {
          ret = false
          return ret
        }
      }
    }
    return ret
  }

  setArtisData (ds = {}, source) {
    if (!this.hasArtis || AvatarArtis.isProfileArtis(ds) || !AvatarArtis.isProfileArtis(this.artis)) {
      for (let idx = 1; idx <= 5; idx++) {
        if (ds[idx]) {
          this.setArtis(idx, ds[idx] || ds[`arti${idx}`] || {})
        }
      }
      return true
    }
    return false
  }

  setArtis (idx = 1, ds = {}) {
    idx = idx.toString().replace('arti', '')
    let ret = {}
    ret.name = ds.name || ArtifactSet.getArtiNameBySet(ds.set, idx) || ''
    ret.set = ds.set || Artifact.getSetNameByArti(ret.name) || ''
    ret.level = ds.level || 1
    if (ds.main && ds.attrs) {
      ret.main = ArtisMark.formatAttr(ds.main || {})
      ret.attrs = []
      for (let attrIdx in ds.attrs || []) {
        if (ds.attrs[attrIdx]) {
          ret.attrs.push(ArtisMark.formatAttr(ds.attrs[attrIdx]))
        }
      }
    }
    this.artis[idx] = ret
  }

  forEach (fn) {
    lodash.forEach(this.artis, (ds, idx) => {
      if (ds.name) {
        fn(ds, idx)
      }
    })
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

  toJSON () {
    let ret = {}
    for (let idx = 1; idx <= 5; idx++) {
      let ds = this.artis[idx]
      if (ds) {
        let tmp = {
          name: ds.name || '',
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

  get sets () {
    return this.getSetData().sets || {}
  }

  get names () {
    return this.getSetData().names || []
  }

  get hasArtis () {
    return !lodash.isEmpty(this.artis)
  }

  mainAttr (idx = '') {
    if (!idx) {
      let ret = {}
      for (let i = 1; i <= 5; i++) {
        ret[i] = this.mainAttr(i)
      }
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

  isAttr (attr, pos = '3,4,5') {
    let mainAttr = this.mainAttr()
    let check = true
    Data.eachStr(pos.toString(), (p) => {
      let attrs = attr.split(',')
      if (!attrs.includes(mainAttr[p]) && (p === '4' && !attrs.includes('dmg') && Format.isElem(mainAttr[p]))) {
        check = false
        return false
      }
    })
    return check
  }

  // 获取圣遗物数据
  getArtisData () {
    let ret = {}
    this.forEach((ds, idx) => {
      let arti = Artifact.get(ds.name)
      ret[idx] = {
        ...ds,
        name: arti.name,
        img: arti.img
      }
    })
    return ret
  }

  /**
   * 获取圣遗物套装数据
   * @returns {*|{imgs: *[], names: *[], sets: {}, abbrs: *[], sName: string, name: (string|*)}}
   * sets: 套装名:2/4
   * names: [套装名]
   * imgs: [img]
   * abbrs：[别名]
   * name: '组合名字'， 若为4件套会使用套装完整名
   * sName: '简写名字'，若为4件套也会使用简写
   */
  getSetData () {
    let setCount = {}
    this.forEach((arti, idx) => {
      setCount[arti.set] = (setCount[arti.set] || 0) + 1
    })
    let sets = {}
    let names = []
    let imgs = []
    let abbrs = []
    let abbrs2 = []
    for (let set in setCount) {
      if (setCount[set] >= 2) {
        let count = setCount[set] >= 4 ? 4 : 2
        sets[set] = count
        let artiSet = ArtifactSet.get(set)
        names.push(artiSet.name)
        imgs.push(artiSet.img)
        abbrs.push(artiSet.abbr + count)
        abbrs2.push(artiSet.name + count)
      }
    }
    return {
      sets,
      names,
      imgs,
      abbrs: [...abbrs, ...abbrs2],
      name: (abbrs.length > 1 || abbrs2[0]?.length > 7) ? abbrs.join('+') : abbrs2[0],
      sName: abbrs.join('+')
    }
  }

  static _eachArtisSet (sets, fn) {
    lodash.forEach(sets || [], (v, k) => {
      let artisSet = ArtifactSet.get(k)
      if (artisSet) {
        if (v >= 4) {
          fn(artisSet, 2)
        }
        fn(artisSet, v)
      }
    })
  }

  eachArtisSet (fn) {
    AvatarArtis._eachArtisSet(this.sets, fn)
  }

  static getArtisKeyTitle () {
    return ArtisMark.getKeyTitleMap()
  }
}
