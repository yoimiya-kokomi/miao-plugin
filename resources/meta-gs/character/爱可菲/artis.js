import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ attr, cons, def, weapon }) {
  let title = []
  let particularAttr = { ...usefulAttr['爱可菲'] }
  if ((weapon.bonusKey !== 'recharge' && attr.recharge >= 200) || (weapon.bonusKey === 'recharge' && attr.recharge >= 220)) {
    title.push('纯辅')
    particularAttr.atk = 75
    particularAttr.cpct = 0
    particularAttr.cdmg = 0
    particularAttr.dmg = 0
    particularAttr.recharge = 100
    if (cons > 1) {
      title.push('高命')
      particularAttr.atk = 100
    }
  }
  if (title.length > 0) {
    return def(particularAttr, title)
  }
  return def(usefulAttr['爱可菲'])
}
