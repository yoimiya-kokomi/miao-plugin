import lodash from 'lodash'
import { Data, Format } from '#miao'
import { attrMap as attrMapGS, attrNameMap, mainAttr as mainAttrGS, subAttr as subAttrGS } from '../../resources/meta/artifact/index.js'
import { attrMap as attrMapSR, mainAttr as mainAttrSR, subAttr as subAttrSR } from '../../resources/meta-sr/artifact/meta.js'
import ArtisMarkCfg from './ArtisMarkCfg.js'
import { Artifact } from '#miao.models'

let ArtisMark = {
  // 根据Key获取标题
  getKeyByTitle (title, game = 'gs') {
    if (/元素伤害加成/.test(title) || Format.isElem(title)) {
      return Format.matchElem(title)
    } else if (title === '物理伤害加成') {
      return 'phy'
    }
    return attrNameMap[title] || attrMapGS[title]
  },

  getKeyTitleMap (game = 'gs') {
    let ret = {}
    let attrMap = game === 'gs' ? attrMapGS : attrMapSR
    lodash.forEach(attrMap, (ds, key) => {
      ret[key] = ds.title
    })
    Format.eachElem((key, name) => {
      ret[key] = `${name}伤加成`
    }, game)
    return ret
  },

  formatAttr (ds, game = 'gs') {
    if (!ds) {
      return {}
    }
    if (lodash.isArray(ds) && ds[0] && ds[1]) {
      return {
        key: ArtisMark.getKeyByTitle(ds[0], game),
        value: ds[1]
      }
    }
    if (!ds.value) {
      return {}
    }
    return {
      key: ds.key || ArtisMark.getKeyByTitle(ds.title || ds.name || ds.key || ds.id || '', game),
      value: ds.value || ''
    }
  },

  /**
   * 格式化圣遗物词条
   * @param ds
   * @param charAttrCfg
   * @param isMain
   * @param game
   * @returns {{title: *, value: string}|*[]}
   */
  formatArti (ds, charAttrCfg = false, isMain = false, game = 'gs') {
    // 若为attr数组
    if (ds[0] && (ds[0].title || ds[0].key)) {
      let ret = []
      lodash.forEach(ds, (d) => {
        let arti = ArtisMark.formatArti(d, charAttrCfg, isMain, game)
        ret.push(arti)
      })
      return ret
    }

    let key = ds.key
    let title = ds.title || ds[0]
    if (!key) {
      key = ArtisMark.getKeyByTitle(title, game)
    }
    let isDmg = Format.isElem(key)
    let val = ds.value || ds[1]
    let num = ds.value || ds[1]
    if (!key || key === 'undefined') {
      return {}
    }
    let arrCfg = (game === 'gs' ? attrMapGS : attrMapSR)[isDmg ? 'dmg' : key]
    val = Format[arrCfg?.format || 'comma'](val, 1)
    let ret = {
      key,
      value: val,
      upNum: ds.upNum || 0,
      eff: ds.eff || 0
    }

    if (charAttrCfg) {
      let mark = charAttrCfg[key]?.mark * num || 0
      if (isMain) {
        mark = mark / 4 + 0.01
        ret.key = key
      }
      ret.mark = Format.comma(mark || 0)
      ret._mark = mark || 0
    }
    ret.eff = ret.eff ? Format.comma(ret.eff / (game === 'gs' ? 0.85 : 0.9), 1) : '-'
    return ret
  },

  // 获取评分档位
  getMarkClass (mark) {
    let pct = mark
    let scoreMap = [['D', 7], ['C', 14], ['B', 21], ['A', 28], ['S', 35], ['SS', 42], ['SSS', 49], ['ACE', 56], ['MAX', 70]]
    for (let idx = 0; idx < scoreMap.length; idx++) {
      if (pct < scoreMap[idx][1]) {
        return scoreMap[idx][0]
      }
    }
  },

  // 获取位置分数
  getMark ({ charCfg, idx, arti, elem = '', game = 'gs' }) {
    let ret = 0
    let mAttr = arti.main
    let sAttr = arti.attrs
    let { attrs, posMaxMark } = charCfg
    let key = mAttr?.key
    if (!key) {
      return 0
    }
    let fixPct = 1
    idx = idx * 1
    if (idx >= 3) {
      let mainKey = key
      if (key !== 'recharge') {
        let dmgIdx = { gs: 4, sr: 5 }
        if (idx === dmgIdx[game] && Format.sameElem(elem, key, game)) {
          mainKey = 'dmg'
        }
        fixPct = Math.max(0, Math.min(1, (attrs[mainKey]?.weight || 0) / (posMaxMark['m' + idx])))
      }
      ret += (attrs[mainKey]?.mark || 0) * (mAttr.value || 0) / 4
    }

    lodash.forEach(sAttr, (ds) => {
      ret += (attrs[ds.key]?.mark || 0) * (ds.value || 0)
    })
    return ret * (1 + fixPct) / 2 / posMaxMark[idx] * 66
  },

  // 获取位置最高分
  getMaxMark (attrs, game = 'gs') {
    let ret = {}
    let mainAttr = game === 'gs' ? mainAttrGS : mainAttrSR
    let subAttr = game === 'gs' ? subAttrGS : subAttrSR
    for (let idx = 1; idx <= (game === 'gs' ? 5 : 6); idx++) {
      let totalMark = 0
      let mMark = 0
      let mAttr = ''
      if (idx === 1) {
        mAttr = 'hpPlus'
      } else if (idx === 2) {
        mAttr = 'atkPlus'
      } else if (idx >= 3) {
        mAttr = ArtisMark.getMaxAttr(attrs, mainAttr[idx])[0]
        mMark = attrs[mAttr].fixWeight
        totalMark += attrs[mAttr].fixWeight * 2
      }

      let sAttr = ArtisMark.getMaxAttr(attrs, subAttr, 4, mAttr)
      lodash.forEach(sAttr, (attr, aIdx) => {
        totalMark += attrs[attr].fixWeight * (aIdx === 0 ? 6 : 1)
      })
      ret[idx] = totalMark
      ret['m' + idx] = mMark
    }
    return ret
  },

  // 获取最高分的属性
  getMaxAttr (attrs = {}, list2 = [], maxLen = 1, banAttr = '') {
    let tmp = []
    lodash.forEach(list2, (attr) => {
      if (attr === banAttr) return
      if (!attrs[attr]) return
      tmp.push({ attr, mark: attrs[attr].fixWeight })
    })
    tmp = lodash.sortBy(tmp, 'mark')
    tmp = tmp.reverse()
    let ret = []
    lodash.forEach(tmp, (ds) => ret.push(ds.attr))
    return ret.slice(0, maxLen)
  },

  getMarkDetail (profile, withDetail = true) {
    if (!profile.isProfile) {
      return {}
    }
    let charCfg = ArtisMarkCfg.getCfg(profile)
    let artisRet = {}
    let setCount = {}
    let totalMark = 0
    let { game, artis, elem } = profile
    artis.forEach((arti, idx) => {
      let mark = ArtisMark.getMark({ charCfg, idx, arti, elem, game })
      totalMark += mark
      setCount[arti.set] = (setCount[arti.set] || 0) + 1
      artisRet[idx] = {
        _mark: mark,
        mark: Format.comma(mark, 1),
        markClass: ArtisMark.getMarkClass(mark)
      }
      if (withDetail) {
        let artifact = Artifact.get(arti, game)
        artisRet[idx] = {
          ...Data.getData(artifact, 'name,abbr,set:setName,img'),
          level: arti.level,
          main: ArtisMark.formatArti(arti.main, charCfg.attrs, true, game),
          attrs: ArtisMark.formatArti(arti.attrs, charCfg.attrs, false, game),
          ...artisRet[idx]
        }
      }
    })
    let setData = artis.getSetData()
    artis.mark = totalMark
    artis.markClass = ArtisMark.getMarkClass(totalMark / 5)
    let ret = {
      classTitle: charCfg.classTitle,
      artis: artisRet,
      mark: Format.comma(totalMark, 1),
      _mark: artis.mark,
      markClass: artis.markClass,
      ...Data.getData(setData, 'sets,names,imgs'),
    }
    if (withDetail) {
      ret.charWeight = lodash.mapValues(charCfg.attrs, ds => ds.weight)
    }
    return ret
  }
}

export default ArtisMark
