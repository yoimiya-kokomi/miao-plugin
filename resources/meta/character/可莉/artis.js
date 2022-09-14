export default function ({ attr, weapon, rule, def }) {
  // 蒸发可莉，具体数值待定
  if (attr.mastery < 80) {
    return rule('可莉-纯火', { atk: 75, cp: 100, cd: 100, dmg: 100, recharge: 30 })
  }
  return def({ atk: 75, cp: 100, cd: 100, mastery: 75, dmg: 100, recharge: 30 })
}