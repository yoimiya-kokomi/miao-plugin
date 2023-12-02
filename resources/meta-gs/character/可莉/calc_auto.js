export const details = [{
  title: 'E后带火花重击',
  params: { q: false, team: false },
  dmg: ({ talent }, dmg) => dmg(talent.a['重击伤害'], 'a2')
}, {
  title: 'E后带火花重击蒸发',
  params: { q: false, team: false },
  dmg: ({ talent }, dmg) => dmg(talent.a['重击伤害'], 'a2', 'vaporize')
}, {
  title: '单次轰轰火花伤害',
  params: { team: false },
  dmg: ({ talent }, dmg) => dmg(talent.q['轰轰火花伤害'], 'q')
}, {
  title: '可莉三火E后火花重击',
  params: { q: false, team: true },
  dmg: ({ talent }, dmg) => dmg(talent.a['重击伤害'], 'a2')
}, {
  title: '可莉三火轰轰火花伤害',
  params: { team: true },
  dmg: ({ talent }, dmg) => dmg(talent.q['轰轰火花伤害'], 'q')
}, {
  title: '可莉三火可莉一轮总伤',
  params: { q: 1, team: true },
  dmg: ({ talent }, dmg) => {
    let ta = dmg(talent.a['一段伤害'], 'a')
    let tz = dmg(talent.a['重击伤害'], 'a')
    let tz2 = dmg(talent.a['重击伤害'], 'a2')
    let tejump = dmg(talent.e['技能伤害'], 'e')
    let tebomb = dmg(talent.e['技能伤害'], 'e')
    let tq = dmg(talent.q['轰轰火花伤害'], 'q')
    return {
      dmg: ta.dmg * 8 + tz.dmg * 4 + tz2.dmg * 2 + tejump.dmg * 3 + tebomb.dmg * 8 + tq.dmg * 16,
      avg: ta.avg * 8 + tz.avg * 4 + tz2.avg * 2 + tejump.avg * 3 + tebomb.avg * 8 + tq.avg * 16
    }
  }
}
]

export const defDmgIdx = 5
export const mainAttr = 'atk,cpct,cdmg,mastery'

export const defParams = {
  team: true
}

export const buffs = [{
  title: '可莉天赋：爆裂火花使重击伤害提升50%',
  data: {
    a2Dmg: 50
  }
}, {
  title: '可莉2命：蹦蹦炸弹的诡雷会使敌人的防御力降低23%',
  cons: 2,
  data: {
    enemyDef: 23
  }
}, {
  title: '可莉6命：释放轰轰火花后获得10%火元素伤害加成',
  cons: 6,
  data: {
    dmg: ({ params }) => params.q === false ? 0 : 10
  }
}, {
  check: ({ params }) => params.team === true,
  title: '风鹰班：增加[atkPlus]点攻击力',
  data: {
    atkPlus: 1202.35
  }
}, {
  check: ({ params , artis }) => params.team === true && artis.昔日宗室之仪 !== 4 ,
  title: '班尼特-昔日宗室之仪：增加攻击[atkPct]%',
  data: {
    atkPct: 20
  }
}, {
  check: ({ params }) => params.team === true,
  title: '香菱6命：增加[dmg]%火伤',
  data: {
    dmg: 15
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
}, 'vaporize']
