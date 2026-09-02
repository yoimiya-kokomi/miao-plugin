import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ attr, def }) {
  let title = []
  let particularAttr = { ...usefulAttr['坎蒂丝'] }
  if (attr.cpct * 2 + attr.cdmg >= 240) {
    title.push('输出')
    particularAttr.atk = 75
    particularAttr.cpct = 100
    particularAttr.cdmg = 100
    particularAttr.mastery = 75
    particularAttr.dmg = 100
    particularAttr.recharge = 75
  }
  if (title.length > 0) {
    return def(particularAttr, title)
  }
  return def(usefulAttr['坎蒂丝'])
}
