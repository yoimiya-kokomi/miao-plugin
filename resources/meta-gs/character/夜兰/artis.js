import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({artis, cons, attr, weapon, def }) {
  let title = []
  let particularAttr = { ...usefulAttr['夜兰'] }
  if (cons >= 1 && !artis.is('绝缘4')) {
    title.push('高命')
    particularAttr.recharge = 55
  }
  if (attr.mastery > 80) {
    title.push('精通')
    particularAttr.mastery = 75
  }
  if (weapon.name === '若水') {
    title.push('若水')
    particularAttr.hp = 100
  }
  if (title.length > 0) {
    return def(particularAttr, title)
  }
  return def(usefulAttr['夜兰'])
}
