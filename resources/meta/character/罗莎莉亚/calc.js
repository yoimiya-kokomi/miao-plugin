export const details = [{
  title: 'E两段伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: 'Q技能伤害(2段)',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}, {
  title: 'Q每跳伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['冰枪持续伤害'], 'q')
}]

export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '修女被动：从背后攻击时，暴击率提升12%',
  data: {
    cpct: 12
  }
}]
