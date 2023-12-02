export const details = [{
  title: '开E后重击',
  params: { team: false },
  dmg: ({ talent }, dmg) => dmg(talent.e['重击伤害'], 'a2')
}, {
  title: '万达开E后重击',
  params: { team: true },
  dmg: ({ talent }, dmg) => dmg(talent.e['重击伤害'], 'a2')
}, {
  title: '断流·斩 伤害',
  params: { team: false },
  dmg: ({ talent }, dmg) => dmg(talent.e['断流·斩 伤害'], 'e')
}, {
  title: '开E后Q伤害',
  params: { team: false },
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害·近战'], 'q')
}, {
  title: '万达开E后Q蒸发',
  params: { team: true },
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害·近战'], 'q', 'vaporize')
}]

export const defDmgIdx = 4
export const mainAttr = 'atk,cpct,cdmg,mastery'

export const defParams = {
  team: true
}

export const buffs = [{
  check: ({ params }) => params.team === true,
  title: '风鹰宗室班：增加[atkPlus]点攻击力',
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
