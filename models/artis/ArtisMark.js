import lodash from 'lodash'
import { Data, Format, Meta } from '#miao'
import ArtisMarkCfg from './ArtisMarkCfg.js'
import { Artifact } from '#miao.models'

let ArtisMark = {
  getKeyTitleMap (game = 'gs') {
    let ret = {}
    let { attrMap } = Meta.getMeta(game, 'arti')
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
    if (!ds.value) {
      return {}
    }
    return {
      key: ds.key || '',
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
    let isDmg = Format.isElem(key, game)
    let val = ds.value || ds[1]
    let num = ds.value || ds[1]
    if (!key || key === 'undefined') {
      return {}
    }
    let arrCfg = Meta.getMeta(game, 'arti', 'attrMap')[isDmg ? 'dmg' : key]
    val = Format[arrCfg?.format || 'comma'](val, 1)
    let ret = {
      key,
      value: val,
      upNum: ds.upNum || 0,
      eff: ds.eff || 0
    }

    if (charAttrCfg) {
      let mark = charAttrCfg[key]?.mark * num || 0
      if (isDmg) {
        mark = charAttrCfg.dmg?.mark * num || 0
      }
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

  formatArtiAttrs (ds, charAttrCfg = false, game = 'gs') {
    let ret = []
    lodash.forEach(ds, (d) => {
      let arti = ArtisMark.formatArti(d, charAttrCfg, false, game)
      ret.push(arti)
    })
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
  getMark ({ charCfg, idx, arti, elem = '', game = 'gs', id }) {
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
    let pMax = posMaxMark[idx]
    if (idx >= 3) {
      let mainKey = ArtisMark.getMainKey(idx, key, elem, game, id)
      if (key !== 'recharge') {
        let mMax = posMaxMark['m' + idx]
        fixPct = mMax > 0 ? Math.max(0, Math.min(1, (attrs[mainKey]?.weight || 0) / mMax)) : 1
        if (game === 'gs') {
          if (['atk', 'hp', 'def'].includes(mainKey) && attrs[mainKey]?.weight >= 75) {
            fixPct = 1
          }
        }
      }
      ret += (attrs[mainKey]?.mark || 0) * (mAttr.value || 0) / 4
      pMax = ArtisMark.getPosMaxMark(charCfg, idx, mainKey, game)
    }

    lodash.forEach(sAttr, (ds) => {
      ret += (attrs[ds.key]?.mark || 0) * (ds.value || 0)
    })
    return pMax > 0 ? ret * (1 + fixPct) / 2 / pMax * 66 : 0
  },

  // 获取主词条对应的评分key，元素伤害主词条按dmg计
  getMainKey (idx, key, elem = '', game = 'gs', id) {
    idx = idx * 1
    if (!key || key === 'recharge') {
      return key
    }
    let dmgIdx = { gs: 4, sr: 5 }
    // 对法尔伽做特殊处理————所有异色属伤杯，在圣遗物评分时，均视为风伤杯
    if (idx === dmgIdx[game] && (Format.sameElem(elem, key, game) || id === 10000128)) {
      return 'dmg'
    }
    return key
  },

  // 获取位置在当前主词条下的裸分上限
  // posMaxMark 按该位置最优主词条计算，此时最优主词条属性被排除在副词条池外
  // 若主词条为其它属性，该属性可作为副词条，实际裸分上限高于 posMaxMark，直接归一化会导致得分超出上限
  getPosMaxMark (charCfg, idx, mainKey, game = 'gs') {
    let pMax = charCfg.posMaxMark[idx]
    if (idx < 3) {
      return pMax
    }
    return Math.max(pMax, ArtisMark.getMainMaxMark(charCfg.attrs, mainKey, game))
  },

  // 获取指定主词条下该位置的裸分上限
  // 仅用于 idx>=3 的位置，花/羽主词条固定，不参与评分
  getMainMaxMark (attrs, mainKey, game = 'gs') {
    let { subAttr } = Meta.getMeta(game, 'arti')
    let totalMark = (attrs[mainKey]?.fixWeight || 0) * 2
    let sAttr = ArtisMark.getMaxAttr(attrs, subAttr, 4, mainKey)
    lodash.forEach(sAttr, (attr, aIdx) => {
      totalMark += attrs[attr].fixWeight * (aIdx === 0 ? 6 : 1)
    })
    return totalMark
  },

  // 获取位置最高分
  getMaxMark (attrs, game = 'gs') {
    let ret = {}
    let { mainAttr, subAttr } = Meta.getMeta(game, 'arti')
    for (let idx = 1; idx <= (game === 'gs' ? 5 : 6); idx++) {
      let totalMark = 0
      let mMark = 0
      let mAttr = ''
      if (idx === 1) {
        mAttr = 'hpPlus'
      } else if (idx === 2) {
        mAttr = 'atkPlus'
      } else if (idx >= 3) {
        let mainCandidates = ArtisMark.getMaxAttr(attrs, mainAttr[idx])
        if (mainCandidates.length > 0) {
          mAttr = mainCandidates[0]
          mMark = attrs[mAttr].fixWeight
          totalMark += mMark * 2
        } else {
          mAttr = mainAttr[idx][0]
        }
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
    let { game, artis, elem, id } = profile
    artis.forEach((arti, idx) => {
      let mark = ArtisMark.getMark({ charCfg, idx, arti, elem, game, id })
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
          ...artifact.getData('name,abbr,set:setName,img'),
          level: arti.level,
          main: ArtisMark.formatArti(arti.main, charCfg.attrs, true, game),
          attrs: ArtisMark.formatArtiAttrs(arti.attrs, charCfg.attrs, game),
          pMax: ArtisMark.getPosMaxMark(charCfg, idx, ArtisMark.getMainKey(idx, arti.main?.key, elem, game, id), game),
          ...artisRet[idx]
        }
      }
    })
    let setData = artis.getSetData()
    artis.mark = totalMark
    artis.markClass = ArtisMark.getMarkClass(totalMark / (profile.isGs ? 5 : 6))
    let ret = {
      classTitle: charCfg.classTitle,
      artis: artisRet,
      mark: Format.comma(totalMark, 1),
      _mark: artis.mark,
      markClass: artis.markClass,
      ...Data.getData(setData, 'sets,names,imgs')
    }
    if (withDetail) {
      ret.charWeight = lodash.mapValues(charCfg.attrs, ds => ds.weight)
    }
    return ret
  }
}

export default ArtisMark
