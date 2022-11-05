export const details = [{
  title: '开E后重击',
  dmg: ({ talent }, dmg) => dmg(talent.e['重击伤害'], 'a2')
}, {
  title: '断流·斩 伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['断流·斩 伤害'], 'e')
}, {
  title: '开E后Q伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害·近战'], 'q')
}, {
  title: '开E后Q蒸发',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害·近战'], 'q', 'vaporize')
}]

export const mainAttr = 'atk,cpct,cdmg,mastery'

export const buffs = ['vaporize']
