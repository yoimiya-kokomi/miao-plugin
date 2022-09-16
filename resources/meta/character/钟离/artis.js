export default function ({ attr, artis, rule, def }) {
  if (artis.is('hp', '3,4,5') && attr.hp > 40000 && attr.cpct * 2 + attr.cdmg < 100) {
    // 血牛钟离，其余词缀权重不高于27.89，确保小生命命中副词缀最高权重
    return rule('钟离-血牛', { hp: 100, atk: 27, cp: 27, cd: 27, recharge: 27 })
  }
  return def({ hp: 80, atk: 75, cp: 100, cd: 100, dmg: 100, phy: 50, recharge: 55 })
}
