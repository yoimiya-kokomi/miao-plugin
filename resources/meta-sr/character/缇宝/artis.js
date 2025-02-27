import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ attr, rule, def }) {
  let particularAttr = { ...usefulAttr['缇宝'] }
  if (attr.speed > 109) {
    particularAttr.speed = 100
    return rule(`缇宝-高速`, particularAttr)
  }
  return def(usefulAttr['缇宝'])
}
