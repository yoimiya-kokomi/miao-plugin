export default function ({ attr, weapon, rule, def }) {
  let title = []
  let mastery = 0
  let hp = 80
  if (attr.mastery > 80) {
    title.push('精通')
    mastery = 75
  }
  if (weapon.name === '若水') {
    title.push('若水')
    hp = 100
  }
  if (title.length > 0) {
    return rule(`夜兰-${title.join('')}`, { hp, cpct: 100, cdmg: 100, mastery, dmg: 100, recharge: 75 })
  }
  return def({ hp: 80, cpct: 100, cdmg: 100, dmg: 100, recharge: 75 })
}
