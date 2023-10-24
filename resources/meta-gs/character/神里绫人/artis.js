export default function ({ attr, rule, def }) {
  // 蒸发绫人，具体数值待定
  if (attr.mastery > 120) {
    return rule('绫人-精通', { hp: 45, atk: 60, cpct: 100, cdmg: 100, mastery: 60, dmg: 100, recharge: 30 })
  }
  return def({ hp: 50, atk: 75, cpct: 100, cdmg: 100, dmg: 100, recharge: 30 })
}
