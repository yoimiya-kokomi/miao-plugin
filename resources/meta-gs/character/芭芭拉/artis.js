import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ attr, rule, def }) {
  let title = []
  let particularAttr = { ...usefulAttr['芭芭拉'] }
  if (attr.cpct * 2 + attr.cdmg >= 240) {
    title.push('暴力')
    particularAttr.hp = 50
    particularAttr.atk = 75
    particularAttr.cpct = 100
    particularAttr.cdmg = 100
    particularAttr.mastery = 75
    particularAttr.dmg = 100
    particularAttr.recharge = 30
    particularAttr.heal = 50
  }
  if (title.length > 0) {
    return rule(`芭芭拉-${title.join('')}`, particularAttr)
  }
  return def(usefulAttr['芭芭拉'])
}