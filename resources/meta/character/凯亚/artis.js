export default function ({ attr,artis, weapon, rule, def }) {
  let recharge_score = 0
  if (attr.recharge > 145) {
    recharge_score = 50
  }
    
  if (artis.is('冰套4')) {
    return rule('凯亚-冰套', { atk: 75, cp: 100, cd: 100,  dmg: 100, recharge: recharge_score })
  }
  if (attr.mastery > 90) {
    return rule('凯亚-融化', { atk: 75, cp: 100, cd: 100, mastery: 75, dmg: 100, recharge: recharge_score })
  }
  if (attr.recharge > 145) {
    return rule('凯亚-充能', { atk: 75,  cp: 100, cd: 100, dmg: 100,  recharge: recharge_score })
  }
  
  return def({atk: 75, def: 0, cp: 100, cd: 100, dmg: 100, recharge: 0})
}
