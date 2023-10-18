/**
 * 面板圣遗物
 */
import lodash from 'lodash'
import { Artifact, ArtifactSet, Character } from '#miao.models'
import { Data, Format } from '#miao'
import ArtisMark from './ArtisMark.js'
import { attrMap as attrMapGS } from '../../resources/meta/artifact/index.js'
import { attrMap as attrMapSR } from '../../resources/meta-sr/artifact/index.js'
import CharArtis from '../profile/CharArtis.js'
import ArtisBase from './ArtisBase.js'

export default class Artis extends ArtisBase {
  constructor (isProfile = false, game = 'gs') {
    super(game)
    this.isProfile = !!isProfile
  }

  // 有圣遗物词条
  get hasAttr () {
    if (this.isSr) {
      return true
    }
    return ArtisMark.hasAttr(this.artis)
  }

  /**
   * 获取角色配置
   * @returns {{classTitle: *, weight: *, posMaxMark: {}, mark: {}, attrs: {}}}
   */
  getCharCfg () {
    let char = Character.get(this.charid)
    let { game, isGs } = char
    let { attrWeight, title } = CharArtis.getCharArtisCfg(char, this.profile, this)
    let attrs = {}
    let baseAttr = char.baseAttr || { hp: 14000, atk: 230, def: 700 }
    let attrMap = isGs ? attrMapGS : attrMapSR
    lodash.forEach(attrMap, (attr, key) => {
      let k = attr.base || ''
      let weight = attrWeight[k || key]
      if (!weight || weight * 1 === 0) {
        return true
      }
      let ret = {
        ...attr, weight, fixWeight: weight, mark: weight / attr.value
      }
      if (!k) {
        ret.mark = weight / attr.value
      } else {
        let plus = k === 'atk' ? 520 : 0
        ret.mark = weight / attrMap[k].value / (baseAttr[k] + plus) * 100
        ret.fixWeight = weight * attr.value / attrMap[k].value / (baseAttr[k] + plus) * 100
      }
      attrs[key] = ret
    })
    let posMaxMark = ArtisMark.getMaxMark(attrs, game)
    // 返回内容待梳理简化
    return {
      attrs, classTitle: title, posMaxMark
    }
  }

  getMarkDetail (withDetail = true) {
    let charCfg = this.getCharCfg()
    let artis = {}
    let setCount = {}
    let totalMark = 0
    let self = this
    this.forEach((arti, idx) => {
      let mark = ArtisMark.getMark({
        charCfg, idx, arti, elem: this.elem, game: self.game
      })
      totalMark += mark
      setCount[arti.set] = (setCount[arti.set] || 0) + 1
      if (!withDetail) {
        artis[idx] = {
          _mark: mark, mark: Format.comma(mark, 1), markClass: ArtisMark.getMarkClass(mark)
        }
      } else {
        let artifact = Artifact.get(arti.name, this.game)
        artis[idx] = {
          name: artifact.name,
          abbr: artifact.abbr,
          set: artifact.setName,
          img: artifact.img,
          level: arti.level,
          _mark: mark,
          mark: Format.comma(mark, 1),
          markClass: ArtisMark.getMarkClass(mark),
          main: ArtisMark.formatArti(arti.main, charCfg.attrs, true, this.game),
          attrs: ArtisMark.formatArti(arti.attrs, charCfg.attrs, false, this.game)
        }
      }
    })
    let sets = {}
    let names = []
    let imgs = []
    for (let set in setCount) {
      if (setCount[set] >= 2) {
        sets[set] = setCount[set] >= 4 ? 4 : 2
        let artiSet = ArtifactSet.get(set)
        imgs.push(artiSet.img)
        names.push(artiSet.name)
      }
    }
    this.mark = totalMark
    this.markClass = ArtisMark.getMarkClass(totalMark / 5)
    let ret = {
      mark: Format.comma(totalMark, 1),
      _mark: totalMark,
      markClass: ArtisMark.getMarkClass(totalMark / 5),
      artis,
      sets,
      names,
      imgs,
      classTitle: charCfg.classTitle
    }
    if (withDetail) {
      ret.charWeight = lodash.mapValues(charCfg.attrs, ds => ds.weight)
    }
    return ret
  }

  setArtis (idx = 1, ds = {}) {
    idx = idx.toString().replace('arti', '')
    parent.setArtis(idx, ds)
    let arti = this.artis[idx]
    if (!ds.attrIds || !ds.mainId) {
      return false
    }
    arti.mainId = ds.mainId
    arti.attrIds = ds.attrIds
    arti.main = {}
    arti.attrs = {}
    let artiObj = Artifact.get(ds.id, this.game)
    if (!artiObj) {
      return false
    }
    let attr = artiObj.getAttrData(ds.mainId, attrIds, arti.level, arti.star, idx)
    if (!attr) {
      console.log('attr id error', ds.main, ds.mainId, idx, arti.level, arti.star)
      return false
    }
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
      tmp.mainId = ds.main?.id
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
}
