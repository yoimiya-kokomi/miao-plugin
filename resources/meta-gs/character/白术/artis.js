import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ cons, rule, def }) {
  let title = []
  let particularAttr = { ...usefulAttr['白术'] }
  if (cons === 6) {
    title.push('满命')
    particularAttr.atk = 75
    particularAttr.cpct = 100
    particularAttr.cdmg = 100
    particularAttr.dmg = 100
    particularAttr.recharge = 35
  }
  if (title.length > 0) {
    return rule(`白术-${title.join('')}`, particularAttr)
  }
  return def(usefulAttr['白术'])
}