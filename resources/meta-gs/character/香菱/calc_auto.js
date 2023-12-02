export const details = [{
  title: '锅巴单口伤害',
  params: { team: false },
  dmg: ({ talent }, dmg) => dmg(talent.e['喷火伤害'], 'e')
}, {
  title: '万达锅巴单口蒸发',
  params: { team: true },
  dmg: ({ talent }, dmg) => dmg(talent.e['喷火伤害'], 'e', 'vaporize')
}, {
  title: ' 旋火轮单次伤害',
  params: { team: false },
  dmg: ({ talent }, dmg) => dmg(talent.q['旋火轮伤害'], 'q')
}, {
  title: '万达旋火轮单次蒸发',
  params: { team: true },
  dmg: ({ talent }, dmg) => dmg(talent.q['旋火轮伤害'], 'q', 'vaporize')
}]

export const defDmgIdx = 3
export const mainAttr = 'atk,cpct,cdmg,mastery'

export const defParams = {
  team: true
}

export const buffs = [{
  cons: 1,
  title: '香菱1命：锅巴降低敌人火抗15',
  data: {
    kx: 15
  }
}, {
  title: '香菱6命：旋火轮持续期间获得15%火伤加成',
  cons: 6,
  data: {
    qDmg: 15
  }
}, {
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
}, {
  check: ({ params }) => params.team === true,
  title: '双火共鸣：攻击力提高[atkPct]%',
  data: {
    atkPct: 25
  }
}, 'vaporize']
