export const details = [{
  title: '柔灯之匣一阶伤害',
  params: { e: true },
  dmg: ({ talent }, dmg) => dmg(talent.e['柔灯之匣·一阶攻击伤害'], 'e')
}, {
  title: '柔灯之匣二阶单枚伤害',
  params: { e: true },
  dmg: ({ talent }, dmg) => dmg(talent.e['柔灯之匣·二阶攻击伤害2'][0], 'e')
},  {
  title: '后台柔灯之匣二阶单枚',
  check: ({ weapon }) => weapon.name === '息灾',
  params: { e: true , off_field: true },
  dmg: ({ talent }, dmg) => dmg(talent.e['柔灯之匣·二阶攻击伤害2'][0], 'e')
}, {
  title: '天赋浸析伤害',
  params: { e: true },
  dmg: ({ attr }, { basic }) => basic(attr.atk * 600 / 100, '')
}, {
  title: '柔灯之匣三阶(Q)伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['柔灯之匣·三阶攻击伤害'], 'q')
}, {
  title: 'Q完整对单',
  dmg: ({ talent , cons }, dmg) => {
    let q1 = dmg(talent.q['柔灯之匣·三阶攻击伤害'], 'q')
    let cons4 = cons >= 4 ? 12 : 4
    return {
      dmg: q1.dmg * cons4,
      avg: q1.avg * cons4
    }
  }
}, {
  check: ({ cons }) => cons >= 6,
  title: 'Q后重击伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['重击伤害'], 'a2')
}, {
  title: '燃烧反应伤害',
  dmg: ({}, { reaction }) => reaction('burning')
}]

export const defDmgIdx = 1
export const mainAttr = 'atk,cpct,cdmg,mastery'

export const buffs = [{
  title: '艾梅莉埃天赋：基于攻击力，对处于燃烧状态下的敌人造成的伤害提升[dmg]%',
  data: {
    dmg: ({ attr }) => Math.min(36, attr.atk / 1000 * 15)
  }
}, {
  check: ({ params }) => params.e === true,
  title: '艾梅莉埃1命：[淡香浸析] e与天赋造成的伤害提升[dmg]%',
  cons: 1,
  data: {
    dmg: 20
  }
}, {
  title: '艾梅莉埃2命：EQ命中的敌人草元素抗性降低[kx]%',
  cons: 2,
  data: {
    kx: 30
  }
}, {
  title: '艾梅莉埃6命：施放EQ时,普攻与重击造成的伤害提升[aPlus]',
  cons: 6,
  data: {
    aPlus: ({ attr }) => attr.atk * 300 / 100,
    a2Plus: ({ attr }) => attr.atk * 300 / 100
  }
}]

export const createdBy = 'liangshi'
