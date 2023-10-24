export default function ({ attr, rule, def }) {
  if (attr.mastery > 120) {
    return rule('神里-精通', { atk: 75, cpct: 100, cdmg: 100, mastery: 75, dmg: 100, recharge: 30 })
  }
  return def({ atk: 75, cpct: 100, cdmg: 100, dmg: 100, phy: 0, recharge: 30 })
}