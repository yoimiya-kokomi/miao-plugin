export const details = [
  {
    title: '满辉·露米捶捶乱打伤害（后台）',
    dmg: ({ attr, calc, talent } , { basic }) => basic(calc(attr.def) * talent.e['露米捶捶乱打伤害'] / 100, 'e')
  },
  {
    params: { Moonsign_Benediction: true, cons_1: true },
    title: '满辉·露米加力重锤伤害（后台）',
    dmg: ({ attr, calc, cons, talent } , { basic }) => basic(calc(attr.def) * talent.e['露米加力重锤伤害'] / 100, '', 'lunarCrystallize')
  },
  {
    params: { Moonsign_Benediction: true, cons_1_2: true, cons_2: true },
    title: '满辉·露米百万吨重锤伤害（后台）',
    dmg: ({ attr, calc, cons, talent } , { basic }) => basic(calc(attr.def) * talent.e['露米百万吨重锤伤害'] / 100, '', 'lunarCrystallize')
  },
  {
    title: 'Q释放治疗量',
    dmg: ({ talent, attr }, { heal }) => {
      return heal(talent.q['首次治疗量2'][0] / 100 * attr.def + talent.q['首次治疗量2'][1])
    }
  },
  {
    title: 'Q后续每次治疗',
    dmg: ({ talent, attr }, { heal }) => {
      return heal(talent.q['持续治疗量2'][0] / 100 * attr.def + talent.q['持续治疗量2'][1])
    }
  }
]

export const defDmgIdx = 2
export const mainAttr = 'def,cpct,cdmg,mastery'
export const defParams = { Moonsign: 2 }

export const buffs = [
  {
    check: ({ params }) => params.Moonsign_Benediction === true,
    title: '莉奈娅天赋：基于莉奈娅的防御力，对队伍中角色造成的月曜反应提升[fypct]%的基础伤害',
    sort: 9,
    data: {
      fypct: ({ attr, calc }) => Math.min(calc(attr.def) / 100 * 0.7, 14)
    }
  },
  {
    title: '莉奈娅天赋：露米附近敌人的岩元素抗性会降低[kx]%',
    data: {
      kx: ({ params }) => ((params.Moonsign || 0) >= 2 ? 30 : 15)
    }
  },
  {
    check: ({ params }) => params.cons_1 === true,
    title: '莉奈娅1命：队伍中附近的角色造成月结晶反应伤害时，将消耗一层「历览编录」，提升造成的伤害，提升值相当于莉奈娅防御力的[_fyplus]%',
    cons: 1,
    sort: 9,
    data: {
      _fyplus: ({ cons }) => 75 * (cons == 6 ? 1.5 : 1),
      fyplus: ({ attr, calc, cons }) => calc(attr.def) * 75 / 100 * (cons == 6 ? 1.5 : 1)
    }
  },
  {
    check: ({ params }) => params.cons_1_2 === true,
    title: '莉奈娅1命：露米在究极厉害形态下使用百万吨重锤时，可消耗5层「历览编录」，提升造成的伤害，总提升值相当于莉奈娅防御力的[_fyplus]%',
    cons: 1,
    sort: 9,
    data: {
      _fyplus: ({ cons }) => 750 * (cons == 6 ? 1.5 : 1),
      fyplus: ({ attr, calc, cons }) => calc(attr.def) * 750 / 100 * (cons == 6 ? 1.5 : 1)
    }
  },
  {
    title: '莉奈娅2命：触发月笼谐奏后的8秒内，队伍中所有元素类型为水元素与岩元素的角色的暴击伤害提升[cdmg]%',
    cons: 2,
    data: {
      cdmg: 40
    }
  },
  {
    check: ({ params }) => params.cons_2 === true,
    title: '莉奈娅2命：露米在究极厉害形态下使用百万吨重锤的暴击伤害额外提升[cdmg]%',
    cons: 2,
    data: {
      cdmg: 150
    }
  },
  {
    title: '莉奈娅4命：触发月笼谐奏后的5秒内，莉奈娅与队伍中自己的当前场上角色的防御力分别提升[defPct]%',
    cons: 4,
    data: {
      defPct: 25
    }
  },
  {
    title: '莉奈娅6命：【月兆·满辉】队伍中附近的角色造成的月结晶反应伤害擢升[elevated]%',
    cons: 6,
    data: {
      elevated: ({ params }) => ((params.Moonsign || 0) >= 2 ? 25 : 0),
    }
  }
]

export const createdBy = '冰翼'
