import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ attr, rule, def }) {
  let title = []
  let particularAttr = { ...usefulAttr['七七'] }
  if (attr.cpct * 2 + attr.cdmg > 240) {
    title.push('输出')
    particularAttr.cpct = 100
    particularAttr.cdmg = 100
    particularAttr.dmg = 100
    particularAttr.phy = 95
  }
  if (title.length > 0) {
    return rule(`七七-${title.join('')}`, particularAttr)
  }
  return def(usefulAttr['七七'])
}