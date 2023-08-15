/**
 * 角色天赋相关处理
 * */
import lodash from 'lodash'

const CharTalent = {
  // 处理获取天赋数据
  getAvatarTalent (char, talent, cons, mode) {
    let { id, talentCons, game, isGs } = char
    let ret = {}
    let addTalent = {
      gs: { a: 3, e: 3, q: 3 },
      sr: { a: 1, e: 2, q: 2, t: 2 }
    }
    lodash.forEach(addTalent[game], (addNum, key) => {
      let ds = talent[key]
      if (!ds) {
        return false
      }
      let value
      let level
      let original
      let aPlus = id === 10000033
      if (lodash.isNumber(ds)) {
        value = ds
      }
      if (mode !== 'level') {
        // 基于original计算level
        value = value || ds.original || ds.level_original || ds.level || ds.level_current
        if (value > 10 && isGs) {
          mode = 'level'
        } else {
          original = value
          if (key === 'a' && isGs) {
            level = aPlus ? value + 1 : value
          }
          level = (talentCons[key] > 0 && cons >= talentCons[key]) ? (value + addNum) : value
        }
      }
      if (mode === 'level') {
        // 基于level计算original
        value = value || ds.level || ds.level_current || ds.original || ds.level_original
        level = value
        if (key === 'a' && isGs) {
          original = aPlus ? value - 1 : value
        }
        original = (talentCons[key] > 0 && cons >= talentCons[key]) ? (value - addNum) : value
      }
      ret[key] = { level, original }
    })
    if (lodash.isEmpty(ret)) {
      return false
    }
    return ret
  }
}
export default CharTalent
