import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ attr, def }) {
  let title = []
  let particularAttr = { ...usefulAttr['刻晴'] }
  if (attr.mastery >= 80) {
    title.push('精通')
    particularAttr.mastery = 75
  }
  if (title.length > 0) {
    return def(particularAttr, title)
  }
  return def(usefulAttr['刻晴'])
}
