export const details = [{
  title: '零愿力Q首刀',
  params: {
    type: 1,
    num: 0,
    ban: 0,
    team: false
  },
  dmg: ({ talent }, dmg) => dmg(talent.q['梦想一刀基础伤害'], 'q')
}, {
  title: '满愿力Q首刀',
  params: {
    type: 0,
    num: 60,
    ban: 0,
    team: false
  },
  dmg: ({ talent }, dmg) => dmg(talent.q['梦想一刀基础伤害'], 'q')
}, {
  title: '雷九八万满愿力Q首刀',
  params: {
    type: 0,
    num: 60,
    ban: 0,
    team: true
  },
  dmg: ({ talent }, dmg) => dmg(talent.q['梦想一刀基础伤害'], 'q')
}, {
  title: '雷九万班满愿力Q首刀',
  params: {
    type: 0,
    num: 60,
    ban: 1,
    team: true
  },
  dmg: ({ talent }, dmg) => dmg(talent.q['梦想一刀基础伤害'], 'q')
}, {
  title: '雷九万班满愿力重击',
  params: {
    type: 1,
    num: 60,
    ban: 1,
    team: true
  },
  dmg: ({ talent }, dmg) => dmg(talent.q['重击伤害'], 'q')
}]

export const defParams = {
  ban: 1,
  num: 60,
  type: 0,
  team: true
}

export const defDmgIdx = 2
export const mainAttr = 'atk,cpct,cdmg,recharge,mastery'

export const buffs = [{
  title: '恶曜开眼：开E元素爆发伤害提升[qDmg]%',
  data: {
    qDmg: ({ talent }) => talent.e['元素爆发伤害提高'] * 90
  }
}, {
  title: '梦想真说：Q满愿力获得[qPct]%大招倍率加成',
  data: {
    qPct: ({ talent, params }) => talent.q['愿力加成'][params.type || 0] * params.num
  }
}, {
  check: ({ cons }) => cons >= 2,
  title: '雷神2命：大招无视敌人[qIgnore]%防御力',
  data: {
    qIgnore: 60
  }
}, {
  title: '雷神被动：基于元素充能获得[dmg]%雷伤加成',
  sort: 4,
  data: {
    dmg: ({ attr }) => Math.max(attr.recharge.base + attr.recharge.plus - 100, 0) * 0.4
  }
}, {
  check: ({ params }) => params.team === true,
  title: '风鹰宗室班：增加[atkPlus]点攻击力',
  data: {
    atkPlus: ({ params }) => 1202.35 * params.ban
  }
}, {
  check: ({ params , artis }) => params.team === true && artis.昔日宗室之仪 !== 4 ,
  title: '班尼特-昔日宗室之仪：增加攻击[atkPct]%',
  data: {
    atkPct: ({ params }) => 20 * params.ban
  }
}, {
  check: ({ cons, params }) => cons > 2 && params.team === true,
  title: '八重4命：增加20%雷伤',
  data: {
    dmg: ({ params }) => 20 * (1 - params.ban)
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
  check: ({ cons, params }) => (cons < 3 && cons > 1 && params.team === true),
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
  check: ({ cons, params }) => (cons >= 3 && params.team === true),
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
  check: ({ params , artis }) => params.team === true && artis.教官 !== 4 ,
  title: '九条-教官：精通提升[mastery]',
  data: {
    mastery: 120
  }
}, {
  check: ({ params }) => params.team === true,
  title: '天空九条：增加[atkPlus]点攻击力与[cdmg]%爆伤',
  data: {
    atkPlus: 794.2,
    cdmg: 60
  }
}]
