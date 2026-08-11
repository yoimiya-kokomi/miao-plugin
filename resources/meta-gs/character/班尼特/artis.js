import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ attr, rule, def }) {
  let title = []
  let particularAttr = { ...usefulAttr['班尼特'] }
  if (attr.cpct * 2 + attr.cdmg > 180) {
    title.push('输出')
    particularAttr.atk = 100
    particularAttr.cpct = 100
    particularAttr.cdmg = 100
    particularAttr.dmg = 100
    particularAttr.recharge = 75
  }
  if (title.length > 0) {
    return rule(`班尼特-${title.join('')}`, particularAttr)
  }
  return def(usefulAttr['班尼特'])
}
