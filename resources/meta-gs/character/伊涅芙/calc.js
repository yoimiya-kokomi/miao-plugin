export const details = [{
  title: `E伤害`,
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: `E放电伤害`,
  dmg: ({ talent }, dmg) => dmg(talent.e['薇尔琪塔放电伤害'], 'e')
}, {
  title: `E护盾吸收量`,
  dmg: ({ talent, calc, attr }, { shield }) => shield(talent.e['护盾吸收量2'][0] * calc(attr.atk) / 100 + talent.e['护盾吸收量2'][1])
}, {
  title: `Q伤害`,
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}, {
  title: `单人天赋附加伤害`,
  params: { Lunar: true },
  dmg: ({ calc, attr }, { basic }) => basic(calc(attr.atk) * 65 / 100, '', 'lunarCharged')
}, {
  title: '单人月感电伤害',
  params: { Lunar: true },
  dmg: ({}, { reaction }) => reaction('lunarCharged')
}, {
  check: ({ cons }) => cons >= 2,
  title: `单人2命附加伤害`,
  params: { Lunar: true },
  dmg: ({ calc, attr }, { basic }) => basic(calc(attr.atk) * 300 / 100, '', 'lunarCharged')
}, {
  check: ({ cons }) => cons >= 6,
  title: `单人6命附加伤害`,
  params: { Lunar: true },
  dmg: ({ calc, attr }, { basic }) => basic(calc(attr.atk) * 135 / 100, '', 'lunarCharged')
}]

export const defDmgIdx = 4
export const mainAttr = 'atk,cpct,cdmg,mastery'

export const buffs = [{
  title: '伊涅芙天赋：施放元素爆发后元素精通提升[mastery]',
  data: {
    mastery: ({ attr, calc }) => calc(attr.atk) * 6 / 100
  }
}, {
  check: ({ params }) => params.Lunar === true,
  title: '伊涅芙天赋：触发感电反应时转为触发月感电反应,基础伤害提升[fypct]%',
  data: {
    fypct: ({ attr, calc }) => Math.min((calc(attr.atk) / 100 * 0.7), 14)
  }
}, {
  check: ({ params }) => params.Lunar === true,
  title: '伊涅芙1命：展开护盾时月感电反应伤害提升[lunarCharged]%',
  cons: 1,
  data: {
    lunarCharged: ({ attr, calc }) => Math.min((calc(attr.atk) / 100 * 2.5), 50)
  }
}]

export const createdBy = 'liangshi'
