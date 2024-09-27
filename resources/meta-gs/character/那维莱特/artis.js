import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ attr, weapon, rule, def }) {
  let title = []
  let recharge = 55
  if (weapon.name === '万世流涌大典') {
    title.push('万世流涌大典')
    recharge = 40
  }
  if (title.length > 0) {
    let role = usefulAttr['那维莱特'];
    return rule(`那维莱特-${title.join('')}`, { role.hp, role.atk, role.def, role.cpct, role.cdmg, role.mastery, role.dmg, role.phy, recharge, role.heal })
  }
  return def(usefulAttr['那维莱特'])
}
