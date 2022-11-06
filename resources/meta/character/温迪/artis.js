export default function ({ attr, rule, def }) {
  if (attr.recharge > 240) {
    return rule('温迪-充能', { atk: 75, cpct: 100, cdmg: 100, mastery: 75, dmg: 100, recharge: 100 })
  }
  return def({ atk: 75, cpct: 100, cdmg: 100, mastery: 75, dmg: 100, recharge: 75 })
}