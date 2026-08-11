import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ attr, rule, def }) {
  let title = []
  let particularAttr = { ...usefulAttr['北斗'] }
  if (attr.cpct * 2 + attr.cdmg > 240) {
    title.push('输出')
    particularAttr.hp = 0
    particularAttr.atk = 75
    particularAttr.cpct = 100
    particularAttr.cdmg = 100
    particularAttr.mastery = 45
    particularAttr.dmg = 100
  }
  if (title.length > 0) {
    return rule(`北斗-${title.join('')}`, particularAttr)
  }
  return def(usefulAttr['北斗'])
}
