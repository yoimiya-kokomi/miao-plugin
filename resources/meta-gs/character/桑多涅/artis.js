import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ cons, def }) {
  let title = []
  let particularAttr = { ...usefulAttr['桑多涅'] }
  if (cons >= 2) {
    title.push('高命')
    particularAttr.atk = 100
  }
  if (title.length > 0) {
    return def(particularAttr, title)
  }
  return def(usefulAttr['桑多涅'])
}
