/**
 * 面板圣遗物
 */
import lodash from 'lodash'
import Base from './Base.js'
import { Artifact, ArtifactSet } from './index.js'
import { Format, Data } from '#miao'
import ArtisMark from './profile/ArtisMark.js'

export default class AvatarArtis extends Base {
  constructor (charid = 0, game = 'gs') {
    super()
    this.game = game
    this.charid = charid
    this.artis = {}
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

  get hasAttr () {
    if (this.isSr) {
      return true
    }
    return ArtisMark.hasAttr(this.artis)
  }

  static _eachArtisSet (sets, fn, game = 'gs') {
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

  static getArtisKeyTitle (game = 'gs') {
    return ArtisMark.getKeyTitleMap(game)
  }

  setArtisData (ds = {}, isProfile = false) {
    if (!isProfile || (isProfile && ArtisMark.hasAttr(ds))) {
      for (let idx = 1; idx <= (this.isGs ? 5 : 6); idx++) {
        if (ds[idx] || ds[`arti${idx}`]) {
          this.setArtis(idx, ds[idx] || ds[`arti${idx}`], isProfile)
        }
      }
    }
  }

  setArtis (idx = 1, ds = {}, isProfile = false) {
    idx = idx.toString().replace('arti', '')
    this.artis[idx] = this.artis[idx] || {}
    let arti = this.artis[idx]
    let artiObj
    if (this.isSr) {
      artiObj = Artifact.get(ds.id, this.game)
      if (!artiObj) {
        return false
      }
      arti.id = artiObj.id || ds.id || arti.id || ''
      arti.name = artiObj.name || arti.name || ''
      arti.set = artiObj.setName || arti.set || ''
      arti.level = ds.level || arti.level || 1
      arti.star = artiObj.getStarById(ds.id) || arti.star || 5

      if (ds.mainId && ds.attrs) {
        let attr = artiObj.getAttrData(ds.mainId, ds.attrs, arti.level, arti.star, idx)
        if (attr) {
          arti.mainId = ds.mainId
          arti.main = attr.main || arti.main || {}
          arti.attrs = attr.attrs || arti.attrs || {}
        } else {
          console.log('attr id error', ds.main, ds.mainId, idx, arti.level, arti.star)
        }
      }
      return
    } else {
      if (isProfile) {
        arti.name = ds._name || ds.name || arti.name || ''
        arti.set = ds._set || Artifact.getSetNameByArti(arti._name) || ds.set || ''
        arti.level = ds._level || ds.level || 1
        arti.star = ds._star || ds.star || 5
        arti.main = ds.main
        arti.attrs = ds.attrs
      } else {
        arti.name = ds.name || arti.name || ''
        arti.set = ds.set || Artifact.getSetNameByArti(arti.name) || ''
        arti.level = ds.level || 1
        arti.star = ds.star || 5
      }
      if (ds.mainId || ds.main) {
        arti._name = ds._name || ds.name || arti._name || arti.name
        arti._set = ds._set || Artifact.getSetNameByArti(arti._name) || arti._set || ''
        arti._level = ds._level || ds.level || arti._level || arti.level
        arti._star = ds._star || ds.star || arti._star || arti.star || 5
      }
    }

    // 存在面板数据，更新面板数据
    if (ds.mainId && ds.attrIds) {
      arti.mainId = ds.mainId
      arti.attrIds = ds.attrIds
      arti.main = Artifact.getMainById(ds.mainId, arti._level, arti._star)
      arti.attrs = Artifact.getAttrsByIds(ds.attrIds, arti._star)
    } else if (ds.main && ds.attrs) {
      arti.main = ArtisMark.formatAttr(ds.main || {})
      arti.attrs = []
      for (let attrIdx in ds.attrs || []) {
        if (ds.attrs[attrIdx]) {
          arti.attrs.push(ArtisMark.formatAttr(ds.attrs[attrIdx]))
        }
      }
    }
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
    for (let idx = 1; idx <= (this.isGs ? 5 : 6); idx++) {
      let ds = this.artis[idx]
      if (!ds) {
        continue
      }
      let tmp = {
        level: ds.level || 1,
        star: ds.star || 5
      }

      if (this.isSr) {
        tmp.id = ds.id
        tmp.mainId = ds.main?.id
        tmp.attrs = []
        lodash.forEach(ds.attrs, (as) => {
          tmp.attrs.push([
            as?.id || '',
            as?.count || 1,
            as?.step || 0
          ].join(','))
        })
      } else {
        tmp.name = ds.name || ''
        if ((ds.mainId && ds.attrIds) || (ds.main && ds.attrs)) {
          if ((ds._name && ds._name !== ds.name) || (ds._level && ds._level !== ds.level) || (ds._star && ds._star !== ds.star)) {
            tmp._name = ds._name || null
            tmp._level = ds._level || null
            tmp._star = ds._star || null
          }
        }
        if (ds.mainId && ds.attrIds) {
          tmp.mainId = ds.mainId || null
          tmp.attrIds = ds.attrIds
        } else if (ds.main && ds.attrs) {
          tmp.main = ds.main || null
          tmp.attrs = []
          for (let attrIdx in ds.attrs || []) {
            if (ds.attrs[attrIdx]) {
              tmp.attrs.push(ArtisMark.formatAttr(ds.attrs[attrIdx]))
            }
          }
        }
      }
      ret[idx] = tmp
    }
    return ret
  }

  getDetail (profile = false) {
    let ret = {}
    for (let idx = 1; idx <= 5; idx++) {
      let ds = this.artis[idx]
      if (ds) {
        let artis = Artifact.get(profile ? ds._name : ds.name)
        let tmp = {
          ...artis?.getData('img,name,set'),
          level: (profile ? ds._level : ds.level) || 1
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
  getSetData (profile = false) {
    let setCount = {}
    this.forEach((arti, idx) => {
      setCount[profile ? arti._set : arti.set] = (setCount[profile ? arti._set : arti.set] || 0) + 1
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

  eachArtisSet (fn) {
    AvatarArtis._eachArtisSet(this.sets, fn, this.game)
  }
}
