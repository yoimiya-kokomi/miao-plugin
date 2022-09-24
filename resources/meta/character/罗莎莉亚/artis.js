export default function ({ attr,artis, rule, def }) {
  // 融化罗莎莉亚，具体数值待定
    let recharge_score = 0
  if (attr.recharge > 150) {
    recharge_score = 75
  }
  if (artis.is('冰套4')) {
    return rule('罗莎-冰套', { atk: 75, cp: 100, cd: 100, dmg: 100, recharge: recharge_score})
  }
  
  if (attr.mastery > 100) {
    return rule('罗莎-融化', { atk: 75, cp: 100, cd: 100, mastery: 75, dmg: 100, recharge: recharge_score })
  }
  if (attr.recharge > 150) {
    return rule('罗莎-充能', { atk: 75, cp: 100, cd: 100, mastery: 0, dmg: 100, recharge: 75 })
  }
  return def({ atk: 75, cp: 100, cd: 100, dmg: 100,recharge: recharge_score})
}
