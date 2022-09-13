export default function ({ attr, weapon, rule, def }) {
  // 辅助精通雷神，具体数值待定
  if (weapon.name === '西风长枪' && weapon.affix >= 1) {
    return rule('云堇-西风', { hp: 0, atk: 0, def: 100, cp: 100, cd: 0, mastery: 0, dmg: 25, phy: 0, recharge: 90, heal: 0 })
  }
  return def({ hp: 0, atk: 0, def: 100, cp: 75, cd: 0, mastery: 0, dmg: 25, phy: 0, recharge: 90, heal: 0 })
}