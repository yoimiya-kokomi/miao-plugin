import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ weapon, def }) {
  let title = []
  let particularAttr = { ...usefulAttr['那维莱特'] }
  if (weapon.name === '万世流涌大典') {
    title.push('专武')
    particularAttr.recharge = 40
  }
  if (title.length > 0) {
    return def(particularAttr, title)
  }
  return def(usefulAttr['那维莱特'])
}
