import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ attr, rule, def }) {
  let particularAttr = JSON.parse(JSON.stringify(usefulAttr['神里绫华']))
  if (attr.mastery > 120) {
    particularAttr.mastery = 75
    return rule(`神里-精通`, particularAttr)
  }
  return def(usefulAttr['神里绫华'])
}