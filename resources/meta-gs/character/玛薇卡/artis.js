import {usefulAttr} from "../../artifact/artis-mark.js"

export default function ({attr, rule, def}) {
  let title = []
  let particularAttr = {...usefulAttr['玛薇卡']}
  if (attr.mastery < 50) {
    title.push('纯火/超载')
    particularAttr.atk = 85
    particularAttr.mastery = 0
  }
  if (title.length > 0) {
    return rule(`玛薇卡-${title.join('')}`, particularAttr)
  }
  return def(usefulAttr['玛薇卡'])
}
