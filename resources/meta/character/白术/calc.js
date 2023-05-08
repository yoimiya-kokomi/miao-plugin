export const details = [{
  title: '游丝徵灵治疗量',
  dmg: ({ talent, calc, attr }, { heal }) => heal(calc(attr.hp) * talent.e['治疗量2'][0] / 100 + talent.e['治疗量2'][1])
}, {
  title: '2命游丝徵灵·切治疗量',
  dmg: ({ talent, calc, attr }, { heal }) => heal((calc(attr.hp) * talent.e['治疗量2'][0] / 100 + talent.e['治疗量2'][1]) * 1.2)
}, {
  title: 'Q每跳治疗量',
  dmg: ({ talent, calc, attr }, { heal }) =>
    heal(talent.q['无郤气护盾治疗量2'][0] * calc(attr.hp) / 100 + talent.q['无郤气护盾治疗量2'][1])
}, {
  title: 'Q每跳护盾吸收量',
  dmg: ({ talent, calc, attr }, { shield }) => shield(talent.q['无郤气护盾吸收量2'][0] * calc(attr.hp) / 100 + talent.q['无郤气护盾吸收量2'][1])
}]

export const mainAttr = 'atk,hp,cpct,cdmg'

export const buffs = []
