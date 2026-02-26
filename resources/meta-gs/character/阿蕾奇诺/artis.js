import {usefulAttr} from "../../artifact/artis-mark.js"

export default function ({attr, rule, def}) {
  let title = []
  let particularAttr = {...usefulAttr['阿蕾奇诺']}
  if (attr.mastery < 50) {
    title.push('纯火')
    particularAttr.mastery = 0
  }
  if (title.length > 0) {
    return rule(`阿蕾奇诺-${title.join('')}`, particularAttr)
  }
  return def(usefulAttr['阿蕾奇诺'])
}
