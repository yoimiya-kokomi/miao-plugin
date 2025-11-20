export const details = [
  {
    title: '满层满辉E后幻戏自身一段',
    params: { Phantasm_Performance: true },
    dmg: ({ talent, calc, attr, cons, params }, { basic }) => basic(((calc(attr.atk) * talent.e['幻戏自身一段伤害2'][0] + calc(attr.mastery) * talent.e['幻戏自身一段伤害2'][1]) / 100) * (1 + Math.min((params.Veil_of_Falsehood || 99), (cons >= 2 ? 5 : 3)) * 0.08), 'a2')
  },
  {
    title: '满层满辉E后幻戏自身二段',
    params: { Phantasm_Performance: true },
    dmg: ({ talent, calc, attr, cons, params }, { basic }) => {
      let c0 = basic(((calc(attr.atk) * talent.e['幻戏自身二段伤害2'][0] + calc(attr.mastery) * talent.e['幻戏自身二段伤害2'][1]) / 100) * (1 + Math.min((params.Veil_of_Falsehood || 99), (cons >= 2 ? 5 : 3)) * 0.08), 'a2')
      let c6 = basic((calc(attr.mastery) * 85 / 100) * (1 + Math.min((params.Veil_of_Falsehood || 99), (cons >= 2 ? 5 : 3)) / 10), '', 'lunarBloom')
      return {
        dmg: cons >= 6 ? c6.dmg : c0.dmg,
        avg: cons >= 6 ? c6.avg : c0.avg
      }
    }
  },
  {
    title: '满层满辉E后幻戏协同一段',
    params: { Lunar: true, Phantasm_Performance: true },
    dmg: ({ talent, calc, attr, cons, params }, { basic }) => basic((calc(attr.mastery) * talent.e['幻戏虚影一段'] / 100) * (1 + Math.min((params.Veil_of_Falsehood || 99), (cons >= 2 ? 5 : 3)) * 0.08), '', 'lunarBloom')
  },
  {
    title: '满层满辉E后幻戏协同二段',
    params: { Lunar: true, Phantasm_Performance: true },
    dmg: ({ talent, calc, attr, cons, params }, { basic }) => basic((calc(attr.mastery) * talent.e['幻戏虚影二段'] / 100) * (1 + Math.min((params.Veil_of_Falsehood || 99), (cons >= 2 ? 5 : 3)) * 0.08), '', 'lunarBloom')
  },
  {
    title: '满层满辉E后幻戏协同三段',
    params: { Lunar: true, Phantasm_Performance: true },
    dmg: ({ talent, calc, attr, cons, params }, { basic }) => basic((calc(attr.mastery) * talent.e['幻戏虚影三段'] / 100) * (1 + Math.min((params.Veil_of_Falsehood || 99), (cons >= 2 ? 5 : 3)) * 0.08), '', 'lunarBloom')
  },
  {
    title: 'Q一段伤害',
    dmg: ({ talent, calc, attr }, { basic }) => basic((calc(attr.atk) * talent.q['一段伤害2'][0] + calc(attr.mastery) * talent.q['一段伤害2'][1]) / 100, 'q')
  },
  {
    title: 'Q二段伤害',
    dmg: ({ talent, calc, attr }, { basic }) => basic((calc(attr.atk) * talent.q['二段伤害2'][0] + calc(attr.mastery) * talent.q['二段伤害2'][1]) / 100, 'q')
  },
  {
    title: '绽放伤害',
    params: { Moonsign: 1 },
    dmg: ({}, { reaction }) => reaction('bloom')
  }
]

export const defDmgIdx = 4
export const mainAttr = 'atk,cpct,cdmg,mastery'
export const defParams = { Moonsign: 3 }
export const buffs = [
  {
    title: '奈芙尔天赋：处于满辉时，[buff]层「伪秘之帷」使元素精通提升[mastery]',
    data: {
      buff: ({ params, cons }) => Math.min((params.Veil_of_Falsehood || 99), (cons >= 2 ? 5 : 3)),
      mastery: ({ params, cons }) => (params.Veil_of_Falsehood || 99) >= (cons >= 2 ? 5 : 3) ? 100 : 0
    }
  },
  {
    check: ({ params }) => params.Lunar === true,
    title: '奈芙尔天赋：[月兆祝赐 · 廊下暮影] 触发绽放反应时转为触发月绽放反应,基础伤害提升[fypct]',
    sort: 9,
    data: {
      fypct: ({ attr, calc }) => Math.min((calc(attr.mastery) * 0.0175), 14)
    }
  },
  {
    title: '奈芙尔技能：「伪秘之帷」使元素爆发伤害提升[qDmg]%',
    data: {
      qDmg: ({ talent, params, cons }) => talent.q['伤害提升'] * Math.min(((params.Veil_of_Falsehood || 99)), (cons >= 2 ? 5 : 3))
    }
  },
  {
    check: ({ params }) => params.Lunar === true && params.Phantasm_Performance === true,
    title: '奈芙尔1命：幻戏造成的月绽放反应基础伤害提升[fyplus]',
    cons: 1,
    data: {
      fyplus: ({ attr, calc, cons, params }) => (calc(attr.mastery) * 60 / 100) * Math.min((1 + (params.Veil_of_Falsehood || 99) / 10), (cons >= 2 ? 1.4 : 1.24))
    }
  },
  {
    title: '奈芙尔2命：元素精通额外提升[mastery]',
    cons: 2,
    data: {
      mastery: ({ params }) => (params.Veil_of_Falsehood || 99) >= 5 ? 100 : 0
    }
  },
  {
    title: '奈芙尔4命：附近敌人的元素抗性降低[kx]%',
    cons: 4,
    data: {
      kx: 20
    }
  },
  {
    check: ({ params }) => params.Lunar === true,
    title: '奈芙尔6命：处于满辉时月绽放反应伤害擢升[elevated]%',
    cons: 6,
    data: {
      elevated: ({ params }) => ((params.Moonsign || 0) >= 2 ? 15 : 0)
    }
  }
]

export const createdBy = 'kvcfdd'
