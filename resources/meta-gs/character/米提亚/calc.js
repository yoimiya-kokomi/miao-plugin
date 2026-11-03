export const details = [
  {
    title: '特殊重击·递变聚爆星超导伤害',
    params: { cons_1: true, cons_2_2: true, Starsealed_Edict: true },
    dmg: ({ attr, calc, talent }, { basic }) => basic(calc(attr.mastery) * talent.a['递变聚爆星超导伤害'] / 100, '', 'stellarConduct')
  },
  {
    title: 'E稳态炉心消耗递变信标伤害',
    params: { skills_1: true, cons_2_1: true, cons_6: true, Starsealed_Edict: true },
    dmg: ({ attr, calc, talent }, { basic }) => basic(calc(attr.mastery) * talent.e['稳态炉心消耗递变信标伤害'] / 100, '', 'stellarConduct')
  },
  {
    title: '(单枚信标) E稳态炉心引爆伤害',
    params: { skills_1: true, cons_2_1: true, cons_6: true, Starsealed_Edict: true },
    dmg: ({ attr, calc, talent }, { basic }) => basic(calc(attr.mastery) * talent.e['稳态炉心引爆伤害'] / 100, '', 'stellarConduct')
  },
  {
    title: '(稳态炉心) Q技能伤害',
    params: { skills_1: true, cons_1: true, cons_2_1: true },
    dmg: ({ attr, calc, talent }, { basic }) => basic((calc(attr.atk) * talent.q['技能伤害2'][0] + calc(attr.mastery) * talent.q['技能伤害2'][1]) / 100, 'q')
  },
  {
    title: '(过载炉心) Q技能伤害',
    params: { cons_1: true, cons_2_2: true },
    dmg: ({ attr, calc, talent }, { basic }) => basic((calc(attr.atk) * talent.q['技能伤害2'][0] + calc(attr.mastery) * talent.q['技能伤害2'][1]) / 100, 'q')
  },
  {
    cons: 4,
    title: '(稳态炉心) 4命追加星超导伤害',
    params: { skills_1: true, cons_2_1: true, Starsealed_Edict: true },
    dmg: ({ attr, calc }, { basic }) => basic(calc(attr.mastery) * 300 / 100, '', 'stellarConduct')
  },
  {
    cons: 4,
    title: '(过载炉心) 4命追加星超导伤害',
    params: { cons_2_2: true, Starsealed_Edict: true },
    dmg: ({ attr, calc }, { basic }) => basic(calc(attr.mastery) * 300 / 100, '', 'stellarConduct')
  }
]

export const defDmgIdx = 0
export const mainAttr = 'mastery,cpct,cdmg'

export const buffs = [
  {
    check: ({ params }) => params.skills_1 === true,
    title: '天赋[基准承压测验]：稳态炉心存在，且递变信标携带数量达到上限时，元素精通提升[mastery]点',
    data: {
      mastery: ({ cons }) => 30 * (cons >= 1 ? 5 : 4)
    }
  },
  {
    title: '天赋[超限易爆试剂]：创造递变信标后，暴击率最高提升[cpct]%',
    data: {
      cpct: 5 * 4
    }
  },
  {
    title: '天赋[星耀祝礼·极密协议]：基于米提亚的精通，对队伍中角色造成的星超导反应提升[fypct]%的基础伤害',
    sort: 9,
    data: {
      fypct: ({ attr, calc }) => Math.min(calc(attr.mastery) * 0.028, 14)
    }
  },
  {
    cons: 1,
    check: ({ params }) => params.cons_1 === true,
    title: '米提亚1命：侦测炉心存在期间，场上角色的暴击伤害提升[cdmg]%',
    data: {
      cdmg: 40
    }
  },
  {
    cons: 2,
    title: '米提亚2命：处于极星辉域内的所有敌人雷元素抗性降低[kx]%',
    data: {
      kx: 20
    }
  },
  {
    cons: 2,
    check: ({ params }) => params.cons_2_1 === true,
    title: '米提亚2命：稳态炉心存在期间，元素精通提升[mastery]点',
    data: {
      mastery: 123
    }
  },
  {
    cons: 2,
    check: ({ params }) => params.cons_2_2 === true,
    title: '米提亚2命：过载炉心存在期间，元素精通提升[mastery]点',
    data: {
      mastery: 234
    }
  },
  {
    cons: 6,
    check: ({ params }) => params.cons_6 === true,
    title: '米提亚6命：稳态炉心造成原本[_multi]%的伤害',
    data: {
      _multi: 115,
      multi: 15
    }
  },
  {
    cons: 6,
    title: '米提亚6命：星烁反应伤害擢升[elevated]%',
    data: {
      elevated: 20
    }
  }
]

export const createdBy = '冰翼'
