export const details = [{
  title: 'E刹那之花伤害',
  dmg: ({ talent, attr }, { basic }) => {
    let ret = talent.e['刹那之花伤害'] * attr.def / 100
    return basic(ret, 'e')
  }
}, {
  title: 'E刹那之花(打半血)',
  params: {
    half: true
  },
  dmg: ({ talent, attr }, { basic }) => {
    let ret = talent.e['刹那之花伤害'] * attr.def / 100
    return basic(ret, 'e')
  }
}, {
  title: 'Q总伤害',
  check: ({ cons }) => cons < 2,
  dmg: ({ talent }, dmg) => dmg(talent.q['爆发伤害'] + talent.q['生灭之花伤害'] * 7, 'q')
}, {
  title: '满BuffQ总伤害',
  params: { cons_2 : true },
  cons: 2,
  dmg: ({ talent }, dmg) => dmg(talent.q['爆发伤害'] + talent.q['生灭之花伤害'] * 7, 'q')
}, {
  title: '后台满buff自动施放生灭之花总伤害',
  cons: 2,
  dmg: ({ cons, calc, attr }, { basic }) => basic(3 * calc(attr.def) * (cons < 6 ? 300 : 550) / 100, 'q')
}]

export const defDmgIdx = 1
export const mainAttr = 'def,atk,cpct,cdmg'

export const buffs = [{
  title: '阿贝多被动：刹那之花对生命值低于50%的敌人造成的伤害提高25%',
  data: {
    eDmg: ({ params }) => params.half ? 25 : 0
  }
}, {
  check: ({ params }) => params.half === true,
  title: '阿贝多天赋：若场上存在由阿贝多自己创造的瑰银，还会提升刹那之花对生命值低于50%的敌人造成的伤害，提升值相当于阿贝多防御力的240%',
  sort: 9,
  data: {
    ePlus: ({ calc, attr }) => calc(attr.def) * 240 / 100
  }
}, {
  title: '阿贝多天赋：获得【魔导·秘仪】效果时，炼成阳华和瑰银后的20秒内，提升元素战技和元素爆发造成的伤害，每1000点防御力都将提升14%伤害。当前共提升[eDmg]%',
  sort: 9,
  data: {
    eDmg: ({ calc, attr }) => Math.min(Math.floor(calc(attr.def) / 1000) * 14, 42),
    qDmg: ({ calc, attr }) => Math.min(Math.floor(calc(attr.def) / 1000) * 14, 42)
  }
}, {
  title: '阿贝多1命：施放元素战技后的20秒内，自身的防御力提升[defPct]%',
  data: {
    defPct: 50
  }
}, {
  check: ({ params }) => params.cons_2 === true,
  title: '阿贝多2命：4层Buff提高Q [qPlus]伤害',
  cons: 2,
  sort: 9,
  data: {
    qPlus: ({ calc, attr }) => calc(attr.def) * 240 / 100
  }
}]
