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
  title: '120好活头号补给盲盒伤害',
  params: { punchline: 120, q: true },
  dmg: ({ talent }, dmg) => dmg(talent.q['盲盒伤害'], 'xe', 'elation')
}, {
  title: '120好活超超超大剑',
  params: { punchline: 120, q: true },
  dmg: ({ talent }, dmg) => dmg(talent.q['盲盒伤害'] * 0.2, 'xe', 'elation')
}, {
  title: '120好活强化普攻',
  params: { punchline: 120, a2: true, q: true },
  dmg: ({ talent }, dmg) => {
    return {
      dmg: dmg(talent.a2['弹射伤害'], 'xe', 'elation').dmg + dmg(talent.a2['均分伤害'], 'xe', 'elation').dmg,
      avg: dmg(talent.a2['弹射伤害'], 'xe', 'elation').avg + dmg(talent.a2['均分伤害'], 'xe', 'elation').avg
    }
  }
}, {
  title: '120好活强化普攻加3次超超超大剑',
  params: { punchline: 120, a2: true, q: true },
  dmg: ({ talent }, dmg) => {
    return {
      dmg: dmg(talent.a2['弹射伤害'] * 1.2, 'xe', 'elation').dmg + dmg(talent.a2['均分伤害'], 'xe', 'elation').dmg,
      avg: dmg(talent.a2['弹射伤害'] * 1.2, 'xe', 'elation').avg + dmg(talent.a2['均分伤害'], 'xe', 'elation').avg
    }
  }
}, {
  title: '100笑点欢愉技伤害',
  params: { punchline: 100, xe: true, q: true },
  dmg: ({ talent }, dmg) => dmg(talent.xe2['弹射伤害'] * 6, 'xe', 'elation')
}]

export const defDmgIdx = 5
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '行迹-假结局速通攻略：速度大于等于160时，使自身欢愉度提高50%，之后每超过1点速度使自身欢愉度提高2%',
  tree: 1,
  data: {
    joy: ({ attr }) => attr.speed >= 160 ? 50 + Math.min(Math.trunc((attr.speed - 160) * 2), 200) : 0
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
