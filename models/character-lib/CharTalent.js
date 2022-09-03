import lodash from 'lodash';

const CharTalent = {
  getAvatarTalent (id, talent, cons, mode, consTalent = {}) {
    let ret = {}
    lodash.forEach(['a', 'e', 'q'], (key) => {
      let ds = talent[key]
      if (!ds) {
        ds = 1
      }
      let level
      if (lodash.isNumber(ds)) {
        level = ds
      } else {
        level = mode === 'level' ? ds.level || ds.level_current || ds.original || ds.level_original : ds.original || ds.level_original || ds.level || ds.level_current
      }
      if (mode === 'level') {
        // 基于level计算original
        ret[key] = {
          level,
          original: (key !== 'a' && cons >= consTalent[key]) ? (level - 3) : level
        }
      } else {
        // 基于original计算level
        ret[key] = {
          original: level,
          level: (key !== 'a' && cons >= consTalent[key]) ? (level + 3) : level
        }
      }
    })
    if (this.id * 1 !== 10000033) {
      let a = ret.a || {}
      if (a.level > 10) {
        a.level = 10
        a.original = 10
      }
    }
    if (this.id * 1 === 10000033) {
      let a = ret.a || {}
      a.original = a.level - 1
    }
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
