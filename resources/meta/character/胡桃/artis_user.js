export default function ({ attr, weapon, rule, def, cons }) {
  // 核爆胡桃，具体数值待定
  let hp_base = 75
  if (weapon.name === '护摩之杖' && weapon.affix >= 1){
      hp_base = hp_base + (weapon.affix-1)*2.5
  }
  if (cons>=3){
      hp_base = hp_base + 5
  }
  
  if (attr.cpct < 30) {
    return rule('胡桃-核爆', { hp: hp_base, atk: 25, def: 0, cp: 0, cd: 100, mastery: 80, dmg: 100, phy: 0, recharge: 0, heal: 0 })
  }
  return def({ hp: hp_base, atk: 30, def: 0, cp: 100, cd: 100, mastery: 75, dmg: 100, phy: 0, recharge: 0, heal: 0 })
}
