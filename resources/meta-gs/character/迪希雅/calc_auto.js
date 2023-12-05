export const details = [{
  title: '单人E释放伤害',
  params: { team: false, e2: false },
  dmg: ({ talent }, dmg) => dmg(talent.e['净焰昂藏伤害'], 'e')
}, {
  title: '单人E协同伤害',
  params: { team: false, e2: true },
  dmg: ({ talent, calc, attr, cons }, { basic }) => {
    const td = talent.e['领域伤害2']
    const hp = calc(attr.hp)
    const atk = calc(attr.atk)
    return basic(td[0] * atk / 100 + td[1] * hp / 100, 'e')
  }
}, {
  title: '单人Q炽鬃拳伤害',
  params: { team: false },
  dmg: ({ talent, calc, attr, cons }, { basic }) => {
    const td = talent.q['炽鬃拳伤害2']
    const hp = calc(attr.hp)
    const atk = calc(attr.atk)
    return basic(td[0] * atk / 100 + td[1] * hp / 100, 'q')
  }
}, {
  title: '组队E释放伤害',
  params: { team: true, e2: false },
  dmg: ({ talent }, dmg) => dmg(talent.e['净焰昂藏伤害'], 'e')
}, {
  title: '组队E协同伤害',
  params: { team: true, e2: true },
  dmg: ({ talent, calc, attr, cons }, { basic }) => {
    const td = talent.e['领域伤害2']
    const hp = calc(attr.hp)
    const atk = calc(attr.atk)
    return basic(td[0] * atk / 100 + td[1] * hp / 100, 'e')
  }
}, {
  title: '组队Q炽鬃拳伤害',
  params: { team: true },
  dmg: ({ talent, calc, attr, cons }, { basic }) => {
    const td = talent.q['炽鬃拳伤害2']
    const hp = calc(attr.hp)
    const atk = calc(attr.atk)
    return basic(td[0] * atk / 100 + td[1] * hp / 100, 'q')
  }
}, {
  title: '组队Q炽鬃拳蒸发伤害',
  params: { team: true },
  dmg: ({ talent, calc, attr, cons }, { basic }) => {
    const td = talent.q['炽鬃拳伤害2']
    const hp = calc(attr.hp)
    const atk = calc(attr.atk)
    return basic(td[0] * atk / 100 + td[1] * hp / 100, 'q', '蒸发')
  }
}]

export const defDmgIdx = 5
export const mainAttr = 'hp,atk,cpct,cdmg'

export const defParams = {
  team: true,
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
}, {
  check: ({ params }) => params.team === true,
  title: '风鹰宗室班+双火：增加[atkPlus]点攻击力与[atkPct]%攻击力,获得[dmg]%增伤',
  data: {
    atkPct: 25,
    dmg: 15,
    atkPlus: 1202.35
  }
}, {
  check: ({ params , artis }) => params.team === true && artis.昔日宗室之仪 !== 4 ,
  title: '班尼特-昔日宗室之仪：增加攻击[atkPct]%',
  data: {
    atkPct: 20
  }
}, {
  check: ({ cons, params }) => cons <= 1 && params.team === true,
  title: '精1苍古0命万叶：获得[dmg]%增伤(苍古普攻16增伤)，增加[atkPct]%攻击,减抗[kx]%',
  data: {
    aDmg: 16,
    a2Dmg: 16,
    a3Dmg: 16,
    dmg: 40,
    atkPct: 20,
    kx: 40
  }
}, {
  check: ({ cons, params }) => ((cons < 6 && cons > 1) && params.team === true),
  title: '精1苍古2命万叶：获得[dmg]%增伤(苍古普攻16增伤)，增加[atkPct]%攻击,减抗[kx]%,精通[mastery]',
  data: {
    aDmg: 16,
    a2Dmg: 16,
    a3Dmg: 16,
    dmg: 48,
    atkPct: 20,
    kx: 40,
    mastery: 200
  }
}, {
  check: ({ cons, params }) => (cons >= 6 && params.team === true),
  title: '精5苍古6命万叶：获得[dmg]%增伤(苍古普攻32增伤)，增加[atkPct]%攻击,减抗[kx]%,精通[mastery]',
  data: {
    aDmg: 32,
    a2Dmg: 32,
    a3Dmg: 32,
    dmg: 48,
    atkPct: 40,
    kx: 40,
    mastery: 200
  }
}, {
  check: ({ cons, params }) => (cons >= 2 && params.team === true),
  title: '讨龙千岩满命莫娜：获得[dmg]%增伤,暴击[cpct]%,攻击[atkPct]%',
  data: {
    dmg: 60,
    vaporize: 15,
    cpct: 15,
    atkPct: 68
  }
}, {
  check: ({ cons, params }) => (cons < 2 && params.team === true),
  title: '讨龙千岩0命莫娜：获得[dmg]%增伤,攻击[atkPct]%',
  data: {
    dmg: 60,
    atkPct: 68
  }
}, 'vaporize']
