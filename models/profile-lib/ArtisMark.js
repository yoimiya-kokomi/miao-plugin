import lodash from 'lodash'
import { Format } from '../../components/index.js'
import { attrNameMap, mainAttr, subAttr, attrMap } from '../../resources/meta/artifact/artis-mark.js'

let ArtisMark = {
  // 根据Key获取标题
  getKeyByTitle (title, dmg = false) {
    if (/元素伤害加成/.test(title)) {
      let elem = Format.elem(title)
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
    lodash.forEach(Format.elemTitleMap(), (name, key) => {
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
      lodash.forEach(ds, (d) => {
        let arti = ArtisMark.formatArti(d, charAttrCfg)
        totalUpNum += arti.upNum
        if (arti.hasLt) {
          ltArr.push(arti)
        }
        ret.push(arti)
        delete arti.hasLt
        delete arti.hasGt
      })
      ltArr = lodash.sortBy(ltArr, 'upNum').reverse()
      for (let arti of ltArr) {
        if (totalUpNum > 9) {
          arti.upNum = arti.upNum - 1
          totalUpNum--
        } else {
          break
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
      value: val
    }
    if (!isMain) {
      let incRet = ArtisMark.getIncNum(key, value)
      ret.upNum = incRet.num
      ret.hasGt = incRet.hasGt
      ret.hasLt = incRet.hasLt
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
      return { num: minNum }
    }
    let avg = Math.round(value / (cfg.value + cfg.valueMin) * 2)
    return {
      num: avg,
      hasGt: maxNum > avg,
      hasLt: minNum < avg
    }
  },

  // 获取评分档位
  getMarkClass (mark) {
    let pct = mark
    let scoreMap = [['D', 10], ['C', 16.5], ['B', 23.1], ['A', 29.7], ['S', 36.3], ['SS', 42.9], ['SSS', 49.5], ['ACE', 56.1], ['ACE²', 66]]
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
    let key = mainAttr.key
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
  }
}

export default ArtisMark
