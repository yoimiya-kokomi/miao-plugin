import {usefulAttr} from "../../artifact/artis-mark.js"

export default function ({ attr, cons, weapon, rule, def }) {
  let title = []
  let particularAttr = {...usefulAttr['梦见月瑞希']}
  if (attr.cpct >= 60 || attr.cdmg >= 120) {
    title = [] 
    title.push('星扩散')
    particularAttr.cpct = 100
    particularAttr.cdmg = 100
    particularAttr.mastery = 100
    particularAttr.dmg = 0
    particularAttr.recharge = 0
  }
  if (title.length > 0) {
    return rule(`梦见月瑞希-${title.join('')}`, particularAttr)
  }
  return def(usefulAttr['梦见月瑞希'])
}