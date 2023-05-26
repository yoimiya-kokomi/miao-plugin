export const details = [{
  title: 'A普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: 'E战技伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: 'E反击伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['反击伤害'], 'e')
}, {
  title: 'Q反击伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['伤害倍率提高'] + talent.t['反击伤害'], 't')
}]

export const mainAttr = 'atk,cpct,cdmg,speed'

export const buffs = [{
  title: '克拉拉2命：施放终结技后攻击力提高30%',
  cons: 2,
  data: {
    atkPct: 30
  }
}, {
  title: '行迹-复仇：史瓦罗的反击造成的伤害提高30%',
  tree: 3,
  data: {
    tDmg: 30
  }
}]
