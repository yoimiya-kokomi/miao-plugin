/**
 * 面板圣遗物
 */
import lodash from 'lodash'
import { Artifact, ArtifactSet, Character } from '#miao.models'
import { Data, Format } from '#miao'
import ArtisMark from './ArtisMark.js'
import { attrMap as attrMapGS } from '../../resources/meta/artifact/index.js'
import { attrMap as attrMapSR } from '../../resources/meta-sr/artifact/index.js'
import ArtisMarkCfg from './ArtisMarkCfg.js'
import ArtisBase from './ArtisBase.js'
import ArtisAttr from './ArtisAttr.js'

export default class Artis extends ArtisBase {
  constructor (game = 'gs', isProfile = false) {
    super(game)
    this.isProfile = !!isProfile
  }

  // 有圣遗物词条
  get hasAttr () {
    return ArtisAttr.hasAttr(this)
  }

  getMarkDetail (profile, withDetail = true) {
    return ArtisMark.getMarkDetail(profile, withDetail)
  }

  setArtis (idx = 1, ds = {}) {
    idx = idx.toString().replace('arti', '') * 1 || 1
    super.setArtis(idx, ds)
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
      let tmp = this.isGs ? { name: ds.name } : { id: ds.id }
      tmp.level = ds.level || 1
      tmp.star = ds.star || 5
      ret[idx] = tmp
      // 如果不为面板数据，则不保存mainId和attrIds
      if (!this.isProfile) {
        return true
      }
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
    pos = pos || this.isGs ? '3,4,5' : '3,4,5,6'
    let dmgIdx = this.isGs ? 4 : 5
    Data.eachStr(pos.toString(), (p) => {
      let attrs = attr.split(',')
      if (!attrs.includes(mainAttr[p]) && (p === dmgIdx && !attrs.includes('dmg') && Format.isElem(mainAttr[p]))) {
        check = false
        return false
      }
    })
    return check
  }

  isSameArtis (target) {
    let k = (ds) => [ds?.name || '', ds?.level || '', ds?.star || ''].join('|')
    let ret = true
    this.eachIdx((ds, idx) => {
      if (k[ds] !== k(target[idx])) {
        return ret = false
      }
    })
    return ret
  }
}
