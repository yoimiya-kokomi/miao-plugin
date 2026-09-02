import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ artis, def }) {
  let title = []
  let particularAttr = { ...usefulAttr['八重神子'] }
  if (artis.is('影中沉凝的幻灭4')) {
    title.push('星超导')
    particularAttr.atk = 100
    particularAttr.mastery = 100
    particularAttr.dmg = 0
  }
  if (title.length > 0) {
    return def(particularAttr, title)
  }
  return def(usefulAttr['八重神子'])
}
