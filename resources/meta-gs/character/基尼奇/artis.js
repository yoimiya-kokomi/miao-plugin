import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ cons, rule, def }) {
  let title = []
  let particularAttr = { ...usefulAttr['基尼奇'] }
  if (cons >= 1) {
    title.push('高命')
    particularAttr.atk = 100
    if (cons >= 4) {
      particularAttr.recharge = 35
    }
  }
  if (title.length > 0) {
    return rule(`基尼奇-${title.join('')}`, particularAttr)
  }
  return def(usefulAttr['基尼奇'])
}
