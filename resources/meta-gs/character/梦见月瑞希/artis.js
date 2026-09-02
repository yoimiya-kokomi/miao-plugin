import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ artis, attr, cons, def }) {
  let title = []
  let particularAttr = { ...usefulAttr['梦见月瑞希'] }
  if (attr.cpct * 2 + attr.cdmg >= 200 || artis.names.includes('血红之证')) {
    title.push('星扩散')
    particularAttr.cpct = 100
    particularAttr.cdmg = 100
    particularAttr.recharge = 50
  }
  if (cons >= 4) {
    title.push('高命')
    particularAttr.recharge = 30
  }
  if (title.length > 0) {
    return def(particularAttr, title)
  }
  return def(usefulAttr['梦见月瑞希'])
}
