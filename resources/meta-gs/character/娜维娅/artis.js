import {usefulAttr} from "../../artifact/artis-mark.js"

export default function ({cons, rule, def}) {
  let title = []
  let particularAttr = {...usefulAttr['娜维娅']}
  let recharge = particularAttr.recharge
  if (cons >= 1) {
    title.push('高命')
    recharge -= 10
  }
  if (title.length > 0) {
    particularAttr.recharge = recharge
    return rule(`娜维娅-${title.join('')}`, particularAttr)
  }
  return def(usefulAttr['娜维娅'])
}
