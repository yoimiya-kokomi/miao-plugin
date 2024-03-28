export default function ({ attr, weapon, artis, rule, def }) {
  let title = []
  let mastery = 60
  if (weapon.name === '圣显之钥') {
      // 绽放妮露，其余词缀权重不高于41.84，确保小生命命中副词缀最高权重
      title.push('专武')
      mastery = 40
  }
  if (artis.is('hp', '3,4,5') && attr.hp > 40000&& attr.cpct * 2 + attr.cdmg < 150) {
    return rule(`妮露-${title.join('')}绽放`, { hp: 100, mastery, recharge: 25 })
  }
  return def({ hp: 75, atk: 75, cpct: 100, cdmg: 100, dmg: 100, recharge: 75 })
}