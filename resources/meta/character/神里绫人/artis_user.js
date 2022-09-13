export default function ({ attr, weapon, rule, def }) {
  //蒸发绿剑绫人
  if (weapon.name === '磐岩结绿' && weapon.affix >= 1 && attr.mastery > 60) {
    let temp = 35 + 5*weapon.affix
    return rule('绫人-绿剑', { hp: temp, atk: 60, cp: 100, cd: 100, mastery: 60, dmg: 100, recharge: 0 })
  }
  // 蒸发绫人，具体数值待定
  if (attr.mastery > 60) {
    return rule('绫人-蒸发', { hp: 45,atk: 60, cp: 100, cd: 100, mastery: 60, dmg: 100, recharge: 0 })
  }
  // 
  if (weapon.name === '磐岩结绿' && weapon.affix >= 1) {
    let temp = 35 + 5*weapon.affix
    return rule('绫人-绿剑', { hp: temp, atk: 60, cp: 100, cd: 100, mastery: 0, dmg: 100, recharge: 0 })
  }
  return def({ hp: 45, atk: 75, def: 0, cp: 100, cd: 100, mastery: 0, dmg: 100})
}
