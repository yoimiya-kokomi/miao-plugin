import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ attr, def }) {
  let title = []
  let particularAttr = { ...usefulAttr['夏洛蒂'] }
  if (attr.cpct * 2 + attr.cdmg >= 240) {
    title.push('输出')
    particularAttr.atk = 85
    particularAttr.cpct = 100
    particularAttr.cdmg = 100
    particularAttr.dmg = 100
  }
  if (title.length > 0) {
    return def(particularAttr, title)
  }
  return def(usefulAttr['夏洛蒂'])
}
