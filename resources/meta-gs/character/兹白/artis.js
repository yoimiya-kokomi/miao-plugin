import {usefulAttr} from "../../artifact/artis-mark.js"

export default function ({rule, def, weapon}) {
  let title = []
  let particularAttr = {...usefulAttr['兹白']}
  if (weapon.name === '息燧之笛') {
    title.push('息燧')
    particularAttr.def = 75
  }
  if (title.length > 0) {
    return rule(`兹白-${title.join('')}`, particularAttr)
  }
  return def(usefulAttr['兹白'])
}
