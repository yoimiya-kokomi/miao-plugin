export default function ({ attr, weapon, rule, def }) {
  // 辅助精通雷神，具体数值待定
    let mastery_score = 0
  if (attr.mastery > 100) {
    mastery_score = 75
    if (weapon.name === '神乐之真意' && weapon.affix >= 3) {
      return rule('八重-高精', { atk: 75, cp: 100, cd: 100, mastery: mastery_score ,dmg: 80, recharge: 0 })
  }
    return rule('八重-激化', { atk: 75, cp: 100, cd: 100, mastery: 75, dmg: 100, recharge: 0 })
  }
    if (weapon.name === '神乐之真意' && weapon.affix >= 3) {
      return rule('八重-高精', { atk: 75, cp: 100, cd: 100, mastery: mastery_score ,dmg: 80, recharge: 0 })
  }
  
  return def({ hp: 0, atk: 75, def: 0, cp: 100, cd: 100, mastery: 75, dmg: 100, phy: 0, recharge: 0, heal: 0 })
}
