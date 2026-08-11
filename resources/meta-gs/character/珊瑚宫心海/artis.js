import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({artis, attr, rule, def }) {
  let title = []
  let particularAttr = { ...usefulAttr['珊瑚宫心海'] }
  if (attr.mastery < 50) {
    title.push('治疗/纯水输出')
    particularAttr.mastery = 0
  }
  if (artis.is('mastery', 3) || artis.is('mastery', 4) || artis.is('mastery', 5)) {
    title.push('(月)绽放')
    particularAttr.mastery = 100
  }
  if (title.length > 0) {
    return rule(`心海-${title.join('')}`, particularAttr)
  }
  return def(usefulAttr['珊瑚宫心海'])
}