export const details = [{
  title: '普攻对单60好活伤害',
  params: { punchline: 60 },
  dmg: ({ talent }, dmg) => {
    let a = dmg(talent.a['技能伤害'], 'a')
    let b = dmg(talent.t['普攻战技技能伤害'], 'xe', 'elation')
    return {
      dmg: a.dmg + b.dmg,
      avg: a.avg + b.avg,
    }
  }
}, {
  title: '战技对单60好活伤害',
  params: { punchline: 60 },
  dmg: ({ talent }, dmg) => {
    let a = dmg(talent.e['技能伤害'], 'e')
    let b = dmg(talent.t['普攻战技技能伤害'], 'xe', 'elation')
    return {
      dmg: a.dmg + b.dmg,
      avg: a.avg + b.avg,
    }
  }
}, {
  title: '100好活头号补给盲盒伤害',
  params: { punchline: 100 },
  dmg: ({ talent }, dmg) => dmg(talent.q['盲盒伤害'], 'xe', 'elation')
}, {
  title: '100好活超超超大剑',
  params: { punchline: 100 },
  dmg: ({ talent }, dmg) => {
    let a = dmg(talent.a['技能伤害'], 'a')
    return {
      dmg: a.dmg * 0.2,
      avg: a.avg * 0.2,
    }
  }
}, {
  title: '100好活强化普攻',
  params: { punchline: 100, a2: true },
  dmg: ({ talent }, dmg) => {
    let a = dmg(talent.a2['弹射伤害'], 'xe', 'elation')
    let b = dmg(talent.a2['均分伤害'], 'xe', 'elation')
    return {
      dmg: a.dmg + b.dmg,
      avg: a.avg + b.avg,
    }
  }
}, {
  title: '百活强普三大剑',
  params: { punchline: 100, a2: true },
  dmg: ({ talent }, dmg) => {
    let a = dmg(talent.a2['弹射伤害'], 'xe', 'elation')
    let b = dmg(talent.a2['均分伤害'], 'xe', 'elation')
    return {
      dmg: a.dmg * 1.2 + b.dmg,
      avg: a.avg * 1.2 + b.avg,
    }
  }
}, {
  title: '60笑点欢愉技伤害',
  params: { punchline: 60, xe: true, q: true },
  dmg: ({ talent }, dmg) => dmg(talent.xe2['弹射伤害'] * 6, 'xe', 'elation')
}]

export const defDmgIdx = 5
export const mainAttr = 'speed,cpct,cdmg,atk'

export const buffs = [{
  title: '行迹-假结局速通攻略：速度大于等于160时，使自身欢愉度提高50%，之后每超过1点速度使自身欢愉度提高2%',
  tree: 1,
  data: {
    joyPct: ({ attr }) => attr.speed >= 160 ? 50 + Math.min(Math.trunc((attr.speed - 160) * 2), 200) : 0
  }
}, {
  title: '强化普攻加成：强化普攻期间造成的伤害提高原伤害的30%',
  check: ({ params }) => params.a2 === true,
  data: {
    multi: 30
  }
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
  title: '狼尊4魂：【无敌玩家】状态下的欢愉技伤害额外计入5倍的笑点%',
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
}]

export const createdBy = '欧阳青瓜'
