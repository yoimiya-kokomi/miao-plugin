import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ attr, rule, def }) {
  if (attr.cpct * 2 + attr.cdmg > 300) {
    let particularAttr = JSON.parse(JSON.stringify(usefulAttr['绮良良']))
    particularAttr.hp = 50
    particularAttr.atk = 75
    particularAttr.cpct = 100
    particularAttr.cdmg = 100
    particularAttr.dmg = 100
    return rule('绮良良-战斗', particularAttr)
  }
  return def(usefulAttr['绮良良'])
}
