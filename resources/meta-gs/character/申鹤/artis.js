import {usefulAttr} from "../../artifact/artis-mark.js"

export default function ({attr, cons, rule, def}) {
  let title = []
  let particularAttr = {...usefulAttr['申鹤']}
  if (attr.cpct * 2 + attr.cdmg >= 240) {
    title.push('输出')
    particularAttr.cpct = 100
    particularAttr.cdmg = 100
    particularAttr.dmg = 100
  }
  if (cons > 0) {
    title.push('高命')
    particularAttr.recharge = 75
  }
  if (title.length > 0) {
    return rule(`申鹤-${title.join('')}`, particularAttr)
  }
  return def(usefulAttr['申鹤'])
}
