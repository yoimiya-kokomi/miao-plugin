import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ attr, cons, def }) {
  let title = []
  let particularAttr = { ...usefulAttr['茜特菈莉'] }
  if (cons >= 4) {
    title.push('高命')
    particularAttr.recharge = 75
  }
  if (attr.cpct * 2 + attr.cdmg >= 240) {
    title.push('战斗')
    particularAttr.atk = 80
    particularAttr.cpct = 100
    particularAttr.cdmg = 100
    particularAttr.dmg = 100
  }
  if (title.length > 0) {
    return def(particularAttr, title)
  }
  return def(usefulAttr['茜特菈莉'])
}

