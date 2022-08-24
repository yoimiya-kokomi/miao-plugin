import { erType } from './calc-meta.js'

let DmgMastery = {
  getMultiple (type = 'zf', mastery = 0) {
    let typeCfg = erType[type]
    if (typeCfg.type === 'pct') {
      return 2.78 * mastery / (mastery + 1400) * 100
    } else if (typeCfg.type === 'fusion') {
      return (1 + mastery * 16) / (mastery + 2000) * 100
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
