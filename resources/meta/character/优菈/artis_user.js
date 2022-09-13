export default function ({ attr, weapon, rule, def }) {
  // 优菈核爆
  if (attr.cpct < 30) {
    return rule('优菈-核爆', { atk: 75, cp: 0, cd: 100, mastery: 0, dmg: 100, recharge: 0 })
  }
  return def({ hp: 0, atk: 75, def: 0, cp: 100, cd: 100, mastery: 0, dmg: 40, phy: 100, recharge: 40, heal: 0 })
}