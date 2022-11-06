export default function ({ attr, weapon, rule, def }) {
  // 辅助精通雷神，具体数值待定
  if (attr.mastery > 500) {
    return rule('雷神-精通', { atk: 75, cpct: 90, cdmg: 90, mastery: 100, dmg: 75, recharge: 90 })
  }
  if (weapon.name === '薙草之稻光' && weapon.affix >= 3) {
    return rule('雷神-高精', { atk: 90, cpct: 100, cdmg: 100, dmg: 90, recharge: 90 })
  }
  return def({ atk: 75, cpct: 100, cdmg: 100, mastery: 0, dmg: 75, recharge: 90 })
}
