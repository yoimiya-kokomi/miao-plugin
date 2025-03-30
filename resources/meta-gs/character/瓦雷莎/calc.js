export const details = [{
  title: '重击伤害',
  dmg: ({ talent, attr }, dmg) => dmg(talent.a['重击伤害'], 'a2,nightsoul')
}, {
  title: '「炽热激情」重击伤害',
  dmg: ({ talent, attr }, dmg) => dmg(talent.a['炽热激情状态重击伤害'], 'a2,nightsoul')
}, {
  title: 'EZ后下落伤害',
  params: { Rainbow_Crash: true },
  dmg: ({ talent, attr }, dmg) => dmg(talent.a['低空/高空坠地冲击伤害'][1], 'a3,nightsoul')
}, {
  title: 'EZ后「炽热激情」下落伤害',
  params: { Rainbow_Crash_FP: true },
  dmg: ({ talent, attr }, dmg) => dmg(talent.a['炽热激情状态低空/高空坠地冲击伤害'][1], 'a3,nightsoul')
}, {
  title: '4命「精进勇猛」满BUFF下落伤害',
  params: { Rainbow_Crash_FP: true, cons4_a3: true },
  cons: 4,
  dmg: ({ talent, attr }, dmg) => dmg(talent.a['炽热激情状态低空/高空坠地冲击伤害'][1], 'a3,nightsoul')
}, {
  title: 'E突进伤害',
  dmg: ({ talent, attr }, dmg) => dmg(talent.e['突进伤害'], 'e,nightsoul')
}, {
  title: '「炽热激情」E突进伤害',
  dmg: ({ talent, attr }, dmg) => dmg(talent.e['炽热激情状态突进伤害'], 'e,nightsoul')
}, {
  title: 'Q飞踢伤害',
  dmg: ({ talent, attr }, dmg) => dmg(talent.q['飞踢伤害'], 'q,nightsoul')
}, {
  title: '「炽热激情」Q飞踢伤害',
  params: { cons4_q: true },
  dmg: ({ talent, attr }, dmg) => dmg(talent.q['炽热激情状态飞踢伤害'], 'q,nightsoul')
}, {
  title: 'Q「大火山崩落」伤害',
  params: { cons1_q2: true, cons4_q: true },
  dmg: ({ talent, attr }, dmg) => dmg(talent.q['「大火山崩落」伤害'], 'a3,nightsoul')
}]

export const defParams = { Nightsoul: true }
export const defDmgIdx = 9
export const mainAttr = 'atk,cpct,cdmg,mastery'

export const buffs = [{
  check: ({ params }) => params.Rainbow_Crash === true,
  title: '瓦雷莎天赋：施放元素战技后的5秒内，坠地冲击能额外造成[a3Pct]%攻击力的伤害。',
  data: {
    a3Pct: ({ cons }) => cons < 1 ? 50 : 180
  }
}, {
  check: ({ params }) => params.Rainbow_Crash_FP === true,
  title: '瓦雷莎天赋：施放元素战技后的5秒内，炽热激情状态下的坠地冲击能额外造成[a3Pct]%攻击力的伤害',
  data: {
    a3Pct: 180
  }
}, {
  title: '瓦雷莎天赋：队伍中的附近的角色触发「夜魂迸发」时，瓦雷莎的攻击力至多可提升[atkPct]%',
  data: {
    atkPct: 35 * 2
  }
}, {
  check: ({ params }) => params.cons1_q2 === true,
  title: '瓦雷莎1命：进行特殊下落攻击时，坠地冲击同样也会额外造成[atkPct]%攻击力的伤害',
  cons: 1,
  data: {
    a3Pct: 180
  }
}, {
  check: ({ params }) => params.cons4_a3 === true,
  title: '瓦雷莎4命：施放元素爆发时，若不处于炽热激情状态或极限驱动状态，基于瓦雷莎攻击力的500%，提升瓦雷莎进行下落攻击时坠地冲击造成的伤害',
  sort: 9,
  cons: 4,
  data: {
    a3Plus: ({ calc, attr }) => Math.min(calc(attr.atk) * 500 / 100, 20000)
  }
}, {
  check: ({ params }) => params.cons4_q === true,
  title: '瓦雷莎4命：施放元素爆发时，若处于炽热激情状态或极限驱动状态，本次元素爆发造成的伤害提升[dmg]%',
  cons: 4,
  data: {
    dmg: 100
  }
}, {
  title: '瓦雷莎6命：下落攻击与元素爆发的暴击率提升10%，暴击伤害提升100%。',
  cons: 6,
  data: {
    a3Cpct: 10,
    qCpct: 10,
    a3Cdmg: 100,
    qCdmg: 100
  }
}]

export const createdBy = '冰翼'
