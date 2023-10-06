export const details = [{
  title: 'Q每跳治疗量',
  dmg: ({ attr, calc, talent, cons }, { heal }) => {
    let num = talent.q['不倒貉貉治疗量2'][0] * calc(attr.atk) / 100 + talent.q['不倒貉貉治疗量2'][1] * 1
    if (cons * 1 === 6) {
      num += Math.min(calc(attr.mastery) * 3, 6000)
    }
    return heal(num)
  }
}, {
  title: '扩散反应伤害',
  dmg: ({}, { reaction }) => reaction('swirl')
}]

export const mainAttr = 'atk,cpct,cdmg,mastery'

export const buffs = [{
  title: '早柚6命：基于精通提升Q [qPct]伤害，[_heal]治疗量',
  cons: 6,
  sort: 9,
  data: {
    qPct: ({ attr, calc }) => Math.min(calc(attr.mastery) * 0.002, 400),
    _heal: ({ attr, calc }) => Math.min(calc(attr.mastery) * 3, 6000)
  }
}]
