export default function ({ attr, artis, rule, def }) {
  if (artis.is('hp', '3,4,5') && attr.hp > 40000 && attr.cpct * 2 + attr.cdmg < 100) {
    // 血牛钟离，其余词缀权重不高于41.84，确保小生命命中副词缀最高权重
    return rule('钟离-血牛', { hp: 100, atk: 30, cpct: 41, cdmg: 41, recharge: 30 })
  }
  return def({ hp: 80, atk: 75, cpct: 100, cdmg: 100, dmg: 80, phy: 80, recharge: 55 })
}
