export default function ({ attr, weapon, rule, def }) {
  if (weapon.name === '薙草之稻光' && weapon.affix >= 3) {
    return rule('香菱-高精', { hp: 0, atk: 60, def: 0, cp: 100, cd: 100, mastery: 70, dmg: 100, phy: 0, recharge: 75, heal: 0 })
  }
  return def({ hp: 0, atk: 70, def: 0, cp: 100, cd: 100, mastery: 70, dmg: 100, phy: 0, recharge: 70, heal: 0 })
}