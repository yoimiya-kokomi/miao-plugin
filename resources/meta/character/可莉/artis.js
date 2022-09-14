export default function ({ attr, weapon, rule, def }) {
  if (attr.mastery < 50 && attr.cp * 2 + attr.cd > 320) {
    return rule('可莉-纯火', { atk: 85, cp: 100, cd: 100, dmg: 100, recharge: 55 })
  }
  return def({ atk: 75, cp: 100, cd: 100, mastery: 75, dmg: 100, recharge: 30 })
}
