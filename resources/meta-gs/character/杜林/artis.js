import {usefulAttr} from "../../artifact/artis-mark.js"

export default function ({cons, rule, def, artis}) {
  let title = []
  let particularAttr = {...usefulAttr['杜林']}
  if (cons > 0 && artis.artis['4'].main && artis.artis['4'].main.key === 'atk') {
    title.push('辅助')
    particularAttr.atk = 100
  }
  if (title.length > 0) {
    return rule(`杜林-${title.join('')}`, particularAttr)
  }
  return def(usefulAttr['杜林'])
}
