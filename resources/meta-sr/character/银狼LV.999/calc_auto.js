export const details = [{
  title: '普攻对单60好活伤害',
  params: { punchline: 60 },
  dmg: ({ talent }, dmg) => {
    return {
      dmg: dmg(talent.a['技能伤害'], 'a').dmg + dmg(talent.t['普攻战技技能伤害'], 'xe', 'elation').dmg,
      avg: dmg(talent.a['技能伤害'], 'a').avg + dmg(talent.t['普攻战技技能伤害'], 'xe', 'elation').avg
    }
  }
}, {
  title: '战技对单60好活伤害',
  params: { punchline: 60 },
  dmg: ({ talent }, dmg) => {
    return {
      dmg: dmg(talent.e['技能伤害'], 'e').dmg + dmg(talent.t['普攻战技技能伤害'], 'xe', 'elation').dmg,
      avg: dmg(talent.e['技能伤害'], 'e').avg + dmg(talent.t['普攻战技技能伤害'], 'xe', 'elation').avg
    }
  }
}, {
  title: '120好活盲盒伤害',
  params: { punchline: 120, q: true },
  dmg: ({ talent }, dmg) => dmg(talent.q['盲盒伤害'], 'xe', 'elation')
}, {
  title: '150好活强普',
  params: { punchline: 150, a2: true, q: true },
  dmg: ({ talent }, dmg) => dmg((talent.a2['弹射伤害'] + talent.q['盲盒伤害'] + talent.a2['均分伤害']) * 1.3, 'xe', 'elation')
}, {
  title: '150好活强普加3次超大剑',
  params: { punchline: 150, a2: true, q: true },
  dmg: ({ talent }, dmg) => dmg(((talent.a2['弹射伤害'] + talent.q['盲盒伤害']) * 1.2 + talent.a2['均分伤害']) * 1.3, 'xe', 'elation')
}, {
  title: '100笑点欢愉技伤害',
  params: { punchline: 100, xe: true, q: true },
  dmg: ({ talent }, dmg) => dmg(talent.xe2['弹射伤害'] * 6, 'xe', 'elation')
}]

export const defDmgIdx = 5
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '藿藿1魂：我方全体目标速度提高[speedPct]%',
  data: {
    speedPct: 12
  }
}, {
  title: '行迹-假结局速通攻略：速度大于等于160时，使自身欢愉度提高50%，之后每超过1点速度使自身欢愉度提高2%',
  tree: 1,
  data: {
    joy: ({ attr }) => attr.speed >= 160 ? 50 + Math.min(Math.trunc((attr.speed - 160) * 2), 200) : 0
  }
}, {
  title: '强化普攻加成：强化普攻期间造成的伤害提高原伤害的30%'
}, {
  title: '笑点计算：计算笑点用',
  data: {
    punchline: ({ params }) => params.punchline
  }
}, {
  title: '狼尊1魂：敌方目标受到的伤害提高[enemydmg]%',
  check: ({ params }) => params.q === true,
  cons: 1,
  data: {
    enemydmg: 20
  }
}, {
  title: '狼尊4魂：【无敌玩家】状态下的欢愉技伤害额外计入5倍的笑点',
  check: ({ params }) => params.q && params.xe === true,
  cons: 4,
  data: {
    punchline: ({ params }) => params.punchline * 6
  }
}, {
  title: '狼尊6魂：强化普攻期间造成的欢愉伤害增笑[merrymakes]%，植入【禁限弱点】后抗性降低20%',
  check: ({ params }) => params.a2 === true,
  cons: 6,
  data: {
    merrymakes: 50,
    kx: 20
  }
}, {
  title: '爻光大招：我方全体目标全属性抗性穿透提高[kx]%',
  data: {
    kx: 20
  }
}, {
  title: '爻光天赋：【凶星低语】状态下的敌方目标受到的伤害提高[ememydmg]%',
  data: {
    ememydmg: 16
  }
}, {
  title: '爻光专武：我方全体暴击率提高[cpct]%，暴击伤害提高[cdmg]%',
  data: {
    cpct: 10,
    cdmg: 30
  }
}, {
  title: '爻光1魂：全体目标造成欢愉伤害时无视目标[ignore]%防御力',
  data: {
    ignore: 20
  }
}, {
  title: '火花行迹：我方全体暴击伤害提高[cdmg]%',
  data: {
    cdmg: 80
  }
}, {
  title: '狼尊隐藏分：240',
  data: {
    cpct: ({ attr }) => attr.cpct >= 100 ? 0 : 100 - attr.cpct,
    cdmg: ({ attr }) => { return 140 + attr.cpct }
  }
}]

export const createdBy = '欧阳青瓜'
