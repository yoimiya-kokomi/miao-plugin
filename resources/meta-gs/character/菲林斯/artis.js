import {usefulAttr} from "../../artifact/artis-mark.js"

export default function ({cons, weapon, rule, def}) {
  let title = []
  let particularAttr = {...usefulAttr['菲林斯']}
  let recharge = particularAttr.recharge
  if (weapon.name === '血染荒城') {
    title.push('专武')
    recharge -= 5
  }
  if (cons > 0) {
    title.push('高命')
    recharge -= 5
  }
  if (title.length > 0) {
    particularAttr.recharge = recharge
    return rule(`菲林斯-${title.join('')}`, particularAttr)
  }
  return def(usefulAttr['菲林斯'])
}
