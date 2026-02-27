import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ weapon, rule, def }) {
  if (weapon.name === '血染荒城') {
    return rule('菲林斯-专武', { atk: 90, cpct: 100, cdmg: 100, mastery: 20, dmg: 0, recharge: 0 })
  }
  return def(usefulAttr['菲林斯'])
}