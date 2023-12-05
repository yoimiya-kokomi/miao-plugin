export const details = [{
  title: '蓄力总伤害',
  params: {
    team: false,
    alter: false,
    q: 0
  },
  dmg: ({ talent }, dmg) => dmg(talent.a['霜华矢·霜华绽发伤害'] + talent.a['霜华矢命中伤害'], 'a2')
}, {
  title: '蓄力融化',
  params: {
    team: false,
    alter: false,
    q: 0
  },
  dmg: ({ talent }, dmg) => dmg(talent.a['霜华矢·霜华绽发伤害'] + talent.a['霜华矢命中伤害'], 'a2', 'melt')
}, {
  title: '甘鹤万班蓄力融化',
  params: {
    team: true,
    alter: false,
    q: 0
  },
  dmg: ({ talent }, dmg) => dmg(talent.a['霜华矢·霜华绽发伤害'] + talent.a['霜华矢命中伤害'], 'a2', 'melt')
}, {
  title: '甘纳万班蓄力融化',
  params: {
    team: true,
    alter: true,
    q: 0
  },
  dmg: ({ talent }, dmg) => dmg(talent.a['霜华矢·霜华绽发伤害'] + talent.a['霜华矢命中伤害'], 'a2', 'melt')
}, {
  title: 'Q单个冰凌伤害',
  params: {
    team: false,
    alter: false,
    q: 1
  },
  dmg: ({ talent }, dmg) => dmg(talent.q['冰棱伤害'], 'q')
}]

export const defDmgIdx = 2
export const mainAttr = 'atk,cpct,cdmg,mastery'

export const defParams = {
  q: 1,
  team: true,
  alter: true
}

export const buffs = [{
  cons: 0,
  title: '甘雨被动：霜华矢发射后的5秒内霜华矢暴击率提高20%',
  data: {
    a2Cpct: 20
  }
}, {
  cons: 1,
  title: '甘雨1命：霜华失命中减少敌人15%冰抗',
  data: {
    kx: ({ params }) => params.q ? 0 : 15
  }
}, {
  cons: 4,
  title: '甘雨4命：大招领域内敌人受到的伤害提升25%',
  data: {
    dmg: ({ params }) => params.q ? 25 : 0
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
  check: ({ cons, params }) => (cons >= 6 && params.team === true && params.alter === false),
  title: '精5息灾申鹤：获得[dmg]%增伤,减抗[kx]%,爆伤15%,提升冰伤害5700',
  data: {
    dmg: 30,
    kx: 15,
    cdmg: 15,
    a2Plus: 5700 * 2,
    ePlus: 5700,
    qPlus: 5700
  }
}, {
  check: ({ cons, params }) => (cons < 6 && params.team === true && params.alter === false),
  title: '精1息灾申鹤：获得[dmg]%增伤,减抗[kx]%,提升冰伤害4300',
  data: {
    dmg: 30,
    kx: 15,
    a2Plus: 4300 * 2,
    ePlus: 4300,
    qPlus: 4300
  }
}, {
  check: ({ params }) => (params.team === true && params.alter === true),
  title: '0命纳西妲：Q范围内在场角色增加精通[mastery]',
  sort: 7,
  data: {
    mastery: 250
  }
}, {
  check: ({ params }) => (params.team === true && params.alter === true),
  title: '千夜浮梦(纳西妲)：精通增加[mastery]',
  data: {
    mastery: 40
  }
}, {
  check: ({ params , artis }) => params.team === true && artis.昔日宗室之仪 !== 4 ,
  title: '班尼特-昔日宗室之仪：增加攻击[atkPct]%',
  data: {
    atkPct: 20
  }
}, {
  check: ({ params }) => params.team === true,
  title: '风鹰宗室班：增加[atkPlus]点攻击力',
  data: {
    atkPlus: 1202.35
  }
}, 'melt']
