export const details = [
  {
    title: 'E唤春角笛后台伤害',
    dmg: ({ attr, calc, talent }, { basic }) => basic(calc(attr.hp) * talent.e['唤春角笛伤害'] / 100, 'e')
  },
  {
    title: 'Q技能伤害',
    params: { q: true },
    dmg: ({ attr, calc, talent }, { basic }) => basic(calc(attr.hp) * talent.q['技能伤害'] / 100, 'q')
  },
  {
    title: 'E每跳治疗量',
    dmg: ({ attr, calc, talent }, { heal }) => heal(calc(attr.hp) * talent.e['遥久之歌治疗量2'][1] / 100 + talent.e['遥久之歌治疗量2'][0])
  },
  {
    cons: 4,
    title: '4命buff E唤春角笛后台伤害',
    params: { cons_4: true },
    dmg: ({ attr, calc, talent }, { basic }) => basic(calc(attr.hp) * talent.e['唤春角笛伤害'] / 100, 'e')
  },
  {
    cons: 4,
    title: '4命buff Q技能伤害',
    params: { q: true, cons_4: true },
    dmg: ({ attr, calc, talent }, { basic }) => basic(calc(attr.hp) * talent.q['技能伤害'] / 100, 'q')
  }
]

export const defDmgIdx = 2
export const mainAttr = 'hp,cpct,cdmg'

export const buffs = [
  {
    title: '沃雅妮莎战技：敌人的水元素抗性与冰元素抗性降低[kx]%',
    data: {
      kx: ({ talent }) => talent.e['水元素/冰元素抗性降低']
    }
  },
  {
    check: ({ params }) => params.q === true,
    title: '沃雅妮莎元素爆发：处于遥久之歌状态下时，元素爆发造成的伤害提升[dmg]%',
    data: {
      dmg: ({ talent }) => talent.q['遥久之歌伤害加成']
    }
  },
  {
    check: ({ params }) => params.cons_4 === true,
    title: '沃雅妮莎4命：若受治疗角色的生命值不低于40%，沃雅妮莎生命值上限提升[hpPct]%',
    cons: 4,
    data: {
      hpPct: 60
    }
  },
  {
    title: '沃雅妮莎6命：水元素伤害与冰元素伤害的暴击伤害提升[cdmg]%，水元素伤害与冰元素伤害提升[dmg]%。',
    cons: 6,
    data: {
      cdmg: 50,
      dmg: 60
    }
  }
]

export const createdBy = '冰翼'
