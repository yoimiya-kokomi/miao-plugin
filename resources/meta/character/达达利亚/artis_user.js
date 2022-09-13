export default function ({ attr, weapon, rule, def }) {
  // 公子核爆
  if (attr.cpct < 30) {
    return rule('公子-核爆', { atk: 75, cp: 0, cd: 100, mastery: 75, dmg: 100, recharge: 0 })
  }
  return def({ hp: 0, atk: 75, def: 0, cp: 100, cd: 100, mastery: 75, dmg: 100, phy: 0, recharge: 0, heal: 0 })
}