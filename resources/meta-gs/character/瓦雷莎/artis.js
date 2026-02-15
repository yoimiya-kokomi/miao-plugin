import {usefulAttr} from "../../artifact/artis-mark.js"

export default function ({cons, rule, def}) {
  let title = []
  let particularAttr = {...usefulAttr['瓦雷莎']}
  if (cons == 6) {
    title.push('满命')
    particularAttr.recharge = 0
  }
  if (title.length > 0) {
    return rule(`瓦雷莎-${title.join('')}`, particularAttr)
  }
  return def(usefulAttr['瓦雷莎'])
}
