export const details = [
  {
    title: 'EE破晓终奏星超导伤害',
    params: { skills_1: true },
    dmg: ({ attr, calc, talent }, { basic }) => basic(calc(attr.atk) * talent.e['破晓终奏星超导/星扩散伤害'][0] / 100, '', 'stellarConduct')
  },
  {
    title: 'Q后EE破晓终奏星超导伤害',
    params: { skills_1: true, q: true },
    dmg: ({ attr, calc, talent }, { basic }) => basic(calc(attr.atk) * talent.e['破晓终奏星超导/星扩散伤害'][0] / 100, '', 'stellarConduct')
  },
  {
    title: '后台E拂羽舞步星超导伤害',
    params: { cons_6: true },
    dmg: ({ attr, calc, talent }, { basic }) => basic(calc(attr.atk) * talent.e['拂羽舞步星超导/星扩散伤害'][0] / 100, '', 'stellarConduct')
  },
  {
    title: '后台E旋翼舞步星超导伤害',
    params: { cons_6: true },
    dmg: ({ attr, calc, talent }, { basic }) => basic(calc(attr.atk) * talent.e['旋翼舞步星超导/星扩散伤害'][0] / 100, '', 'stellarConduct')
  },
  {
    title: 'Q后后台E拂羽舞步星超导伤害',
    params: { cons_6: true, q: true },
    dmg: ({ attr, calc, talent }, { basic }) => basic(calc(attr.atk) * talent.e['拂羽舞步星超导/星扩散伤害'][0] / 100, '', 'stellarConduct')
  },
  {
    title: 'Q后后台E旋翼舞步星超导伤害',
    params: { cons_6: true, q: true },
    dmg: ({ attr, calc, talent }, { basic }) => basic(calc(attr.atk) * talent.e['旋翼舞步星超导/星扩散伤害'][0] / 100, '', 'stellarConduct')
  },
  {
    cons: 1,
    title: '1命额外星超导伤害',
    params: { skills_1: true },
    dmg: ({ attr, calc }, { basic }) => basic(calc(attr.atk) * 300 / 100, '', 'stellarConduct')
  },
  {
    cons: 4,
    title: '4命后台协同星超导伤害',
    params: { cons_6: true },
    dmg: ({ attr, calc }, { basic }) => basic(calc(attr.atk) * 66 / 100, '', 'stellarConduct')
  }
]

export const defDmgIdx = 1
export const mainAttr = 'atk,cpct,cdmg,mastery'

export const buffs = [
  {
    title: '双冰共鸣：攻击冰元素附着或冻结状态下的敌人时，暴击率提高[cpct]%',
    data: {
      cpct: 15
    }
  },
  {
    check: ({ params }) => params.q === true,
    title: '奥黛塔元素爆发：提升奥黛塔造成的星烁反应伤害[stellarConduct]%',
    data: {
      stellarConduct: ({ talent }) => talent.q['雪鹄之梦星烁反应伤害提升']
    }
  },
  {
    check: ({ params }) => params.skills_1 === true,
    title: '奥黛塔天赋：召唤独舞倒影时，还会获得华彩，总共提供[stellarConduct]%的星烁反应伤害提升',
    data: {
      stellarConduct: ({ cons }) => (cons >= 1 ? 6 : 4) * 15
    }
  },
  {
    title: '奥黛塔天赋：基于奥黛塔的攻击力超过1000点的部分，奥黛塔造成的星烁反应伤害额外造成原本[multi]%的伤害',
    sort: 9,
    data: {
      multi: ({ attr, calc }) => Math.min((Math.max(calc(attr.atk) - 1000, 0)) / 100 * 1.5, 30)
    }
  },
  {
    title: '奥黛塔天赋：基于奥黛塔的攻击力，对队伍中角色造成的星超导反应提升[fypct]%的基础伤害',
    sort: 9,
    data: {
      fypct: ({ attr, calc }) => Math.min(calc(attr.atk) / 100 * 0.7, 14)
    }
  },
  {
    cons: 2,
    check: ({ params }) => params.skills_1 === true,
    title: '奥黛塔2命：召唤独舞倒影时，还会获得华彩，使角色的攻击力提升[atkPct]%',
    data: {
      atkPct: 7 * 6
    }
  },
  {
    cons: 2,
    title: '奥黛塔2命：独舞倒影附近敌人的对应元素抗性还会降低[kx]%',
    data: {
      kx: 20
    }
  },
  {
    cons: 6,
    check: ({ params }) => params.cons_6 === true,
    title: '奥黛塔6命：奥黛塔赋予队伍中附近的所有角色华彩时，自己的华彩不再会减少',
    data: {
      stellarConduct: 6 * 15,
      atkPct: 7 * 6
    }
  },
  {
    cons: 6,
    title: '奥黛塔6命：奥黛塔对敌人造成的星烁反应伤害总共擢升[kx]%',
    data: {
      elevated: 20
    }
  }
]

export const createdBy = '冰翼'
