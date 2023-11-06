export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '战技伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: '转魄状态·战技伤害(扩散)',
  params: { strength: true },
  dmg: ({ talent }, dmg) => dmg(talent.e2['目标伤害'] + talent.e2['相邻目标伤害'] * 2, 'e')
}, {
  title: '终结技伤害(扩散)',
  params: { q: true },
  dmg: ({ talent }, dmg) => dmg(talent.q['目标伤害'] + talent.q['相邻目标伤害'] * 2, 'q')
}, {
  title: '转魄状态·终结技伤害(扩散)',
  params: { strength: true, q: true },
  dmg: ({ talent }, dmg) => dmg(talent.q['目标伤害'] + talent.q['相邻目标伤害'] * 2, 'q')
}]

export const defDmgIdx = 4
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '行迹-霜魄：转魄状态下，终结技造成的伤害提高[qDmg]%',
  tree: 3,
  check: ({ params }) => params.strength === true,
  data: {
    qDmg: 20
  }
}, {
  title: '天赋-澹月转魄：转魄状态下，暴击率提高[cpct]%，根据消耗的队友血量，最高提升攻击力[atkPlus]',
  check: ({ params }) => params.strength === true,
  data: {
    cpct: ({ talent }) => talent.t['暴击率提高'] * 100,
    atkPlus: ({ attr, talent }) => attr.atk.base * talent.t['攻击力提高上限']
  }
}, {
  title: '镜流1命：释放终结技或强化战技时，暴击伤害提高[cdmg]%',
  cons: 1,
  check: ({ params }) => params.strength === true || params.q === true,
  data: {
    cdmg: 24
  }
}, {
  title: '镜流2命：释放终结技后，下一次强化战技的伤害提高[eDmg]%',
  cons: 2,
  check: ({ params }) => params.strength === true,
  data: {
    eDmg: 80
  }
}, {
  title: '镜流4命：转魄状态下，消耗队友生命获得的攻击力额外提高[atkPlus]',
  check: ({ params }) => params.strength === true,
  cons: 4,
  data: {
    atkPlus: ({ attr }) => attr.atk.base * 0.3
  }
}, {
  title: '镜流6命：转魄状态下，暴击伤害提高[cdmg]%',
  check: ({ params }) => params.strength === true,
  cons: 6,
  data: {
    cdmg: 50
  }
}]

export const createdBy = 'Aluxes'
