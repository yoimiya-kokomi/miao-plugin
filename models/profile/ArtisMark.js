import lodash from 'lodash'
import { Format } from '#miao'
import { attrNameMap, mainAttr, subAttr, attrMap, basicNum, attrPct } from '../../resources/meta/artifact/index.js'

let ArtisMark = {
  // 根据Key获取标题
  getKeyByTitle (title, dmg = false) {
    if (/元素伤害加成/.test(title) || Format.isElem(title)) {
      let elem = Format.matchElem(title)
      return dmg ? 'dmg' : elem
    } else if (title === '物理伤害加成') {
      return 'phy'
    }
    return attrNameMap[title]
  },

  // 根据标题获取Key
  getTitleByKey (key) {
    // 检查是否是伤害字段
    let dmg = Format.elemName(key, '')
    if (dmg) {
      return `${dmg}伤加成`
    }
    return attrMap[key].title
  },

  getKeyTitleMap () {
    let ret = {}
    lodash.forEach(attrMap, (ds, key) => {
      ret[key] = ds.title
    })
    Format.eachElem((key, name) => {
      ret[key] = `${name}伤加成`
    })
    return ret
  },

  formatAttr (ds) {
    if (!ds) {
      return {}
    }
    if (lodash.isArray(ds) && ds[0] && ds[1]) {
      return {
        key: ArtisMark.getKeyByTitle(ds[0]),
        value: ds[1]
      }
    }
    if (!ds.value) {
      return {}
    }
    return {
      key: ds.key || ArtisMark.getKeyByTitle(ds.title || ds.name || ds.key || ds.id || ''),
      value: ds.value || ''
    }
  },

  /**
   * 格式化圣遗物词条
   * @param ds
   * @param markCfg
   * @param isMain
   * @returns {{title: *, value: string}|*[]}
   */
  formatArti (ds, charAttrCfg = false, isMain = false, elem = '') {
    // 若为attr数组
    if (ds[0] && (ds[0].title || ds[0].key)) {
      let ret = []
      let totalUpNum = 0
      let ltArr = []
      let isIdAttr = false

      lodash.forEach(ds, (d) => {
        isIdAttr = !d.isCalcNum
        let arti = ArtisMark.formatArti(d, charAttrCfg)
        ret.push(arti)
        if (isIdAttr) {
          return true
        }
        totalUpNum += arti.upNum
        if (arti.hasLt) {
          ltArr.push(arti)
        }
        delete arti.hasLt
        delete arti.hasGt
      })
      if (!isIdAttr) {
        ltArr = lodash.sortBy(ltArr, 'upNum').reverse()
        for (let arti of ltArr) {
          if (totalUpNum > 9) {
            arti.upNum = arti.upNum - 1
            totalUpNum--
          } else {
            break
          }
        }
      }
      return ret
    }

    let key = ds.key
    let title = ds.title || ds[0]
    if (!key) {
      key = ArtisMark.getKeyByTitle(title)
    } else if (!title) {
      title = ArtisMark.getTitleByKey(key)
    }
    let isDmg = Format.isElem(key)
    let val = ds.value || ds[1]
    let value = val
    let num = ds.value || ds[1]
    if (!key || key === 'undefined') {
      return {}
    }
    let arrCfg = attrMap[isDmg ? 'dmg' : key]
    val = Format[arrCfg.format](val, 1)
    let ret = {
      key,
      value: val,
      upNum: ds.upNum || 0,
      eff: ds.eff || 0
    }
    if (!isMain && !ret.upNum) {
      let incRet = ArtisMark.getIncNum(key, value)
      ret.upNum = incRet.num
      ret.eff = incRet.eff
      ret.hasGt = incRet.hasGt
      ret.hasLt = incRet.hasLt
      ret.isCalcNum = true
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
    ret.eff = ret.eff ? Format.comma(ret.eff, 1) : '-'
    return ret
  },

  // 获取升级次数
  getIncNum (key, value) {
    let cfg = attrMap[key]
    if (!value || !cfg || !cfg.value || !cfg.valueMin) {
      return { num: 0 }
    }
    let maxNum = Math.min(5, Math.floor((value / cfg.valueMin).toFixed(1) * 1))
    let minNum = Math.max(1, Math.ceil((value / cfg.value).toFixed(1) * 1))
    // 相等时直接返回
    if (maxNum === minNum) {
      return { num: minNum, eff: value / cfg.value }
    }
    let avg = Math.round(value / (cfg.value + cfg.valueMin) * 2)
    return {
      num: avg,
      eff: value / cfg.value,
      hasGt: maxNum > avg,
      hasLt: minNum < avg
    }
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
  getMark (charCfg, posIdx, mainAttr, subAttr, elem = '') {
    let ret = 0
    let { attrs, posMaxMark } = charCfg
    let key = mainAttr?.key
    if (!key) {
      return 0
    }
    let fixPct = 1
    posIdx = posIdx * 1
    if (posIdx >= 3) {
      let mainKey = key
      if (key !== 'recharge') {
        if (posIdx === 4 && Format.isElem(key) && key === elem) {
          mainKey = 'dmg'
        }
        fixPct = Math.max(0, Math.min(1, (attrs[mainKey]?.weight || 0) / (posMaxMark['m' + posIdx])))
      }
      ret += (attrs[mainKey]?.mark || 0) * (mainAttr.value || 0) / 4
    }

    lodash.forEach(subAttr, (ds) => {
      ret += (attrs[ds.key]?.mark || 0) * (ds.value || 0)
    })
    return ret * (1 + fixPct) / 2 / posMaxMark[posIdx] * 66
  },

  getCritMark (charCfg, posIdx, mainAttr, subAttr, elem = '') {
    let ret = 0
    let { attrs, posMaxMark } = charCfg
    let key = mainAttr?.key
    if (!key) {
      return 0
    }
    let fixPct = 1
    posIdx = posIdx * 1
    if (posIdx >= 4) {
      let mainKey = key
      if (posIdx === 4 && Format.isElem(key) && key === elem) {
        mainKey = 'dmg'
      }
      fixPct = Math.max(0, Math.min(1, (attrs[mainKey]?.weight || 0) / (posMaxMark['m' + posIdx])))
    }
    if (key === 'cpct' || key === 'cdmg') {
      ret += 9.41
    }

    lodash.forEach(subAttr, (ds) => {
      if (ds.key === 'cpct' || ds.key === 'cdmg') {
        let temp_s = (attrs[ds.key]?.mark || 0) * (ds.value || 0) / 85
        ret += temp_s
      }
    })
    return ret
  },

  getValidMark (charCfg, posIdx, mainAttr, subAttr, elem = '') {
    let ret = 0
    let { attrs, posMaxMark } = charCfg
    let key = mainAttr?.key
    if (!key) {
      return 0
    }
    let fixPct = 1
    posIdx = posIdx * 1
    if (posIdx >= 4) {
      let mainKey = key
      if (posIdx === 4 && Format.isElem(key) && key === elem) {
        mainKey = 'dmg'
      }


      fixPct = Math.max(0, Math.min(1, (attrs[mainKey]?.weight || 0) / (posMaxMark['m' + posIdx])))
    }
    lodash.forEach(subAttr, (ds) => {
      let temp_s = (attrs[ds.key]?.mark || 0) * (ds.value || 0) / 85
      ret += temp_s
    })
    return ret
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
        if (!ds.name || !ds.main || !ds.attrs || !ds?.main?.key) {
          return false
        }
      }
    }
    return true
  }
}

export default ArtisMark
