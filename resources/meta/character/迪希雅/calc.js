export const details = [{
  title: 'E释放伤害',
  params: { e2: false },
  dmg: ({ talent }, dmg) => dmg(talent.e['净焰昂藏伤害'], 'e')
}, {
  title: 'E协同伤害',
  params: { e2: true },
  dmg: ({ talent, calc, attr, cons }, { basic }) => {
    const td = talent.e['领域伤害2']
    const hp = calc(attr.hp)
    const atk = calc(attr.atk)
    return basic(td[0] * atk / 100 + td[1] * hp / 100, 'e')
  }
}, {
  title: 'Q炽鬃拳伤害',
  dmg: ({ talent, calc, attr, cons }, { basic }) => {
    const td = talent.q['炽鬃拳伤害2']
    const hp = calc(attr.hp)
    const atk = calc(attr.atk)
    return basic(td[0] * atk / 100 + td[1] * hp / 100, 'q')
  }
}, {
  title: 'Q炽鬃拳蒸发伤害',
  dmg: ({ talent, calc, attr, cons }, { basic }) => {
    const td = talent.q['炽鬃拳伤害2']
    const hp = calc(attr.hp)
    const atk = calc(attr.atk)
    return basic(td[0] * atk / 100 + td[1] * hp / 100, 'q', '蒸发')
  }
}]

export const defDmgIdx = 2
export const mainAttr = 'hp,atk,cpct,cdmg'

export const defParams = {
  e2: true
}

export const buffs = [{
  title: '迪希雅1命：生命值上限提升20%',
  cons: 1,
  data: {
    hpPct: 20
  }
}, {
  title: '迪希雅1命：基于生命值上限，e伤害提高[ePlus]，q伤害提高[qPlus]',
  cons: 1,
  sort: 9,
  data: {
    ePlus: ({ attr, calc }) => calc(attr.hp) * 0.036,
    qPlus: ({ attr, calc }) => calc(attr.hp) * 0.06
  }
}, {
  check: ({ params }) => params.e2 === true,
  title: '迪希雅2命：净焰剑狱下次协同攻击造成的伤害提升50%',
  cons: 2,
  data: {
    eDmg: 50
  }
}, {
  title: '迪希雅6命：暴击率增加10%，暴击伤害增加60%（默认叠满）',
  cons: 6,
  data: {
    cpct: 10,
    cdmg: 60
  }
}, 'vaporize']
