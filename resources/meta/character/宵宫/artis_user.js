export default function ({ attr, weapon, rule, def }) {
  // 宵宫纯色流派
  if (attr.mastery < 80) {
    return rule('宵宫-纯色', { hp: 0, atk: 75, def: 0, cp: 100, cd: 100, mastery: 0, dmg: 100, phy: 0, recharge: 0, heal: 0 })
  }
  if (attr.mastery > 300) {
    return rule('宵宫-凹蒸发', { hp: 0, atk: 75, def: 0, cp: 100, cd: 100, mastery: 100, dmg: 100, phy: 0, recharge: 0, heal: 0 })
  }
  return def({ hp: 0, atk: 75, def: 0, cp: 100, cd: 100, mastery: 75, dmg: 100, phy: 0, recharge: 0, heal: 0 })
}
