import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ cons, rule, def }) {
  let title = []
  let particularAttr = { ...usefulAttr['希格雯'] }
  if (cons === 6) {
    title.push('满命')
    particularAttr.dmg = 100
    particularAttr.recharge = 100
    particularAttr.heal = 90
  }
  if (title.length > 0) {
    return rule(`希格雯-${title.join('')}`, particularAttr)
  }
  return def(usefulAttr['希格雯'])
}