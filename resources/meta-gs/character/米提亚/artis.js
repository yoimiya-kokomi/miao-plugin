import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ cons, def }) {
  let title = []
  let particularAttr = { ...usefulAttr['米提亚'] }
  if (cons >= 1) {
    title.push('高命')
    particularAttr.recharge = 40
  }
  if (title.length > 0) {
    return def(particularAttr, title)
  }
  return def(usefulAttr['米提亚'])
}
