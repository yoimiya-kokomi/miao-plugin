export const details = [{
  title: 'Q施放治疗量',
  dmg: ({ talent, calc, attr }, { heal }) => heal(talent.q['施放治疗量2'][0] * calc(attr.hp) / 100 + talent.q['施放治疗量2'][1])
}, {
  title: '鹰翎治疗量',
  dmg: ({ talent, calc, attr }, { heal }) => heal(talent.q['鹰翎治疗量2'][0] * calc(attr.hp) / 100 + talent.q['鹰翎治疗量2'][1])
}]

export const mainAttr = 'hp,cpct,cdmg'

export const buffs = []
