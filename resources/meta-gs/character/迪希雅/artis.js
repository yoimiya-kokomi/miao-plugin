export default function ({ attr, artis, rule, def }) {
  if (artis.is('hp', '3,4,5') && attr.hp > 40000 && attr.cpct * 2 + attr.cdmg < 100) {
    // 血牛迪希雅，其余词缀权重不高于41.84，确保小生命命中副词缀最高权重
    return rule('迪希雅-血牛', { hp: 100, atk: 30, cpct: 41, cdmg: 41, recharge: 30 })
  }
  return def({ hp: 75, atk: 75, cpct: 100, cdmg: 100, dmg: 100, phy: 0, recharge: 75 })
}
