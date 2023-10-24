export const details = [{
  title: '霰步E后重击总伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['重击伤害'], 'a2')
}, {
  title: '神里流·冰华 伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: '神里流·霜灭 单段伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['切割伤害'], 'q')
}]

export const mainAttr = 'atk,cpct,cdmg'
export const defDmgIdx = 2

export const buffs = [{
  passive: 1,
  title: '神里被动：释放E后普攻与重击伤害提高30%',
  data: {
    aDmg: 30,
    a2Dmg: 30
  }
}, {
  passive: 2,
  title: '神里被动：霰步命中敌人获得18%冰伤加成',
  data: {
    dmg: 18
  }
}, {
  cons: 4,
  title: '神里4命：元素爆发后敌人防御力降低30%',
  data: {
    qDef: 30
  }
}, {
  cons: 6,
  title: '神里6命：每10秒重击伤害提高[a2Dmg]%',
  data: {
    a2Dmg: 298
  }
}]
