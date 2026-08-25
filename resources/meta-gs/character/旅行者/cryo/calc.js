export const details = [
  {
    title: '【辉映·星超导】E后普攻首段伤害',
    dmg: ({ attr, calc, talent }, dmg) => dmg(talent.a['一段伤害'] + 80, 'a')
  },
  {
    title: '【辉映·星超导】E后普攻尾段伤害',
    dmg: ({ attr, calc, talent }, dmg) => dmg(talent.a['五段伤害'] + 80, 'a')
  },
  {
    title: '【辉映·星超导】重击·冰凝星超导伤害',
    params: { Stellar: true },
    dmg: ({ attr, calc, talent }, { basic }) => basic(calc(attr.atk) * (talent.a['重击伤害2'][0] + talent.a['重击伤害2'][1] + 140) / 100, '', 'stellarConduct')
  },
  {
    title: 'E冰晶单次伤害',
    dmg: ({ attr, calc, talent }, dmg) => dmg(talent.e['冰晶伤害'], 'e')
  },
  {
    title: '满层寒辉·Q星超导单次伤害',
    params: { Stellar: true, q: true },
    dmg: ({ attr, calc, talent }, { basic }) => basic(calc(attr.atk) * talent.q['星超导投矛单段伤害'] / 100, '', 'stellarConduct')
  }
]

export const defDmgIdx = 2
export const mainAttr = 'atk,cpct,cdmg,mastery'

export const buffs = [
  {
    check: ({ params }) => params.q === true,
    title: '冰主元素爆发：消耗8层寒辉层数，提升本次元素爆发造成的伤害',
    data: {
      stellarConduct: ({ talent }) => talent.q['星超导寒辉伤害提升'] * 8
    }
  },
  {
    title: '冰主天赋：基于攻击力，提升[mastery]点的元素精通',
    sort: 9,
    data: {
      mastery: ({ attr, calc }) => Math.min(calc(attr.atk) / 100 * 8, 160)
    }
  },
  {
    check: ({ params }) => params.Stellar === true,
    title: '冰主天赋：基于攻击力，对队伍中角色造成的星超导反应提升[fypct]%的基础伤害',
    sort: 9,
    data: {
      fypct: ({ attr, calc }) => Math.min(calc(attr.atk) / 100 * 0.35, 7)
    }
  },
  {
    title: '冰主2命：在前台触发了星烁反应，或造成了星烁反应伤害时，元素精通提升[mastery]点',
    cons: 2,
    data: {
      mastery: 120
    }
  }
]

export const createdBy = '冰翼'
