import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ attr, def }) {
  let title = []
  let particularAttr = { ...usefulAttr['神里绫华'] }
  if (attr.mastery > 120) {
    title.push('精通')
    particularAttr.mastery = 75
    return def(particularAttr, title)
  }
  return def(usefulAttr['神里绫华'])
}
