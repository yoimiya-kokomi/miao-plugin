import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ cons, rule, def }) {
  if (cons === 6) {
    return rule('椒丘-满命', { hp: 75, atk: 75, def: 75, speed: 100, cpct: 100, cdmg: 100, stance: 0, heal: 0, recharge: 0, effPct: 100, effDef: 50, dmg: 100 })
  }
  return def(usefulAttr['椒丘'])
}
