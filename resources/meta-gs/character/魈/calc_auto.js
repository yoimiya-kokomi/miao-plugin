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
  title: '魈珐闲芙·开Q满被动E',
  params: {
    e: 1,
    layer: 5,
    team: true
  },
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: '魈珐闲芙·开Q首插',
  params: {
    layer: 1,
    team: true
  },
  dmg: ({ talent }, dmg) => dmg(talent.a['低空/高空坠地冲击伤害'][1], 'a3')
}, {
  title: '魈珐闲芙·开Q尾插',
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
  check: ({ params, cons }) => params.team === true && cons <= 1,
  title: '0命芙宁娜：获得[dmg]%增伤',
  data: {
    dmg: ({ params }) => params.layer * 15
  }
}, {
  check: ({ params, cons }) => params.team === true && cons > 1,
  title: '2命芙宁娜：获得[dmg]%增伤',
  data: {
    dmg: 100
  }
}, {
  check: ({ params, cons }) => params.team === true && cons <= 1,
  title: '0命精1鹤鸣闲云：获得[a3Dmg]%下落攻击增伤，[a3Plus]下落攻击伤害值加成，[a3Cpct]%下落攻击暴击率提高',
  data: {
    a3Dmg: 28,
    a3Plus: 9000,
    a3Cpct: 10
  }
}, {
  check: ({ params, cons }) => params.team === true && cons > 1 && cons < 6,
  title: '2命精1鹤鸣闲云：获得[a3Dmg]%下落攻击增伤，[a3Plus]下落攻击伤害值加成，[a3Cpct]%下落攻击暴击率提高',
  data: {
    a3Dmg: 28,
    a3Plus: 18000,
    a3Cpct: 10
  }
}, {
  check: ({ params, cons }) => params.team === true && cons >= 6,
  title: '2命精5鹤鸣闲云：获得[a3Dmg]%下落攻击增伤，[a3Plus]下落攻击伤害值加成，[a3Cpct]%下落攻击暴击率提高',
  data: {
    a3Dmg: 80,
    a3Plus: 18000,
    a3Cpct: 10
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
