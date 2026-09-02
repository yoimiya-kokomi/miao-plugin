import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ artis, cons, def }) {
  let title = []
  let particularAttr = { ...usefulAttr['杜林'] }
  if (cons > 0 && artis.is('atk', 4)) {
    title.push('辅助')
    particularAttr.atk = 100
    particularAttr.mastery = 30
    particularAttr.dmg = 80
  }
  if (title.length > 0) {
    return def(particularAttr, title)
  }
  return def(usefulAttr['杜林'])
}
