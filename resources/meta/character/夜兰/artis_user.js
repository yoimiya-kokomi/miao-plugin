export default function ({ attr, weapon, rule, def }) {
  // 小蒸一下夜兰
  if (attr.mastery > 100 && weapon.name === '若水') {
    return rule('夜兰-蒸发', { hp: 100, cp: 100, cd: 100, mastery: 75, dmg: 100, recharge: 35 })
  }
  if (weapon.name === '若水') {
    return rule('夜兰-若水', { hp: 100, cp: 100, cd: 100, dmg: 100, recharge: 35 })
  }
  if (weapon.name === '西风猎弓') {
    return rule('夜兰-西风', { hp: 80, cp: 100, cd: 100, dmg: 100, recharge: 55 })
  }
  return def({ hp: 80, cp: 100, cd: 100, dmg: 100, recharge: 35 })
}
