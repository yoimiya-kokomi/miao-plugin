import lodash from 'lodash'

const CharTalent = {
  // 处理获取天赋数据
  getAvatarTalent (id, talent, cons, mode, consTalent = {}) {
    let ret = {}
    lodash.forEach(['a', 'e', 'q'], (key) => {
      let ds = talent[key]
      if (!ds) {
        ds = 1
      }
      let value
      let level
      let original
      let aPlus = id === 10000033
      if (lodash.isNumber(ds)) {
        value = ds
      }
      if (mode === 'level') {
        // 基于level计算original
        value = value || ds.level || ds.level_current || ds.original || ds.level_original
        level = value
        if (key === 'a') {
          original = aPlus ? value - 1 : value
        } else {
          original = cons >= consTalent[key] ? (value - 3) : value
        }
      } else {
        // 基于original计算level
        value = value || ds.original || ds.level_original || ds.level || ds.level_current
        original = value
        if (key === 'a') {
          level = aPlus ? value + 1 : value
        } else {
          level = cons >= consTalent[key] ? (value + 3) : value
        }
      }
      ret[key] = { level, original }
    })
    return ret
  },

  getConsTalent (talent, cons) {
    if (!talent) {
      return { e: 3, q: 5 }
    }
    let e = talent.e.name
    let q = talent.q.name
    let c3 = cons['3'].desc
    let c5 = cons['5'].desc
    return {
      e: c3.includes(e) ? 3 : 5,
      q: c5.includes(q) ? 5 : 3
    }
  }
}
export default CharTalent
