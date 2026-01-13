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
      sr: { a: 1, e: 2, q: 2, t: 2, xe: 1, me: 1, mt: 1}
    }
    let maxTalent = {
      gs: { a: 15, e: 15, q: 15 },
      sr: { a: 10, e: 15, q: 15, t: 15, xe: 15, me: 10, mt: 10 }
    }
    lodash.forEach(addTalent[game], (addNum, key) => {
      let ds = talent[key]
      if (!ds) {
        return
      }
      let value
      let level
      let original
      let aPlus = id === 10000033   // 达达利亚: a+1
      let ePlus = id === 10000114   // 丝柯克: e+1
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
          level = value
          if (key === 'a' && isGs && aPlus) level += 1
          if (key === 'e' && isGs && ePlus) level += 1

          let consUp = talentCons[key]
          if (consUp) {
            if (lodash.isArray(consUp)) {
              for (const consLvl of consUp) {
                if (cons >= consLvl) level += addNum
              }
            } else if (cons >= consUp) {
              level += addNum
            }
          }
        }
      }
      if (mode === 'level') {
        // 基于level计算original
        value = value || ds.level || ds.level_current || ds.original || ds.level_original
        level = value
        original = value
        if (key === 'a' && isGs && aPlus) original -= 1
        if (key === 'e' && isGs && ePlus) original -= 1
        let consUp = talentCons[key]
        if (consUp) {
          if (lodash.isArray(consUp)) {
            for (const consLvl of consUp) {
              if (cons >= consLvl) original -= addNum
            }
          } else if (cons >= consUp) {
            original -= addNum
          }
        }
      }
      if (level > maxTalent[game][key]) level = maxTalent[game][key]
      ret[key] = { level, original }
    })
    if (lodash.isEmpty(ret)) {
      return false
    }
    return ret
  }
}
export default CharTalent
