import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ cons, def, weapon }) {
  let title = []
  let particularAttr = { ...usefulAttr['哥伦比娅'] }
  let recharge = particularAttr.recharge
  if (weapon.name === '帷间夜曲') {
    title.push('专武')
    recharge -= 15
  }
  if (cons >= 4) {
    title.push('高命')
    recharge -= 15
  }
  if (title.length > 0) {
    particularAttr.recharge = recharge
    return def(particularAttr, title)
  }
  return def(usefulAttr['哥伦比娅'])
}
