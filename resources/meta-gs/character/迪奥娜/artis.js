import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ attr, rule, def }) {
  let title = []
  let particularAttr = { ...usefulAttr['迪奥娜'] }
  if (attr.cpct * 2 + attr.cdmg > 240) {
    title.push('输出')
    particularAttr.atk = 75
    particularAttr.cpct = 100
    particularAttr.cdmg = 100
    particularAttr.dmg = 100
    particularAttr.mastery = 85
    particularAttr.recharge = 90
  }
  if (title.length > 0) {
    return rule(`迪奥娜-${title.join('')}`, particularAttr)
  }
  return def(usefulAttr['迪奥娜'])
}