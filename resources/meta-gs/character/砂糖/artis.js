import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ attr, rule, def }) {
  let title = []
  let particularAttr = { ...usefulAttr['砂糖'] }
  if (attr.cpct * 2 + attr.cdmg > 240) {
    title.push('输出')
    particularAttr.atk = 75
    particularAttr.cpct = 100
    particularAttr.cdmg = 100
    particularAttr.dmg = 100
    particularAttr.recharge = 75
  }
  if (title.length > 0) {
    return rule(`砂糖-${title.join('')}`, particularAttr)
  }
  return def(usefulAttr['砂糖'])
}