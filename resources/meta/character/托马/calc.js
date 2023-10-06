export const details = [{
  title: 'E基础护盾量',
  dmg: ({ attr, calc, talent }, { shield }) =>
    shield(talent.e['护盾吸收量2'][0] * calc(attr.hp) / 100 + talent.e['护盾吸收量2'][1] * 1)
}, {
  title: 'E最大护盾量',
  params: { e: true },
  dmg: ({ attr, calc, talent }, { shield }) =>
    shield(talent.e['护盾吸收量上限2'][0] * calc(attr.hp) / 100 + talent.e['护盾吸收量上限2'][1] * 1)
}, {
  title: 'Q每段伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['炽火崩破伤害'], 'q')
}]

export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '托马被动：5层Buff提高护盾强效25%',
  data: {
    shieldPlus: ({ params }) => params.e ? 25 : 0
  }
}, {
  title: '托马被动：Q每段伤害提高[qPlus]',
  sort: 9,
  data: {
    qPlus: ({ calc, attr }) => calc(attr.hp) * 0.022
  }
}]
