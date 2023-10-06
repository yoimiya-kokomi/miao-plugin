export default function ({ attr, artis, rule, def }) {
  if (attr.cpct * 2 + attr.cdmg >= 180 && artis.is('dmg', 4)) {
    return rule('芭芭拉-暴力', { hp: 50, atk: 75, cpct: 100, cdmg: 100, mastery: 75, dmg: 100, recharge: 30, heal: 50 })
  }
  return def({ hp: 100, atk: 50, cpct: 50, cdmg: 50, dmg: 80, recharge: 55, heal: 100 })
}
