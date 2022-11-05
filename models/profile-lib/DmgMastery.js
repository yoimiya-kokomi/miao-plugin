import { erType } from './DmgCalcMeta.js'

let DmgMastery = {
  getMultiple (type, mastery = 0) {
    let typeCfg = erType[type]
    if (typeCfg.type === 'pct') {
      return (25 / 9) * mastery / (mastery + 1400)
    } else if (typeCfg.type === 'fusion') {
      return 16 * mastery / (mastery + 2000)
    } else if (typeCfg.type === 'bonus') {
      return 5 * mastery / (mastery + 1200)
    }
    return 0
  },
  getBasePct (type, element) {
    let typeCfg = erType[type]
    if (typeCfg) {
      return typeCfg.num({ element }) || 1
    }
    return 1
  }
}
export default DmgMastery
