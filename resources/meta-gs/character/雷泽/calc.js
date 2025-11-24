export const details = [{
  title: '普攻首段伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['一段伤害'], 'a', 'phy')
}, {
  title: 'E点按技能伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['点按技能伤害'], 'e')
}, {
  title: 'E长按技能伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['长按技能伤害'], 'e')
}, {
  title: 'Q协同攻击首段',
  dmg: ({ talent }, dmg) => dmg(talent.q['狼魂伤害'] * talent.a['一段伤害'] / 100, 'q')
}, {
  title: '【魔导·秘仪】落雷伤害',
  dmg: ({ talent }, dmg) => dmg(150)
}, {
  title: '6命落雷伤害',
  cons: 6,
  dmg: ({ talent }, dmg) => dmg(100)
}]

export const buffs = [{
  title: '雷泽1命：获得元素球后8秒伤害提高10%',
  cons: 1,
  data: {
    dmg: 10,
    phy: 10
  }
}, {
  title: '雷泽4命：E点按降低敌人防御力15%',
  cons: 4,
  data: {
    enemyDef: 15
  }
}, {
  title: '雷泽6命：消耗雷之印后的15秒内，雷泽的暴击率提升[cpct]%，暴击伤害提升[cdmg]%。',
  cons: 6,
  data: {
    cpct: 10,
    cdmg: 50
  }
}]
