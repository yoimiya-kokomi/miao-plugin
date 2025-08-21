export const details = [{
    title: '重击伤害',
    dmg: ({ talent }, dmg) => dmg(talent.a['唤灵之祷伤害'], 'a2')
  },
  {
    title: `满辉长按E二段3枚`,
    dmgKey: 'e',
    params: { Moonsign: 3 },
    dmg: ({ talent, calc, attr }, { basic }) => {
      let e = basic(calc(attr.mastery) * talent.e['长按二段伤害'] / 100, '', 'lunarBloom')
      return {
        dmg: e.dmg * 3,
        avg: e.avg * 3
      }
    }
  },
  {
    title: 'E圣域伤害',
    params: { Linnunrata: true },
    dmg: ({ talent, calc, attr }, { basic }) => basic(((calc(attr.mastery) * talent.e['霜林圣域攻击伤害2'][1]) + (calc(attr.atk) * talent.e['霜林圣域攻击伤害2'][0])) / 100, 'e')
  },
  {
    title: '绽放伤害',
    params: { Moonsign: 1 },
    dmg: ({}, { reaction }) => {
      let r1 = reaction('bloom')
      return {
        dmg: r1.avg * 2,
        avg: r1.avg * 1.15
      }
    }
  }, {
    title: 'Q后绽放伤害',
    dmgKey: 'r',
    params: { Pale_Hymn: true, Moonsign: 1 },
    dmg: ({}, { reaction }) => {
      let r1 = reaction('bloom')
      return {
        dmg: r1.avg * 2,
        avg: r1.avg * 1.15
      }
    }
  },
  {
    check: ({ cons }) => cons >= 6,
    title: '六命满辉E附加伤害',
    params: { Lunar: true, Moonsign: 3 },
    dmg: ({ calc, attr }, { basic }) => basic(calc(attr.mastery) * 185 / 100, '', 'lunarBloom')
  },
  {
    check: ({ cons }) => cons >= 6,
    title: '六命满辉普攻附加伤害',
    params: { Lunar: true, Pale_Hymn: true, Moonsign: 3 },
    dmg: ({ calc, attr }, { basic }) => basic(calc(attr.mastery) * 150 / 100, '', 'lunarBloom')
  }
]

export const defDmgIdx = 1
export const mainAttr = 'atk,cpct,cdmg,mastery'

export const buffs = [{
    check: ({ params }) => (params.Moonsign || 0) >= 2,
    title: '菈乌玛天赋：处于满辉时月绽放反应暴击率提升[cpct]%,暴击伤害提升[cdmg]%',
    data: {
      cpct: ({ params }) => params.Lunar === true ? 10 : 0,
      cdmg: ({ params }) => params.Lunar === true ? 20 : 0
    }
  }, {
    check: ({ params }) => params.Linnunrata === true,
    title: '菈乌玛天赋：元素战技造成的伤害提升[eDmg]%',
    sort: 9,
    data: {
      eDmg: ({ attr, calc }) => Math.min((calc(attr.mastery) * 0.04), 32)
    }
  }, {
    check: ({ params }) => params.Lunar === true,
    title: '菈乌玛天赋：触发绽放反应时转为触发月绽放反应，基础伤害提升[fypct]',
    sort: 9,
    data: {
      fypct: ({ attr, calc }) => Math.min((calc(attr.mastery) * 0.0175), 14)
    }
  }, {
    title: '菈乌玛技能：元素战技命中敌人时该敌人的抗性降低[kx]%',
    data: {
      kx: ({ talent }) => talent.e['元素抗性降低']
    }
  }, {
    check: ({ params }) => params.Pale_Hymn === true,
    title: '菈乌玛元素爆发：绽放、超绽放、烈绽放、月绽放反应造成的伤害提升[fyplus]',
    sort: 9,
    data: {
      fyplus: ({ attr, calc, talent, params }) => calc(attr.mastery) * (params.Lunar === true ? talent.q['月绽放反应伤害提升'] : talent.q['绽放、超绽放、烈绽放反应伤害提升']) / 100
    }
  }, {
    title: '菈乌玛2命：绽放、超绽放、烈绽放、月绽放伤害额外提升[fyplus],处于满辉时月绽放反应伤害提升[lunarBloom]%',
    sort: 9,
    cons: 2,
    data: {
      fyplus: ({ attr, calc, params }) => params.Pale_Hymn === true ? (calc(attr.mastery) * (params.Lunar === true ? 400 : 500) / 100) : 0,
      lunarBloom: ({ params }) => ((params.Moonsign || 0) >= 2 ? 40 : 0)
    }
  }, {
    check: ({ params }) => params.Lunar === true,
    title: '菈乌玛6命：[「我愿将这血与泪奉予月明」] 处于满辉时月绽放反应伤害擢升[elevated]%',
    cons: 6,
    data: {
      elevated: ({ params }) => ((params.Moonsign || 0) >= 2 ? 25 : 0)
    }
  }]
