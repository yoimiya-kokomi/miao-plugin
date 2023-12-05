export const details = [{
  title: 'E后重击伤害',
  params: { q: 1, team: false },
  dmg: ({ talent }, dmg) => dmg(talent.a['重击伤害'], 'a2')
}, {
  title: 'Q单段伤害',
  params: { q: 1, team: false },
  dmg: ({ talent }, dmg) => dmg(talent.q['连斩伤害2'][0], 'q')
}, {
  title: 'Q总伤害',
  params: { q: 1, team: false },
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'] + talent.q['连斩伤害'] + talent.q['最后一击伤害'], 'q')
}, {
  title: 'Q总伤害·超激化',
  params: { q: 1, team: false },
  dmg: ({ talent }, dmg) => {
    let t1j = dmg(talent.q['技能伤害'], 'q', 'aggravate')
    let t2j = dmg(talent.q['连斩伤害'] / 8, 'q', 'aggravate')
    let t2 = dmg(talent.q['连斩伤害'] / 8, 'q')
    let t3j = dmg(talent.q['最后一击伤害'], 'q', 'aggravate')
    return {
      dmg: t1j.dmg + t2j.dmg * 2 + t2.dmg * 6 + t3j.dmg,
      avg: t1j.avg + t2j.avg * 2 + t2.avg * 6 + t3j.avg
    }
  }
}, {
  title: '刻九万妲Q激化总伤',
  params: { q: 1, team: true },
  dmg: ({ talent }, dmg) => {
    let t1j = dmg(talent.q['技能伤害'], 'q', 'aggravate')
    let t2j = dmg(talent.q['连斩伤害'] / 8, 'q', 'aggravate')
    let t2 = dmg(talent.q['连斩伤害'] / 8, 'q')
    let t3j = dmg(talent.q['最后一击伤害'], 'q', 'aggravate')
    return {
      dmg: t1j.dmg + t2j.dmg * 2 + t2.dmg * 6 + t3j.dmg,
      avg: t1j.avg + t2j.avg * 2 + t2.avg * 6 + t3j.avg
    }
  }
}]

export const defParams = {
  q: 1,
  team: true
}

export const defDmgIdx = 4
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '刻晴被动：释放Q获得15%暴击率',
  data: {
    qCpct: 15
  }
}, {
  title: '刻晴4命：触发雷元素相关反应提升攻击力25%',
  cons: 4,
  data: {
    atkPct: 25
  }
}, {
  title: '刻晴6命：4层获得24%雷伤加成',
  cons: 6,
  data: {
    dmg: 24
  }
}, {
  check: ({ cons, params }) => cons <= 1 && params.team === true,
  title: '精1苍古0命万叶：获得[dmg]%增伤(苍古普攻16增伤)，增加[atkPct]%攻击,减抗[kx]%',
  data: {
    aDmg: 16,
    a2Dmg: 16,
    a3Dmg: 16,
    dmg: 40,
    atkPct: 20,
    kx: 40
  }
}, {
  check: ({ cons, params }) => ((cons < 6 && cons > 1) && params.team === true),
  title: '精1苍古2命万叶：获得[dmg]%增伤(苍古普攻16增伤)，增加[atkPct]%攻击,减抗[kx]%,精通[mastery]',
  data: {
    aDmg: 16,
    a2Dmg: 16,
    a3Dmg: 16,
    dmg: 48,
    atkPct: 20,
    kx: 40,
    mastery: 200
  }
}, {
  check: ({ cons, params }) => (cons >= 6 && params.team === true),
  title: '精5苍古6命万叶：获得[dmg]%增伤(苍古普攻32增伤)，增加[atkPct]%攻击,减抗[kx]%,精通[mastery]',
  data: {
    aDmg: 32,
    a2Dmg: 32,
    a3Dmg: 32,
    dmg: 48,
    atkPct: 40,
    kx: 40,
    mastery: 200
  }
}, {
  check: ({ params }) => params.team === true,
  title: '天空九条：增加[atkPlus]点攻击力与[cdmg]%爆伤',
  data: {
    atkPlus: 794.2,
    cdmg: 60
  }
}, {
  check: ({ params , artis }) => params.team === true && artis.昔日宗室之仪 !== 4 ,
  title: '九条-昔日宗室之仪：增加攻击[atkPct]%',
  data: {
    atkPct: 20
  }
}, {
  check: ({ cons, params }) => (cons >= 2 && params.team === true),
  title: '千夜2命纳西妲：增加精通[mastery],减防[enemyDef]%',
  data: {
    mastery: 40,
    enemyDef: 30
  }
}, {
  check: ({ cons, params }) => (cons < 2 && params.team === true),
  title: '千夜0命纳西妲：增加精通[mastery]',
  data: {
    mastery: 40
  }
}, {
  check: ({ params }) => params.team === true,
  sort: 7,
  title: '纳西妲-净善摄受明论：Q范围内在场角色增加精通[mastery]',
  data: {
    mastery: 250
  }
}, 'aggravate']
