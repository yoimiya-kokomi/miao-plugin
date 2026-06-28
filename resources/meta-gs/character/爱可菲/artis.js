import {usefulAttr} from "../../artifact/artis-mark.js"

export default function ({ attr, weapon, rule, def }) {
  let title = []
  let particularAttr = {...usefulAttr['爱可菲']}
  if (weapon.name === '西风长枪' && attr.recharge >= 230) {
    title = [] 
    title.push('西风纯辅')
    particularAttr.atk = 0
    particularAttr.cpct = 100
    particularAttr.cdmg = 0
    particularAttr.recharge = 100
    particularAttr.dmg = 0
  }
  if (weapon.name === '香韵奏者' && attr.recharge >= 230) {
    title = [] 
    title.push('餐叉纯辅')
    particularAttr.atk = 0
    particularAttr.cpct = 0
    particularAttr.cdmg = 0
    particularAttr.recharge = 100
    particularAttr.dmg = 0
  }
  if (title.length > 0) {
    return rule(`爱可菲-${title.join('')}`, particularAttr)
  }
  return def(usefulAttr['爱可菲'])
}
