export const details = [{
  title: '风轮两立',
  params: { team: false },
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: '开Q满被动E',
  params: { e: 1, layer: 5, team: false },
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: '靖妖傩舞·首插',
  params: {
    layer: 1,
    team: false
  },
  dmg: ({ talent }, dmg) => dmg(talent.a['低空/高空坠地冲击伤害'][1], 'a3')
}, {
  title: '靖妖傩舞·尾插',
  params: {
    layer: 5,
    team: false
  },
  dmg: ({ talent }, dmg) => dmg(talent.a['低空/高空坠地冲击伤害'][1], 'a3')
}, {
  title: '魈珐班开Q满被动E',
  params: {
    e: 1,
    layer: 5,
    team: true
  },
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: '魈珐班开Q首插',
  params: {
    layer: 1,
    team: true
  },
  dmg: ({ talent }, dmg) => dmg(talent.a['低空/高空坠地冲击伤害'][1], 'a3')
}, {
  title: '魈珐班开Q尾插',
  params: {
    layer: 5,
    team: true
  },
  dmg: ({ talent }, dmg) => dmg(talent.a['低空/高空坠地冲击伤害'][1], 'a3')
}]

export const defDmgIdx = 6
export const mainAttr = 'atk,cpct,cdmg,dmg'

export const defParams = {
  layer: 0,
  team: true
}

export const buffs = [{
  title: '靖妖傩舞：下落攻击伤害提升[a3Dmg]%',
  data: {
    a3Dmg: ({ talent }) => talent.q['普通攻击/重击/下落攻击伤害提升']
  }
}, {
  title: '魈天赋：开Q后每3秒伤害提升5%，满层提高25%',
  data: {
    dmg: ({ params }) => params.layer * 5
  }
}, {
  title: '魈被动：3层E使E的伤害提高45%',
  data: {
    eDmg: ({ params }) => params.e ? 45 : 0
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
  check: ({ params }) => params.team === true,
  title: '满命珐露珊：获得[dmg]%增伤,获得[kx]%减抗,获得[cdmg]%爆伤',
  data: {
    dmg: 40,
    kx: 30,
    cdmg: 40
  }
}]
