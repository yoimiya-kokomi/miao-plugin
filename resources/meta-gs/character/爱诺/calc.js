export const details = [
  {
    title: 'E一段伤害',
    dmg: ({ talent }, dmg) => dmg(talent.e['一段伤害'], 'e')
  }, {
    title: 'E二段伤害',
    dmg: ({ talent }, dmg) => dmg(talent.e['二段伤害'], 'e')
  }, {
    title: 'Q水弹伤害',
    dmg: ({ talent }, dmg) => dmg(talent.q['水弹伤害'], 'q')
  }, {
    check: ({ cons }) => cons >= 2,
    title: '二命额外伤害',
    params: { Lunar: true },
    dmg: ({ calc, attr, talent }, { basic }) => basic(calc(attr.mastery) + 300, 'q')
  }, {
    title: '满辉月感电伤害',
    params: { Lunar: true, Moonsign: 3 },
    dmg: ({}, { reaction }) => reaction('lunarCharged')
  }, {
    title: '满辉绽放伤害',
    params: { Moonsign: 3 },
    dmg: ({}, { reaction }) => reaction('bloom')
  }
]

export const defDmgIdx = 2
export const mainAttr = 'atk,cpct,cdmg,mastery'

export const buffs = [
  {
    title: '爱诺天赋：[结构化功率提升] 元素爆发造成的伤害提升[qPlus]',
    sort: 9,
    data: {
      qPlus: ({ attr, calc }) => calc(attr.mastery) * 50 / 100
    }
  },
  {
    title: '爱诺1命：施放元素战技或元素爆发后元素精通提升[mastery]点',
    cons: 1,
    data: {
      mastery: 80
    }
  },
  {
    title: '爱诺6命：施放元素爆发后,当前场上角色触发的感电、绽放、月感电、月绽放造成的伤害提升[lunarBloom]%',
    cons: 6,
    data: {
      electroCharged: 35,
      bloom: 35,
      lunarCharged: 35,
      lunarBloom: 35
    }
  }
]
