import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ attr, weapon, rule, def }) {
  let title = []
  let recharge = 55
  if (weapon.name === '万世流涌大典') {
    title.push('万世流涌大典')
    recharge = 40
  }
  if (title.length > 0) {
    let attr = usefulAttr['那维莱特'];
    return rule(`那维莱特-${title.join('')}`, { attr.hp, attr.atk, attr.def, attr.cpct, attr.cdmg, attr.mastery, attr.dmg, attr.phy, recharge, attr.heal })
  }
  return def(usefulAttr['那维莱特'])
}
