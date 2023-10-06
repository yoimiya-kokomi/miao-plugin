export const details = [{
  check: ({ cons }) => cons < 2,
  dmgKey: 'e',
  title: '叄阶杀生樱伤害',
  params: { team: false, team2: false },
  dmg: ({ talent }, dmg) => dmg(talent.e['杀生樱伤害·叁阶'], 'e')
}, {
  check: ({ cons }) => cons >= 2,
  dmgKey: 'e',
  title: '肆阶杀生樱伤害',
  params: { team: false, team2: false },
  dmg: ({ talent }, dmg) => dmg(talent.e['杀生樱伤害·肆阶'], 'e')
}, {
  check: ({ cons }) => cons < 2,
  title: '叄阶杀生樱激化伤害',
  params: { team: false, team2: false },
  dmg: ({ talent }, dmg) => dmg(talent.e['杀生樱伤害·叁阶'], 'e', 'aggravate')
}, {
  check: ({ cons }) => cons >= 2,
  title: '肆阶杀生樱激化伤害',
  params: { team: false, team2: false },
  dmg: ({ talent }, dmg) => dmg(talent.e['杀生樱伤害·肆阶'], 'e', 'aggravate')
}, {
  check: ({ cons }) => cons < 2,
  dmgKey: 'e_t',
  params: { team: true, team2: false },
  title: '温三雷叄阶杀生樱伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['杀生樱伤害·叁阶'], 'e')
}, {
  check: ({ cons }) => cons >= 2,
  dmgKey: 'e_t',
  params: { team: true, team2: false },
  title: '温三雷肆阶杀生樱伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['杀生樱伤害·肆阶'], 'e')
}, {
  title: '四段Q总伤害',
  params: { team: false, team2: false },
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'] + talent.q['天狐霆雷伤害'] * 3, 'q')
}, {
  title: '四段Q总激化伤害',
  params: { team: false, team2: false },
  dmg: ({ talent }, dmg) => {
    let q1j = dmg(talent.q['技能伤害'], 'q', 'aggravate')
    let q2j = dmg(talent.q['天狐霆雷伤害'], 'q', 'aggravate')
    return {
      dmg: q1j.dmg + q2j.dmg * 3,
      avg: q1j.avg + q2j.avg * 3
    }
  }
}, {
  title: '温三雷四段Q总伤害',
  params: { team: true, team2: false },
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'] + talent.q['天狐霆雷伤害'] * 3, 'q')
}, {
  check: ({ cons }) => cons < 2,
  dmgKey: 'e_j',
  params: { team: false, team2: true },
  title: '提八纳万叄阶杀生樱激化伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['杀生樱伤害·叁阶'], 'e', 'aggravate')
}, {
  check: ({ cons }) => cons >= 2,
  dmgKey: 'e_j',
  params: { team: false, team2: true },
  title: '提八纳万肆阶杀生樱激化伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['杀生樱伤害·肆阶'], 'e', 'aggravate')
}, {
  title: '提八纳万四段Q总伤害',
  params: { team: false, team2: true },
  dmg: ({ talent }, dmg) => {
    let q1j = dmg(talent.q['技能伤害'], 'q', 'aggravate')
    let q2j = dmg(talent.q['天狐霆雷伤害'], 'q', 'aggravate')
    return {
      dmg: q1j.dmg + q2j.dmg * 3,
      avg: q1j.avg + q2j.avg * 3
    }
  }
}]

export const mainAttr = 'atk,cpct,cdmg,mastery,dmg'
export const defDmgKey = 'e_j'

export const defParams = {
  team: true, team2: true
}

export const buffs = [{
  check: ({ cons }) => cons >= 4,
  title: '4命效果：杀生樱命中敌人后提高雷伤[dmg]%',
  data: {
    dmg: 20
  }
}, {
  cons: 6,
  title: '6命效果：杀生樱无视敌人[eDef]%防御',
  data: {
    eDef: 60
  }
}, {
  check: ({ cons, params }) => (cons >= 6 && params.team === true),
  title: '精5终末6命温迪：增加[atkPct]%攻击,减抗[kx]%,精通[mastery]',
  data: {
    atkPct: 40,
    kx: 60,
    mastery: 200
  }
}, {
  check: ({ cons, params }) => (cons < 6 && cons > 1 && params.team === true),
  title: '精1终末0命温迪：增加[atkPct]%攻击,减抗[kx]%,精通[mastery]',
  data: {
    atkPct: 20,
    kx: 40,
    mastery: 100
  }
}, {
  check: ({ params }) => params.team === true,
  title: '天空宗室九条：增加[atkPlus]点攻击力,[atkPct]%攻击与[cdmg]%爆伤',
  data: {
    atkPlus: 794.2,
    atkPct: 20,
    cdmg: 60
  }
}, {
  check: ({ cons, params }) => (cons >= 2 && cons < 6 && params.team2 === true),
  title: '精1千夜纳西妲提纳里：增加精通[mastery]（包括双草）,减防[enemyDef]%',
  data: {
    mastery: 140,
    enemyDef: 30
  }
}, {
  check: ({ cons, params }) => (cons >= 6 && params.team2 === true),
  title: '精5千夜纳西妲提纳里：增加精通[mastery]（包括双草）,减防[enemyDef]（折合效果）%',
  data: {
    mastery: 268,
    enemyDef: 12
  }
}, {
  check: ({ cons, params }) => (cons < 2 && params.team2 === true),
  title: '精1千夜草套纳西妲提纳里：增加精通[mastery]（包括双草)',
  data: {
    mastery: 140
  }
}, {
  check: ({ cons, params }) => cons <= 1 && params.team2 === true,
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
  check: ({ cons, params }) => ((cons < 6 && cons > 1) && params.team2 === true),
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
  check: ({ cons, params }) => (cons >= 6 && params.team2 === true),
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
  title: '天赋-启蜇之祝词：基于元素精通提高杀生樱伤害[eDmg]%',
  sort: 9,
  data: {
    eDmg: ({ attr, calc }) => calc(attr.mastery) * 0.15
  }
}, {
  check: ({ params }) => params.team === true,
  title: '雷神-恶曜开眼：开E元素爆发伤害提升[qDmg]%',
  data: {
    qDmg: 27
  }
}, 'aggravate']
