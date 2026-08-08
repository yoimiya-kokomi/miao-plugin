import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ attr, weapon, rule, def }) {
  let title = []
  let particularAttr = { ...usefulAttr['钟离'] }
  if (weapon.name === '西风长枪') {
    title.push('西风')
    particularAttr.cpct = 100
  }
  if (attr.cpct * 2 + attr.cdmg > 240) {
    particularAttr.hp = 80
    particularAttr.atk = 75
    particularAttr.cpct = 100
    particularAttr.cdmg = 100
    particularAttr.dmg = 100
    particularAttr.recharge = 30
    if (attr.mastery > 100) {
      title.push('月共鸣')
      particularAttr.mastery = 100
    }
    title.push('武神')
  }
  if (title.length > 0) {
    return rule(`钟离-${title.join('')}`, particularAttr)
  }
  return def(usefulAttr['钟离'])
}