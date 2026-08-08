import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ attr, artis, rule, def }) {
  let title = []
  let particularAttr = { ...usefulAttr['班尼特'] }
  if (attr.recharge >= 250 && ((!artis.is('heal', 5) && attr.hp < 28000) || (artis.is('heal', 5) && attr.hp < 23000))) {
    title.push('高充能')
    particularAttr.hp = 0
    particularAttr.atk = 0
    particularAttr.def = 0
    particularAttr.cpct = 0
    particularAttr.cdmg = 0
    particularAttr.mastery = 0
    particularAttr.dmg = 0
    particularAttr.phy = 0
    particularAttr.recharge = 100
    particularAttr.heal = 0
  }
  if (attr.cpct * 2 + attr.cdmg > 180) {
    title.push('输出')
    particularAttr.atk = 80
    particularAttr.cpct = 100
    particularAttr.cdmg = 100
    particularAttr.dmg = 100
    particularAttr.recharge = 30
  }
  if (title.length > 0) {
    return rule(`班尼特-${title.join('')}`, particularAttr)
  }
  return def(usefulAttr['班尼特'])
}