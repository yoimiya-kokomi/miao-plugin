import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ cons, rule, def }) {
  let title = []
  let particularAttr = { ...usefulAttr['妮露'] }
  if (cons === 6) {
    title.push('满命')
    particularAttr.cpct = 100
    particularAttr.cdmg = 100
    particularAttr.dmg = 100
  }
  if (title.length > 0) {
    return rule(`妮露-${title.join('')}`, particularAttr)
  }
  return def(usefulAttr['妮露'])
}