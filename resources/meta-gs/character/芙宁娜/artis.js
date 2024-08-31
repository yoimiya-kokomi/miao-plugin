import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ cons, rule, def }) {
    if (cons === 6) {
      return rule('芙宁娜-满命', { hp: 100, atk: 0, def: 0, cpct: 100, cdmg: 100, mastery: 45, dmg: 100, phy: 0, recharge: 75, heal: 95 })
    }
    return def(usefulAttr['芙宁娜'])
  }
