export default function ({ attr, artis, rule, def }) {
  if (artis.is('dmg', 4) && artis.is('cpct,cdmg,def,atk', 5) && attr.cp * 2 + attr.cd > 180) {
    return rule('云堇-输出', { def: 100, cp: 100, cd: 100, dmg: 100, recharge: 75 })
  }
  return def({ def: 100, cp: 50, cd: 50, recharge: 90 })
}
