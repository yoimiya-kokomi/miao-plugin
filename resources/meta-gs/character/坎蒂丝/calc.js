export const details = [{
  title: 'E护盾吸收',
  dmg: ({ attr, calc, talent }, { shield }) =>
    shield(calc(attr.hp) * talent.e['护盾吸收量2'][0] / 100 + talent.e['护盾吸收量2'][1])
}, {
  title: '蓄力E伤害',
  dmg: ({ calc, attr, talent }, { basic }) => basic(calc(attr.hp) * talent.e['蓄力完成伤害'] / 100)
}, {
  title: 'Q提升普攻伤害',
  dmg: ({ attr, calc }) => {
    return {
      avg: 20 + Math.floor(calc(attr.hp) / 1000) * 0.5,
      unit: '%'
    }
  }
}]

export const mainAttr = 'hp,atk,cpct,cdmg'

export const buffs = [{
  title: '坎蒂丝2命：E命中敌人提升20%生命值',
  cons: 2,
  data: {
    hpPct: 20
  }
}, {
  title: '坎蒂丝被动：Q伤害加成基于生命值上限提升[_a]%',
  sort: 9,
  data: {
    _a: ({ attr, calc }) => Math.floor(calc(attr.hp) / 1000) * 0.5
  }
}]
