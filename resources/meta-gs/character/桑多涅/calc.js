export const details = [
  {
    title: '重击扫射伤害',
    dmg: ({ attr, calc, talent }, dmg) => dmg(talent.a['重击扫射伤害'], 'a2')
  },
  {
    title: '重击冷凝射线星超导伤害',
    params: { Stellar: true },
    dmg: ({ attr, calc, talent }, { basic }) => basic(calc(attr.atk) * talent.a['重击冷凝射线星超导伤害'] / 100, '', 'stellarConduct')
  },
  {
    title: 'E棱晶弹伤害',
    dmg: ({ attr, calc, talent }, dmg) => dmg(talent.e['棱晶弹伤害'], 'e')
  },
  {
    title: '满buff E棱晶弹星超导伤害',
    params: { Stellar: true },
    dmg: ({ attr, calc, talent }, { basic }) => basic(4 * calc(attr.atk) * talent.e['棱晶弹星超导伤害'] / 100, '', 'stellarConduct')
  },
  {
    title: 'Q轰炸伤害',
    dmg: ({ attr, calc, talent }, dmg) => dmg(talent.q['轰炸伤害'], 'q')
  },
  {
    title: '满buff Q聚能光束星超导伤害',
    params: { Stellar: true },
    dmg: ({ attr, calc, talent }, { basic }) => basic(2 * calc(attr.atk) * talent.q['聚能光束星超导伤害'] / 100, '', 'stellarConduct')
  },
  {
    title: '4命额外星超导伤害',
    params: { Stellar: true },
    cons: 4,
    dmg: ({ attr, calc }, { basic }) => basic(calc(attr.atk) * 125 / 100, '', 'stellarConduct')
  },
  {
    title: '6命每次冷凝射线额外星超导总伤害',
    params: { Stellar: true },
    cons: 6,
    dmg: ({ attr, calc }, { basic }) => basic(calc(attr.atk) * 80 * 4 / 100, '', 'stellarConduct')
  }
]

export const defDmgIdx = 1
export const mainAttr = 'atk,cpct,cdmg,mastery'

export const buffs = [
  {
    check: ({ params }) => params.Stellar === true,
    title: '桑多涅天赋：基于桑多涅的攻击力，对队伍中角色造成的星超导反应提升[fypct]%的基础伤害',
    sort: 9,
    data: {
      fypct: ({ attr, calc }) => Math.min(calc(attr.atk) / 100 * 0.7, 14)
    }
  },
  {
    title: '桑多涅天赋：基于桑多涅的攻击力，提升[mastery]点的元素精通',
    sort: 9,
    data: {
      mastery: ({ attr, calc }) => Math.min(calc(attr.atk) / 100 * 8, 160)
    }
  },
  {
    title: '桑多涅1命：队伍中的所有角色造成的星超导反应伤害提升[stellarConduct]%。',
    cons: 1,
    data: {
      stellarConduct: 30
    }
  },
  {
    title: '桑多涅2命：【辉映·星超导】3层状态下，重击发射的冷凝射线的暴击伤害提升[cdmg]%',
    cons: 2,
    data: {
      cdmg: 40 + 20 * 3
    }
  },
  {
    title: '桑多涅6命：星超导反应伤害擢升[elevated]%',
    cons: 6,
    data: {
      elevated: 20
    }
  }
]

export const createdBy = '冰翼'
