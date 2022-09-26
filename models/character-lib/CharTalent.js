import lodash from 'lodash'

const CharTalent = {
  // 处理获取天赋数据
  getAvatarTalent (id, talent, cons, mode, consTalent = {}) {
    let ret = {}
    lodash.forEach(['a', 'e', 'q'], (key) => {
      let ds = talent[key]
      if (!ds) {
        return
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
  }
}
export default CharTalent
