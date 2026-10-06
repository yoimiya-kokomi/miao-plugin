import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ cons, def }) {
  let title = []
  let particularAttr = { ...usefulAttr['奥黛塔'] }
  if (cons >= 2) {
    title.push('高命')
    particularAttr.recharge = 50
  }
  if (title.length > 0) {
    return def(particularAttr, title)
  }
  return def(usefulAttr['奥黛塔'])
}
