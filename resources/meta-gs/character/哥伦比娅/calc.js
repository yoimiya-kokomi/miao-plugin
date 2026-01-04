export const details = [
  {
    params: { Gravity_Interference: true },
    title: '满buff 特殊重击「月露涤荡」三段总伤害',
    dmg: ({ attr, calc, talent } , { basic }) => basic(calc(attr.hp) * talent.a['月露涤荡伤害'] / 100, '', 'lunarBloom')
  },
  {
    title: 'E技能伤害',
    dmg: ({ attr, calc, talent } , { basic }) => basic(calc(attr.hp) * talent.e['技能伤害'] / 100, 'e')
  },
  {
    params: { Gravity_Interference: true },
    title: '满buff 引力涟漪·持续伤害',
    dmg: ({ attr, calc, talent } , { basic }) => basic(calc(attr.hp) * talent.e['引力涟漪·持续伤害'] / 100, 'e')
  },
  {
    params: { q: true, Gravity_Interference: true, Moonsign_Benediction: true },
    title: '满buff 引力干涉·月感电伤害',
    dmg: ({ attr, calc, talent } , { basic }) => basic(calc(attr.hp) * talent.e['引力干涉·月感电伤害'] / 100, '', 'lunarCharged')
  },
  {
    params: { q: true, Gravity_Interference: true, Moonsign_Benediction: true },
    title: '满buff 引力干涉·月绽放伤害',
    dmg: ({ attr, calc, talent } , { basic }) => basic(calc(attr.hp) * talent.e['引力干涉·月绽放伤害'] / 100, '', 'lunarBloom')
  },
  {
    params: { q: true, Gravity_Interference: true, Moonsign_Benediction: true },
    title: '满buff 引力干涉·月结晶伤害',
    dmg: ({ attr, calc, talent } , { basic }) => basic(calc(attr.hp) * talent.e['引力干涉·月结晶伤害'] / 100, '', 'lunarCrystallize')
  },
  {
    params: { q: true, Gravity_Interference: true, Moonsign_Benediction: true, cons_4: 'lunarCharged' },
    title: '4命满buff 引力干涉·月感电伤害',
    cons: 4,
    dmg: ({ attr, calc, talent } , { basic }) => basic(calc(attr.hp) * talent.e['引力干涉·月感电伤害'] / 100, '', 'lunarCharged')
  },
  {
    params: { q: true, Gravity_Interference: true, Moonsign_Benediction: true, cons_4: 'lunarBloom'  },
    title: '4命满buff 引力干涉·月绽放伤害',
    cons: 4,
    dmg: ({ attr, calc, talent } , { basic }) => basic(calc(attr.hp) * talent.e['引力干涉·月绽放伤害'] / 100, '', 'lunarBloom')
  },
  {
    params: { q: true, Gravity_Interference: true, Moonsign_Benediction: true, cons_4: 'lunarCharged'  },
    title: '4命满buff 引力干涉·月结晶伤害',
    cons: 4,
    dmg: ({ attr, calc, talent } , { basic }) => basic(calc(attr.hp) * talent.e['引力干涉·月结晶伤害'] / 100, '', 'lunarCrystallize')
  }
]

export const defDmgIdx = 4
export const mainAttr = 'atk,cpct,cdmg,mastery'
export const defParams = { Moonsign: 2 }

export const buffs = [
  {
    check: ({ params }) => params.q === true,
    title: '哥伦比娅元素爆发：施放元素爆发后，月曜反应伤害将会提升[lunarBloom]%',
    data: {
      lunarBloom: ({ talent }) => talent.q['月曜反应伤害提升'],
      lunarCharged: ({ talent }) => talent.q['月曜反应伤害提升'],
      lunarCrystallize: ({ talent }) => talent.q['月曜反应伤害提升']
    }
  },
  {
    check: ({ params }) => params.Gravity_Interference === true,
    title: '哥伦比娅天赋：触发引力干涉时，使自身的暴击率最高提升[cpct]%',
    data: {
      cpct: 5 * 3
    }
  },
  {
    check: ({ params }) => params.Moonsign_Benediction === true,
    title: '哥伦比娅天赋：基于哥伦比娅的生命值上限，对队伍中角色造成的月曜反应提升[fypct]%的基础伤害',
    sort: 9,
    data: {
      fypct: ({ attr, calc }) => Math.min(Math.floor(calc(attr.hp) / 1000) * 0.2, 7)
    }
  },
  {
    title: '哥伦比娅1命：月曜反应伤害擢升[elevated]%',
    cons: 1,
    data: {
      elevated: 1.5
    }
  },
  {
    title: '哥伦比娅2命：月曜反应伤害擢升[elevated]%。触发引力干涉时，生命值提升[hpPct]%',
    cons: 2,
    data: {
      elevated: 7,
      hpPct: 40
    }
  },
  {
    title: '哥伦比娅3命：月曜反应伤害擢升[elevated]%',
    cons: 3,
    data: {
      elevated: 1.5
    }
  },
  {
    title: '哥伦比娅4命：月曜反应伤害擢升[elevated]%',
    cons: 4,
    data: {
      elevated: 1.5
    }
  },
  {
    check: ({ params }) => params.cons_4 != null,
    title: '哥伦比娅4命：触发引力干涉时，造成的月曜反应伤害提升，提升值为[fyplus]%',
    cons: 4,
    data: {
      fyplus: ({ attr, calc, params }) => calc(attr.hp) * (params.cons_4 === 'lunarCharged' ? 12.5 : 2.5) / 100
    }
  },
  {
    title: '哥伦比娅5命：月曜反应伤害擢升[elevated]%',
    cons: 5,
    data: {
      elevated: 1.5
    }
  },
  {
    title: '哥伦比娅6命：月曜反应伤害擢升[elevated]%。触发月曜反应后的8秒内，依据参与反应的元素类型，对应元素类型伤害的暴击伤害提升[cdmg]%。',
    cons: 6,
    data: {
      elevated: 7,
      cdmg: 80
    }
  }
]

export const createdBy = '冰翼'
