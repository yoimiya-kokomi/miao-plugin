import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ attr, rule, def }) {
  let title = []
  let particularAttr = { ...usefulAttr['多莉'] }
  if (attr.cpct * 2 + attr.cdmg > 240) {
    title.push('输出')
    particularAttr.atk = 75
    particularAttr.cpct = 100
    particularAttr.cdmg = 100
    particularAttr.mastery = 75
    particularAttr.dmg = 100
    particularAttr.recharge = 75
  }
  if (title.length > 0) {
    return rule(`多莉-${title.join('')}`, particularAttr)
  }
  return def(usefulAttr['多莉'])
}