export const details = [{
  title: '10次战技80好活强化普攻伤害',
  params: { punchline: 80 },
  dmg: ({ talent }, dmg) => {
    let a2Normal = talent.a2['强化普攻目标伤害'] * 2 * (1 + talent.e2['强化普攻目标倍率提升'] / talent.a2['强化普攻目标伤害'] * 10)
    let a2Xe = talent.t['强化普攻目标欢愉伤害'] * 2 * (1 + talent.e2['强化普攻目标倍率提升'] / talent.t['强化普攻目标欢愉伤害'] * 10)
    let eXe = talent.t['强化普攻弹射欢愉伤害'] * 10
    return {
      dmg: dmg(a2Normal, 'a2').dmg + dmg(a2Xe + eXe, 'xe', 'elation').dmg,
      avg: dmg(a2Normal, 'a2').avg + dmg(a2Xe + eXe, 'xe', 'elation').avg
    }
  }
}, {
  title: '终结技伤害',
  dmg: ({ talent, attr }, dmg) => {
    let qNormal = talent.q['终结技'] + (attr.joy.base + attr.joy.pct) / 100 * 0.6
    let qXe = talent.t['终结技欢愉伤害']
    return {
      dmg: dmg(qNormal, 'q').dmg + dmg(qXe, 'xe', 'elation').dmg,
      avg: dmg(qNormal, 'q').avg + dmg(qXe, 'xe', 'elation').avg
    }
  }
}, {
  title: '80笑点欢愉技伤害',
  params: { punchline: 80 },
  dmg: ({ talent }, dmg) => dmg(talent.xe['群攻'] + talent.xe['弹射'] * 20, 'xe', 'elation')
}]

export const defDmgIdx = 1
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '行迹-甜蜜！笑点签售会：使自身欢愉度提高[joy]%',
  tree: 1,
  data: {
    joy: ({ attr }) => Math.min(Math.trunc((attr.atk - 2000) / 100 * 5), 80)
  }
}, {
  title: '行迹-沸腾！真伪调色盘：我方全体暴击伤害提高[cdmg]%',
  tree: 3,
  data: {
    cdmg: 80
  }
}, {
  title: '行迹-神闲意满：提升[cdmg]%暴击伤害',
  tree: 2,
  data: {
    cdmg: 60
  }
}, {
  title: '笑点计算：计算笑点用',
  data: {
    punchline: ({ params }) => params.punchline
  }
}, {
  title: '火花1魂：我方全体全属性抗性穿透提高[kx]%',
  cons: 1,
  data: {
    kx: 15
  }
}, {
  title: '火花2魂：消耗【爆点】使自身暴击伤害提高[cdmg]%',
  cons: 2,
  data: {
    cdmg: 40
  }
}, {
  title: '火花4魂：施放终结技时使自身欢愉度提高[joy]%',
  cons: 4,
  data: {
    joy: 36
  }
}, {
  title: '火花6魂：全属性抗性穿透提高[kx]%。欢愉技每计入1个笑点使其造成的额外伤害次数增加1次，最多增加至40次',
  cons: 6,
  data: {
    kx: 20
  }
}]

export const createdBy = '欧阳青瓜'
