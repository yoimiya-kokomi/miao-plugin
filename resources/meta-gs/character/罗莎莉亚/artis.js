import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ attr, def }) {
  let title = []
  let particularAttr = { ...usefulAttr['罗莎莉亚'] }
  if (attr.cpct * 2 + attr.cdmg >= 255) {
    title.push('输出')
    particularAttr.atk = 75
    particularAttr.cdmg = 100
    particularAttr.dmg = 100
    particularAttr.phy = 80
    particularAttr.recharge = 30
  }
  if (title.length > 0) {
    return def(particularAttr, title)
  }
  return def(usefulAttr['罗莎莉亚'])
}
