export const details = [{
  title: '开Q满丹火印重击',
  params: { dhy: 15 },
  dmg: ({ talent, cons }, dmg) => dmg(talent.a['重击伤害2'][cons * 1 === 6 ? 4 : 3], 'a2')
}, {
  title: '开Q满丹火印重击蒸发',
  params: { dhy: 15 },
  dmg: ({ talent, cons }, dmg) => dmg(talent.a['重击伤害2'][cons * 1 === 6 ? 4 : 3], 'a2', 'vaporize')
}, {
  title: 'E伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: '4命护盾量',
  check: ({ cons }) => cons >= 4,
  dmg: ({ attr, calc }, { shield }) => shield(calc(attr.hp) * 0.45)
}]

export const defDmgIdx = 1
export const mainAttr = 'atk,cpct,cdmg,mastery'

export const buffs = [{
  title: '烟绯被动：重击消耗4枚丹火印增加20%火伤',
  cons: 6,
  data: {
    a2Dmg: ({ params }) => params.dhy ? 20 : 0
  }
}, {
  title: '烟绯被动：重击消耗3枚丹火印增加15%火伤',
  check: ({ cons }) => cons < 6,
  data: {
    a2Dmg: ({ params }) => params.dhy ? 15 : 0
  }
}, {
  title: '烟绯被动：开Q后提高重击伤害[a2Dmg]%',
  data: {
    a2Dmg: ({ talent }) => talent.q['重击伤害额外加成']
  }
}, 'vaporize']
