import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ attr, def }) {
  let title = []
  let particularAttr = { ...usefulAttr['雷电将军'] }
  if (attr.mastery > 500) {
    title.push('精通')
    particularAttr.atk = 50
    particularAttr.cpct = 50
    particularAttr.cdmg = 50
    particularAttr.mastery = 100
    particularAttr.dmg = 50
    particularAttr.recharge = 50
  }
  if (title.length > 0) {
    return def(particularAttr, title)
  }
  return def(usefulAttr['雷电将军'])
}
