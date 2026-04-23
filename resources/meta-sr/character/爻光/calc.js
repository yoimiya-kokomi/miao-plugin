export const details = [{
  title: '大招欢愉伤害',
  params: { punchline: 20 },
  dmg: ({ talent }, dmg) => dmg(talent.xe['欢愉群攻'] + talent.xe['欢愉弹射'] * 5, 'xe', 'elation')
}, {
  title: '80笑点欢愉技伤害',
  params: { punchline: 80 },
  dmg: ({ talent }, dmg) => dmg(talent.xe['欢愉群攻'] + talent.xe['欢愉弹射'] * 5, 'xe', 'elation')
}, {
  title: '80好活天赋欢愉伤害',
  params: { punchline: 80 },
  dmg: ({ talent }, dmg) => dmg(talent.t['附加伤害'], 't', 'elation')
}]

export const defDmgIdx = 1
export const mainAttr = 'speed,cpct,cdmg'

export const buffs = [{
  title: '凶星低语：【凶星低语】状态下的敌方目标受到的伤害提高[enemydmg]%',
  data: {
    enemydmg: 16
  }
}, {
  title: '行迹-开屏有礼：提高欢愉度[joy]%',
  tree: 1,
  data: {
    joy: ({ attr }) => attr.speed >= 120 ? Math.min(attr.speed - 120 + 30, 230) : 0
  }
}, {
  title: '战技：提高欢愉度[joy]%',
  data: {
    joy: ({ attr }) => (attr.joy.base + attr.joy.pct) * 0.2
  }
}, {
  title: '行迹-神闲意满：提升[cdmg]%暴击伤害',
  tree: 2,
  data: {
    cdmg: 80
  }
}, {
  title: '终结技：抗性穿透提高[kx]%',
  data: {
    kx: 20
  }
}, {
  title: '笑点计算：计算笑点用',
  data: {
    punchline: ({ params }) => params.punchline
  }
}, {
  title: '爻光1魂：终结技阿哈时刻计入笑点数提高至40个。我方全体目标造成欢愉伤害时无视目标[ignore]%防御力',
  cons: 1,
  data: {
    ignore: 20,
    punchline: 20
  }
}, {
  title: '爻光2魂：我方全体目标速度提高[speedPct]%，欢愉度额外提高[joy]%',
  cons: 2,
  data: {
    speedPct: 12,
    joy: 16
  }
}, {
  title: '爻光4魂：我方全体角色欢愉技造成的伤害为原伤害的150%',
  cons: 4,
  data: {
    xeMulti: 100,
    tMulti: 10
  }
}, {
  title: '爻光6魂：欢愉伤害增笑[merrymakes]%。爻光欢愉技的伤害倍率提高原倍率的100%',
  cons: 6,
  data: {
    merrymakes: 25,
    xeMulti: 100
  }
}]

export const createdBy = '欧阳青瓜'
