export default function ({ attr, weapon, rule, def }) {
  // 优菈核爆
  if (attr.cpct < 30) {
    return rule('行秋-核爆', { atk: 75, cp: 0, cd: 100, mastery: 75, dmg: 100, recharge: 0 })
  }
  if (attr.mastery > 100) {
    return rule('行秋-蒸发', { atk: 60, cp: 100, cd: 100, mastery: 60, dmg: 100, recharge: 0 })
  }
  if (weapon.name === '磐岩结绿' && weapon.affix >= 1 &&attr.mastery > 100) {
    let temp = 15 + 5*weapon.affix
    return rule('行秋-绿剑', { hp: temp, atk: 60, cp: 100, cd: 100, mastery: 40, dmg: 100, recharge: 0 })
  }
  if (weapon.name === '磐岩结绿' && weapon.affix >= 1) {
    let temp = 15 + 5*weapon.affix
    return rule('行秋-绿剑', { hp: temp, atk: 60, cp: 100, cd: 100, mastery: 0, dmg: 100, recharge: 0 })
  }
  return def({ hp: 0, atk: 75, def: 0, cp: 100, cd: 100, mastery: 0, dmg: 100, phy: 100, recharge: 40, heal: 0 })
}