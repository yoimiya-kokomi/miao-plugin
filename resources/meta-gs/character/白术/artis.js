import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ cons, rule, def }) {
  if (cons === 6) {
    return rule('白术-满命', { hp: 100, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 50, dmg: 100, phy: 0, recharge: 35, heal: 100 })
  }
  return def(usefulAttr['白术'])
}