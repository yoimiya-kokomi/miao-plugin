import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ attr, def }) {
  let title = []
  let particularAttr = { ...usefulAttr['玛薇卡'] }
  if (attr.mastery < 50) {
    title.push('纯火/超载')
    particularAttr.atk = 85
    particularAttr.mastery = 0
  }
  if (title.length > 0) {
    return def(particularAttr, title)
  }
  return def(usefulAttr['玛薇卡'])
}
