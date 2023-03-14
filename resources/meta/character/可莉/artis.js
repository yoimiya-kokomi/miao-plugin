export default function ({ attr, weapon, rule, def }) {
  if ( attr.mastery < 110 ) {
    return rule('可莉-纯火', { atk: 85, cpct: 100, cdmg: 100, dmg: 100, recharge: 55 })
  }
  return def({ atk: 75, cpct: 100, cdmg: 100, mastery: 75, dmg: 100, recharge: 30 })
}
