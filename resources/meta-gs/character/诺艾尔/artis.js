import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ attr, artis, rule, def }) {
  let title = []
  let particularAttr = { ...usefulAttr['诺艾尔'] }
  if (attr.cpct * 2 + attr.cdmg > 240) {
    title.push('输出')
    particularAttr.atk = 50
    particularAttr.cpct = 100
    particularAttr.cdmg = 100
    particularAttr.dmg = 100
    particularAttr.recharge = 70
    if (!artis.is('dmg', 4) && attr.mastery > 80) {
      title = []
      title.push('月结晶')
      particularAttr.atk = 30
      particularAttr.dmg = 0
      particularAttr.mastery = 100
   }
  }
  if (title.length > 0) {
    return rule(`诺艾尔-${title.join('')}`, particularAttr)
  }
  return def(usefulAttr['诺艾尔'])
}