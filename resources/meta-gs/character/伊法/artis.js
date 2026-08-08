import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ attr, rule, def }) {
  let title = []
  let particularAttr = { ...usefulAttr['伊法'] }
  if (attr.cpct * 2 + attr.cdmg > 240) {
    title.push('直伤')
    particularAttr.cpct = 100
    particularAttr.cdmg = 100
    particularAttr.dmg = 100
  }
  if (title.length > 0) {
    return rule(`伊法-${title.join('')}`, particularAttr)
  }
  return def(usefulAttr['伊法'])
}