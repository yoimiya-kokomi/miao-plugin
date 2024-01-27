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
    let isDmg = Format.isElem(key)
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
        if (game === 'gs') {
          if (['atk', 'hp', 'def'].includes(mainKey) && attrs[mainKey]?.weight >= 75) {
            fixPct = 1
          }
        }
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
          ...artifact.getData('name,abbr,set:setName,img'),
          level: arti.level,
          main: ArtisMark.formatArti(arti.main, charCfg.attrs, true, game),
          attrs: ArtisMark.formatArtiAttrs(arti.attrs, charCfg.attrs, game),
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
