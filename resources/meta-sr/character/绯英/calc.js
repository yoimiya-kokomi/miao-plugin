export const details = [{
  title: '战技千活伤害对三',
  params: { punchline: 1000 },
  dmg: ({ talent }, dmg) => {
    return {
      dmg: dmg(talent.e['目标技能伤害'] * 2, 'e').dmg + dmg(talent.t['战技欢愉伤害'], 'xe', 'elation').dmg,
      avg: dmg(talent.e['目标技能伤害'] * 2, 'e').avg + dmg(talent.t['战技欢愉伤害'], 'xe', 'elation').avg
    }
  }
}, {
  title: '终结技千活伤害对单',
  params: { punchline: 1000 },
  dmg: ({ talent }, dmg) => {
    return {
      dmg: dmg(talent.q['技能伤害'] + talent.q['技能弹射伤害'] * 9, 'q').dmg +
        dmg(talent.t['大招欢愉伤害'] + talent.t['大招欢愉弹射伤害'] * 9, 'xe', 'elation').dmg,
      avg: dmg(talent.q['技能伤害'] + talent.q['技能弹射伤害'] * 9, 'q').avg +
        dmg(talent.t['大招欢愉伤害'] + talent.t['大招欢愉弹射伤害'] * 9, 'xe', 'elation').avg
    }
  }
}, {
  title: '终结技千活伤害对三',
  params: { punchline: 1000 },
  dmg: ({ talent }, dmg) => {
    return {
      dmg: dmg(talent.q['技能伤害'] + talent.q['技能弹射伤害'] * 6, 'q').dmg +
        dmg(talent.t['大招欢愉伤害'] + talent.t['大招欢愉弹射伤害'] * 6, 'xe', 'elation').dmg,
      avg: dmg(talent.q['技能伤害'] + talent.q['技能弹射伤害'] * 6, 'q').avg +
        dmg(talent.t['大招欢愉伤害'] + talent.t['大招欢愉弹射伤害'] * 6, 'xe', 'elation').avg
    }
  }
}, {
  title: '狐狸老师千活追击伤害对单',
  params: { punchline: 1000 },
  dmg: ({ talent }, dmg) => {
    return {
      dmg: dmg(talent.t['追加攻击伤害'], 't').dmg + dmg(talent.t['追加攻击欢愉伤害'], 'xe', 'elation').dmg,
      avg: dmg(talent.t['追加攻击伤害'], 't').avg + dmg(talent.t['追加攻击欢愉伤害'], 'xe', 'elation').avg
    }
  }
}, {
  title: '狐狸老师千活追击伤害对三',
  params: { punchline: 1000 },
  dmg: ({ talent }, dmg) => {
    return {
      dmg: dmg(talent.t['追加攻击伤害'] * 3, 't').dmg + dmg(talent.t['追加攻击欢愉伤害'] * 3, 'xe', 'elation').dmg,
      avg: dmg(talent.t['追加攻击伤害'] * 3, 't').avg + dmg(talent.t['追加攻击欢愉伤害'] * 3, 'xe', 'elation').avg
    }
  }
}, {
  title: '80笑点欢愉技伤害',
  params: { punchline: 80 },
  dmg: ({ talent }, dmg) => dmg(talent.xe['技能伤害'], 'xe', 'elation')
}]

export const defDmgIdx = 2
export const mainAttr = 'atk,cpct,cdmg,recharge'

export const buffs = [{
  title: '天赋：绯英获得等同于暴击伤害20%的欢愉度',
  data: {
    joy: ({ attr }) => attr.cdmg * 20
  }
}, {
  title: '行迹-瞰众乐：绯英的暴击率提高30%',
  tree: 1,
  data: {
    cpct: 30
  }
}, {
  title: '行迹-行裁断：狐狸老师】施放攻击时会额外对目标施加易伤，使其受到的伤害提高12%',
  tree: 1,
  data: {
    enemydmg: 12
  }
}, {
  title: '笑点计算：计算笑点用',
  data: {
    punchline: ({ params }) => params.punchline
  }
}, {
  title: '绯英1魂：全属性抗性穿透提高[kx]%',
  cons: 1,
  data: {
    kx: 20
  }
}, {
  title: '绯英2魂：暴击伤害提高36%',
  cons: 2,
  data: {
    cdmg: 36
  }
}, {
  title: '绯英4魂：绯英造成的伤害无视敌方目标[ignore]%的防御力',
  cons: 4,
  data: {
    ignore: 15
  }
}, {
  title: '绯英6魂：绯英造成的欢愉伤害增笑15%，每持有100点【好活当赏】额外增笑2%，最高计入1000点',
  cons: 6,
  data: {
    merrymakes: 35
  }
}]

export const createdBy = '欧阳青瓜'
