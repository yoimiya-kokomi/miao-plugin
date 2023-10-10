export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '战技伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: '战技伤害(含标记)',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'] * 2, 'e')
}, {
  title: '反击伤害',
  dmg: ({ talent }, dmg) => dmg(talent.t['反击伤害'], 't')
}, {
  title: '强化反击伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['伤害倍率提高'] + talent.t['反击伤害'], 't')
}]

export const defDmgIdx = 4
export const mainAttr = 'atk,cpct,cdmg'

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
