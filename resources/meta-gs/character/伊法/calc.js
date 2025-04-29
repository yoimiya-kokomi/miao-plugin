export const details = [{
  title: 'E秘药弹伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['秘药弹伤害'], 'e,nightsoul')
}, {
  title: 'E秘药弹治疗量',
  dmg: ({ talent, attr }, { heal }) => {
    return heal(talent.e['秘药弹命中治疗量2'][0] / 100 * attr.mastery + talent.e['秘药弹命中治疗量2'][1])
  }
}, {
  title: 'Q技能伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q,nightsoul')
}, {
  title: '扩散反应伤害',
  dmg: ({}, { reaction }) => reaction('swirl')
}, {
  title: '6命额外秘药弹伤害',
  cons: 6,
  dmg: ({ attr, calc }, { basic }) => basic(calc(attr.atk) * 160 / 100, 'a,nightsoul')
}]

export const defParams = { Nightsoul: true }
export const defDmgIdx = 0
export const mainAttr = 'atk,cpct,cdmg,mastery'

export const buffs = [{
  title: '伊法4命：施放元素爆发后，伊法的元素精通提升[mastery]点',
  cons: 4,
  data: {
    mastery: 100
  }
}]

export const createdBy = '冰翼'
