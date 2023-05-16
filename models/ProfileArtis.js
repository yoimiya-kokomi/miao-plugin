/**
 * 面板圣遗物
 */
import lodash from 'lodash'
import AvatarArtis from './AvatarArtis.js'
import { Artifact, ArtifactSet, Character } from './index.js'
import { Format } from '../components/index.js'
import ArtisMark from './profile/ArtisMark.js'
import { attrMap } from '../resources/meta/artifact/index.js'
import CharArtis from './profile/CharArtis.js'

export default class ProfileArtis extends AvatarArtis {
  constructor (charid = 0, elem = '', game = 'gs') {
    super(charid, game)
    this.elem = elem
  }

  setProfile (profile, artis) {
    this.profile = profile
    this.elem = profile.elem || profile.char?.elem
    if (artis) {
      this.setArtisData(artis, true)
    }
  }

  /**
   * 获取角色配置
   * @returns {{classTitle: *, weight: *, posMaxMark: {}, mark: {}, attrs: {}}}
   */
  getCharCfg () {
    let char = Character.get(this.charid)
    let { attrWeight, title } = CharArtis.getCharArtisCfg(char, this.profile, this)
    let attrs = {}
    let baseAttr = char.baseAttr || { hp: 14000, atk: 230, def: 700 }
    lodash.forEach(attrMap, (attr, key) => {
      let k = attr.base || ''
      let weight = attrWeight[k || key]
      if (!weight || weight * 1 === 0) {
        return true
      }
      let ret = {
        ...attr,
        weight,
        fixWeight: weight,
        mark: weight / attr.value
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
    let posMaxMark = ArtisMark.getMaxMark(attrs)
    // 返回内容待梳理简化
    return {
      attrs,
      classTitle: title,
      posMaxMark
    }
  }

  getMarkDetail (withDetail = true) {
    let charCfg = this.getCharCfg()
    let artis = {}
    let setCount = {}
    let totalMark = 0
    let totalCrit = 0
    let totalVaild = 0
    this.forEach((arti, idx) => {
      let mark = ArtisMark.getMark(charCfg, idx, arti.main, arti.attrs, this.elem)
      let crit = ArtisMark.getCritMark(charCfg, idx, arti.main, arti.attrs, this.elem)
      let vaild = ArtisMark.getValidMark(charCfg, idx, arti.main, arti.attrs, this.elem)
      totalMark += mark
      totalCrit += crit
      totalVaild += vaild
      setCount[arti.set] = (setCount[arti.set] || 0) + 1
      if (!withDetail) {
        artis[idx] = {
          _mark: mark,
          mark: Format.comma(mark, 1),
          markClass: ArtisMark.getMarkClass(mark)
        }
      } else {
        let artifact = Artifact.get(arti.name)
        console.log(arti.main, arti.mainId, arti)
        artis[idx] = {
          name: artifact.name,
          set: artifact.setName,
          img: artifact.img,
          level: arti.level,
          _mark: mark,
          mark: Format.comma(mark, 1),
          markClass: ArtisMark.getMarkClass(mark),
          main: ArtisMark.formatArti(arti.main, charCfg.attrs, true, this.elem || ''),
          attrs: ArtisMark.formatArti(arti.attrs, charCfg.attrs)
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
      crit: Format.comma(totalCrit, 1),
      _crit: totalCrit,
      valid: Format.comma(totalVaild, 1),
      _valid: totalVaild,
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
}
