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
    return rule(`那维莱特-${title.join('')}`, { hp: role.hp, atk: role.atk, def: role.def, cpct: role.cpct, cdmg: role.cdmg, mastery: role.mastery, dmg: role.dmg, phy: role.phy, recharge, heal: role.heal })
  }
  return def(usefulAttr['那维莱特'])
}
