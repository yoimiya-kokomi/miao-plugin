import lodash from 'lodash'
import { Format } from '#miao'
import { attrNameMap, mainAttr, subAttr, attrMap } from '../../resources/meta/artifact/index.js'
import {
  attrMap as attrMapSR
} from '../../resources/meta-sr/artifact/meta.js'

let ArtisMark = {
  // 根据Key获取标题
  getKeyByTitle (title, game = 'gs') {
    if (/元素伤害加成/.test(title) || Format.isElem(title)) {
      let elem = Format.matchElem(title)
      return elem
    } else if (title === '物理伤害加成') {
      return 'phy'
    }
    return (game === 'gs' ? attrNameMap : attrMap)[title]
  },

  getKeyTitleMap (game = 'gs') {
    let ret = {}
    lodash.forEach(game === 'gs' ? attrMap : attrMapSR, (ds, key) => {
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
    let arrCfg = (game === 'gs' ? attrMap : attrMapSR)[isDmg ? 'dmg' : key]
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
    ret.eff = ret.eff ? Format.comma(ret.eff / 0.85, 1) : '-'
    return ret
  },

  // 获取评分档位
  getMarkClass (mark) {
    let pct = mark
    let scoreMap = [['D', 7], ['C', 14], ['B', 21], ['A', 28], ['S', 35], ['SS', 42], ['SSS', 49], ['ACE', 56], ['ACE²', 66.1]]
    for (let idx = 0; idx < scoreMap.length; idx++) {
      if (pct < scoreMap[idx][1]) {
        return scoreMap[idx][0]
      }
    }
  },

  // 获取位置分数
  getMark ({ charCfg, idx, arti, elem = '', game = 'gs' }) {
    if (game === 'sr') {
      return 0
    }
    let ret = 0
    let mainAttr = arti.main
    let subAttr = arti.attrs
    let { attrs, posMaxMark } = charCfg
    let key = mainAttr?.key
    if (!key) {
      return 0
    }
    let fixPct = 1
    idx = idx * 1
    if (idx >= 3) {
      let mainKey = key
      if (key !== 'recharge') {
        if (idx === 4 && Format.isElem(key) && key === elem) {
          mainKey = 'dmg'
        }
        fixPct = Math.max(0, Math.min(1, (attrs[mainKey]?.weight || 0) / (posMaxMark['m' + idx])))
      }
      ret += (attrs[mainKey]?.mark || 0) * (mainAttr.value || 0) / 4
    }

    lodash.forEach(subAttr, (ds) => {
      ret += (attrs[ds.key]?.mark || 0) * (ds.value || 0)
    })
    return ret * (1 + fixPct) / 2 / posMaxMark[idx] * 66
  },

  // 获取位置最高分
  getMaxMark (attrs) {
    let ret = {}
    for (let idx = 1; idx <= 5; idx++) {
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

  hasAttr (artis) {
    for (let idx = 1; idx <= 5; idx++) {
      let ds = artis[idx]
      if (ds) {
        // 不再支持非id格式的面板
        if (!ds.name || !ds.main || !ds.attrs || !ds?.main?.key || !ds.mainId) {
          return false
        }
      }
    }
    return true
  }
}

export default ArtisMark
