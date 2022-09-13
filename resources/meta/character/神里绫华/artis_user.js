export default function ({ attr, weapon, rule, def }) {
  // 傻逼的融化神里，具体数值待定
  if (attr.mastery > 100) {
    return rule('神里-融化', { atk: 75, cp: 100, cd: 100, mastery: 40, dmg: 100, recharge: 0 })
  }
  if (weapon.name === '磐岩结绿' && weapon.affix >= 1) {
    let temp = 15 + 5*weapon.affix
    return rule('神里-绿剑', { hp: temp, atk: 75, cp: 100, cd: 100, mastery: 0, dmg: 100, recharge: 0 })
  }
  if (attr.recharge > 120) {
    return rule('神里-充能', { atk: 75, cp: 100, cd: 100, mastery: 0, dmg: 100, recharge: 30 })
  }
  return def({ hp: 0, atk: 75, def: 0, cp: 100, cd: 100, mastery: 0, dmg: 100, phy: 100, recharge: 0, heal: 0 })
}