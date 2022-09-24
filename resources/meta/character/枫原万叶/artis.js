export default function ({ attr, artis, rule, def }) {
  // 万叶输出流派
  if (attr.cpct * 2 + attr.cdmg > 200) {
    return rule('万叶-输出', { atk: 75, cp: 100, cd: 100, mastery: 100, dmg: 100, recharge: 55})
  }
  // 万叶纯辅助
  if (attr.cpct * 2 + attr.cdmg < 100) {
    return rule('万叶-辅助', { atk: 50, cp: 50, cd: 50, mastery: 100, recharge: 100 })
  }
  return def({ atk: 75, cp: 100, cd: 100, mastery: 75, recharge: 55 })
}
