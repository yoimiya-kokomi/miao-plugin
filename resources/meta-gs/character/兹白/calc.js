export const details = [
  {
    title: '「月转时隙」普攻首段伤害',
    dmg: ({ attr, calc, talent } , { basic }) => basic(calc(attr.def) * talent.e['月转时隙一段伤害'] / 100, 'a')
  },
  {
    params: { Moonsign_Benediction: true, cons_6: true },
    title: '「月转时隙」普攻尾段额外伤害',
    dmg: ({ attr, calc, cons, talent } , { basic }) => basic(calc(attr.def) * talent.e['月转时隙第四段额外伤害'] / 100 * (cons >= 4 ? 2.5 : 1), '', 'lunarCrystallize')
  },
  {
    title: '「灵驹飞踏」第一段伤害',
    dmg: ({ attr, calc, talent } , { basic }) => basic(calc(attr.def) * talent.e['灵驹飞踏第一段伤害'] / 100, 'e')
  },
  {
    params: { skills_1: true, Moonsign_Benediction: true, cons_2: true, cons_6: true },
    title: '「灵驹飞踏」第二段伤害',
    dmg: ({ attr, calc, talent } , { basic }) => basic(calc(attr.def) * talent.e['灵驹飞踏第二段伤害'] / 100, '', 'lunarCrystallize')
  },
  {
    title: 'Q技能第一段伤害',
    dmg: ({ attr, calc, talent } , { basic }) => basic(calc(attr.def) * talent.q['技能第一段伤害'] / 100, 'q')
  },
  {
    params: { Moonsign_Benediction: true, cons_6: true },
    title: 'Q技能第二段伤害',
    dmg: ({ attr, calc, talent } , { basic }) => basic(calc(attr.def) * talent.q['技能第二段伤害'] / 100, '', 'lunarCrystallize')
  },
  {
    params: { skills_1: true, Moonsign_Benediction: true, cons_1: true, cons_6: true },
    title: '1命「灵驹飞踏」初次第二段伤害',
    dmg: ({ attr, calc, talent } , { basic }) => basic(calc(attr.def) * talent.e['灵驹飞踏第二段伤害'] / 100, '', 'lunarCrystallize')
  }
]

export const defDmgIdx = 3
export const mainAttr = 'def,cpct,cdmg,mastery'
export const defParams = { Moonsign: 2 }

export const buffs = [
  {
    check: ({ params }) => params.skills_1 === true,
    title: '兹白天赋：施放元素战技或触发月笼谐奏时，灵驹飞踏第二段攻击造成的伤害提升，提升值相当于兹白防御力的60%',
    sort: 9,
    data: {
      fyplus: ({ attr, calc }) => calc(attr.def) * 60 / 100
    }
  },
  {
    title: '兹白天赋：队伍中每存在一名元素类型为水元素的其他角色，都会使兹白的元素精通提升[mastery]点',
    data: {
      mastery: 60
    }
  },
  {
    check: ({ params }) => params.Moonsign_Benediction === true,
    title: '兹白天赋：基于兹白的防御力，对队伍中角色造成的月曜反应提升[fypct]%的基础伤害',
    sort: 9,
    data: {
      fypct: ({ attr, calc }) => Math.min(Math.floor(calc(attr.def) / 100) * 0.7, 14)
    }
  },
  {
    check: ({ params }) => params.cons_1 === true,
    title: '兹白1命：每次切换至「月转时隙」模式后，初次施放灵驹飞踏时，第二段攻击造成的月结晶反应伤害提升[lunarCrystallize]%',
    cons: 1,
    data: {
      lunarCrystallize: 220
    }
  },
  {
    check: ({ params }) => params.cons_2 === true,
    title: '兹白2命：【月兆·满辉】灵驹飞踏第二段攻击造成的伤害进一步提升，提升值相当于兹白防御力的[_fyplus]%',
    cons: 2,
    sort: 9,
    data: {
      _fyplus: ({ params }) => ((params.Moonsign || 0) >= 2 ? 550 : 0),
      fyplus: ({ attr, calc, params }) => ((params.Moonsign || 0) >= 2 ? calc(attr.def) * 550 / 100 : 0)
    }
  },
  {
    check: ({ params }) => params.cons_6 === true,
    title: '兹白6命：100点「时隙浮光」时，本次灵驹飞踏与接下来3秒内兹白造成的月结晶反应伤害擢升[elevated]%。',
    cons: 6,
    data: {
      elevated: 1.6 * (100 - 70)
    }
  }
]

export const createdBy = '冰翼'
