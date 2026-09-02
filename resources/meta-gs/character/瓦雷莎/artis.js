import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ cons, def }) {
  let title = []
  let particularAttr = { ...usefulAttr['瓦雷莎'] }
  if (cons == 6) {
    title.push('满命')
    particularAttr.recharge = 0
  }
  if (title.length > 0) {
    return def(particularAttr, title)
  }
  return def(usefulAttr['瓦雷莎'])
}
