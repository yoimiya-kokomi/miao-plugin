export const details = [{
  title: 'E每跳治疗量',
  dmg: ({ talent, calc, attr }, { heal }) => heal(calc(attr.hp) * talent.e['治疗量2'][0] / 100 + talent.e['治疗量2'][1])
}, {
  title: '2命·E+额外治疗量',
  cons: 2,
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
