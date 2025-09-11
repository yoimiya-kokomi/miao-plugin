export const details = [{
    title: 'E伤害',
    dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
  },
  {
    title: 'Q释放伤害',
    dmg: ({ talent }, dmg) => dmg(talent.q['禁限区域生成伤害'], 'q')
  },
  {
    title: 'Q领域进入伤害',
    dmg: ({ talent }, dmg) => dmg(talent.q['禁限区域踏入伤害'], 'q')
  },
  {
    title: '离场引爆领域伤害',
    dmg: ({}, dmg) => dmg(200, 'q')
  }
]

export const defDmgIdx = 1
export const mainAttr = 'atk,dmg,cpct,cdmg,mastery'

