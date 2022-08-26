export const details = [{
  title: 'E单次伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: 'Q爆发伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['爆发伤害'], 'q')
}, {
  title: 'Q每跳伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['跃动伤害'], 'q')
}]

export const mainAttr = 'atk,cpct,cdmg'

export const buffs = []
