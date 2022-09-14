export default function ({ attr, rule, def }) {
  // 优菈核爆
  if (attr.cpct < 15 && attr.cdmg > 200) {
    return rule('优菈-核爆', { atk: 100, cd: 100, phy: 100 })
  }
  return def({ atk: 75, cp: 100, cd: 100, phy: 100, recharge: 55 })
}
