import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ attr, def }) {
  let title = []
  let particularAttr = { ...usefulAttr['绮良良'] }
  if (attr.cpct * 2 + attr.cdmg >= 240) {
    title.push('战斗')
    particularAttr.hp = 50
    particularAttr.atk = 75
    particularAttr.cpct = 100
    particularAttr.cdmg = 100
    particularAttr.dmg = 100
    particularAttr.recharge = 30
  }
  if (title.length > 0) {
    return def(particularAttr, title)
  }
  return def(usefulAttr['绮良良'])
}
