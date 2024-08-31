import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ cons, rule, def }) {
    if (cons === 6) {
      return rule('妮露-满命', { hp: 100, atk: 0, def: 0, cpct: 100, cdmg: 100, mastery: 80, dmg: 100, phy: 0, recharge: 30, heal: 0 })
    }
    return def(usefulAttr['妮露'])
  }
