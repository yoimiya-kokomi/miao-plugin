export default function ({ attr, artis, rule, def }) {
  if (artis.is('dmg', 4) && artis.is('cpct,cdmg,def', 5) && (attr.cpct * 2 + attr.cdmg > 180)) {
    return rule('云堇-输出', { atk: 75, def: 100, cpct: 100, cdmg: 100, dmg: 100, recharge: 75 })
  }
  return def({ def: 100, cpct: 50, cdmg: 50, recharge: 90 })
}
