import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ cons, rule, def }) {
    if (cons === 6) {
      return rule('闲云-满命', { hp: 0, atk: 100, def: 0, cpct: 100, cdmg: 100, mastery: 0, dmg: 100, phy: 0, recharge: 35, heal: 95 })
    }
    return def(usefulAttr['闲云'])
  }
