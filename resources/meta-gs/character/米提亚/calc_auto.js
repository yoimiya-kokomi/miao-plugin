// 队伍计算；奥黛塔0命星锋剑炉火，1800攻击6命瓦列里西风教官，900精通6命砂糖祭礼风套
// 轴：米提亚长E → 奥黛塔EE → 瓦列里EAQ → 砂糖AE扩雷 → 米提亚重击

export const details = [
  {
    title: '特殊重击·递变聚爆星超导伤害',
    params: { cons_1: true, cons_2_2: true, Starsealed_Edict: true },
    dmg: ({ attr, calc, talent, params }, { basic }) => basic(calc(attr.mastery) * talent.a['递变聚爆星超导伤害'] / 100, '', 'stellarConduct', false, params)
  },
  {
    title: 'E稳态炉心消耗递变信标伤害',
    params: { skills_1: true, cons_2_1: true, cons_6: true, Starsealed_Edict: true },
    dmg: ({ attr, calc, talent, params }, { basic }) => basic(calc(attr.mastery) * talent.e['稳态炉心消耗递变信标伤害'] / 100, '', 'stellarConduct', false, params)
  },
  {
    title: '(单枚信标) E稳态炉心引爆伤害',
    params: { skills_1: true, cons_2_1: true, cons_6: true, Starsealed_Edict: true },
    dmg: ({ attr, calc, talent, params }, { basic }) => basic(calc(attr.mastery) * talent.e['稳态炉心引爆伤害'] / 100, '', 'stellarConduct', false, params)
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
    dmg: ({ attr, calc, params }, { basic }) => basic(calc(attr.mastery) * 300 / 100, '', 'stellarConduct', false, params)
  },
  {
    cons: 4,
    title: '(过载炉心) 4命追加星超导伤害',
    params: { cons_2_2: true, Starsealed_Edict: true },
    dmg: ({ attr, calc, params }, { basic }) => basic(calc(attr.mastery) * 300 / 100, '', 'stellarConduct', false, params)
  },
  {
    title: '米奥瓦砂·重击星超导伤害',
    params: { team: true, cons_1: true, cons_2_2: true, Starsealed_Edict: true, stellarConductCount: 6 },
    dmg: ({ attr, calc, talent, params }, { basic }) => basic(calc(attr.mastery) * talent.a['递变聚爆星超导伤害'] / 100, '', 'stellarConduct', false, params)
  }
]

export const defDmgIdx = 7
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
  },
  {
    check: ({ params }) => params.team === true,
    title: '0命星锋剑奥黛塔：4层华彩提高星超导伤害[stellarConduct]%，星耀祝礼提高基础伤害[fypct]%',
    data: {
      stellarConduct: 60,
      fypct: 14
    }
  },
  {
    check: ({ params, artis }) => params.team === true && artis.炉火融炼之心 !== 4,
    title: '奥黛塔-炉火融炼之心：星超导伤害提升[stellarConduct]%',
    data: {
      stellarConduct: 50
    }
  },
  {
    check: ({ params }) => params.team === true,
    title: '满命1800攻击西风瓦列里：攻斥指令提高星超导伤害值[fyplus]，增加精通[mastery]点、暴击率[cpct]%与星超导暴击伤害[cdmg]%',
    data: {
      // 1800攻击、普攻9+3级（145.92%），首轮E消耗130势能（每点增加0.9%）。
      fyplus: 1800 * (145.92 + 130 * 0.9) / 100,
      mastery: 100,
      cpct: 10,
      cdmg: 40
    }
  },
  {
    check: ({ params, artis }) => params.team === true && artis.教官 !== 4,
    title: '瓦列里-教官：精通提升[mastery]点',
    data: {
      mastery: 120
    }
  },
  {
    check: ({ params, weapon }) => params.team === true && weapon.name === '千夜浮梦',
    title: '千夜浮梦：双雷队中，同元素队友使米提亚精通提升[mastery]点',
    data: {
      mastery: ({ refine }) => 32 + refine * 8
    }
  },
  {
    check: ({ params }) => params.team === true,
    title: '满命900精通祭礼砂糖：AE扩散雷，为在场角色增加精通[mastery]点',
    sort: 7,
    data: {
      // 先开过载炉心：砂糖站场时可获得米提亚2命的234点固定精通，再进行分享。
      // 如果带千夜浮梦，会为砂糖提供40/42/44/46/48点精通。
      mastery: ({ cons, weapon, refine }) => 50 + (900 + 100 + 120 + (cons >= 2 ? 234 : 0) + (weapon.name === '千夜浮梦' ? 40 + refine * 2 : 0)) * 0.2
    }
  },
  {
    check: ({ params }) => params.team === true,
    title: '砂糖-翠绿之影：降低敌人雷元素抗性[kx]%',
    data: {
      kx: 40
    }
  }
]

export const createdBy = 'Aluxes'
