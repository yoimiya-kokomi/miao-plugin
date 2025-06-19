import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ cons, rule, def }) {
  let title = []
  let particularAttr = { ...usefulAttr['玛拉妮'] }
  if (cons >= 4) {
    title.push('高命')
    particularAttr.recharge = 30
  }
  if (title.length > 0) {
    return rule(`玛拉妮-${title.join('')}`, particularAttr)
  }
  return def(usefulAttr['玛拉妮'])
}
