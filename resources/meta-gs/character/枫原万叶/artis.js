import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ cons, def }) {
  let title = []
  let particularAttr = { ...usefulAttr['枫原万叶'] }
  if (cons === 6) {
    title.push('满命')
    particularAttr.atk = 75
    particularAttr.cpct = 100
    particularAttr.cdmg = 100
    particularAttr.dmg = 100
    particularAttr.recharge = 55
  }
  if (title.length > 0) {
    return def(particularAttr, title)
  }
  return def(usefulAttr['枫原万叶'])
}
