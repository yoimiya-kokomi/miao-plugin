export const details = [{
  title: 'E阳华伤害',
  talent: 'e',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: 'E刹那之花伤害',
  dmg: ({ talent, attr }, { basic }) => {
    let ret = talent.e['刹那之花伤害'] * attr.def / 100 + attr.e.plus
    return basic(ret, 'e')
  }
}, {
  title: 'E刹那之花(打半血)',
  params: {
    half: true
  },
  dmg: ({ talent, attr }, { basic }) => {
    let ret = talent.e['刹那之花伤害'] * attr.def / 100 + attr.e.plus
    return basic(ret, 'e')
  }
}, {
  title: 'Q总伤害',
  check: ({ cons }) => cons < 2,
  params: { buff: 0 },
  dmg: ({ talent }, dmg) => dmg(talent.q['爆发伤害'] + talent.q['生灭之花伤害'] * 7, 'q')
}, {
  title: '满BuffQ总伤害',
  cons: 2,
  dmg: ({ talent }, dmg) => dmg(talent.q['爆发伤害'] + talent.q['生灭之花伤害'] * 7, 'q')
}]

export const defDmgIdx = 1
export const mainAttr = 'def,atk,cpct,cdmg'

export const buffs = [{
  title: '阿贝多被动：刹那之花对生命值低于50%的敌人造成的伤害提高25%',
  data: {
    eDmg: ({ params }) => params.half ? 25 : 0
  }
}, {
  title: '阿贝多2命：4层Buff提高Q [qPlus]伤害',
  cons: 2,
  sort: 9,
  data: {
    qPlus: ({ params, attr }) => params.buff === 0 ? 0 : attr.def * 1.2
  }
}]
