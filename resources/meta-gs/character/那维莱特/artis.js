import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ attr, weapon, rule, def }) {
  if (weapon.name === '万世流涌大典') {
    return rule(`那维莱特-专武`, { hp: 100, atk: 0, def: 0, cpct: 100, cdmg: 100, mastery: 0, dmg: 100, phy: 0, recharge: 40, heal: 0 })
  }
  return def(usefulAttr['那维莱特'])
}
