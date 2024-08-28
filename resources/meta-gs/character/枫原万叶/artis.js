import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ cons, rule, def }) {
  if (cons === 6) {
    return rule('万叶-满命', { atk: 75, cpct: 100, cdmg: 100, mastery: 100, dmg: 100, recharge: 55 })
  }
  return def(usefulAttr['枫原万叶'])
}