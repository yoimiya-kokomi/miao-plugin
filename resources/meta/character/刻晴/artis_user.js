export default function ({ attr, weapon, rule, def }) {
  // 激化精通璃月雷神，具体数值待定
  if (attr.mastery > 80) {
    return rule('刻晴-激化', { atk: 60, cp: 100, cd: 100, mastery: 40, dmg: 100, recharge: 0 })
  }
  if (weapon.name === '磐岩结绿' && weapon.affix >= 1) {
    let temp = 35 + 5*weapon.affix
    return rule('刻晴-绿剑', { hp: temp, atk: 60, cp: 100, cd: 100, mastery: 40, dmg: 100, recharge: 0 })
  }
  return def({ hp: 0, atk: 75, def: 0, cp: 100, cd: 100, mastery: 0, dmg: 100, phy: 100, recharge: 0, heal: 0 })
}
