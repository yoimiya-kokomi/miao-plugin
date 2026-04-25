export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '战技对单80好活伤害',
  params: { punchline: 80 },
  dmg: ({ talent }, dmg) => {
    let a = dmg(talent.e['技能伤害'], 'e')
    let b = dmg(talent.t['技能伤害'], 'xe', 'elation')
    return {
      dmg: a.dmg + b.dmg,
      avg: a.avg + b.avg,
    }
  }
}, {
  title: '战技对三80好活伤害',
  params: { punchline: 80 },
  dmg: ({ talent }, dmg) => {
    let a = dmg(talent.e['技能伤害'], 'e')
    let b = dmg(talent.t['技能伤害'], 'xe', 'elation')
    return {
      dmg: a.dmg + b.dmg * 3,
      avg: a.avg + b.avg * 3,
    }
  }
}, {
  title: '战技对单900好活伤害',
  params: { punchline: 900 },
  dmg: ({ talent }, dmg) => {
    let a = dmg(talent.e['技能伤害'], 'e')
    let b = dmg(talent.t['技能伤害'], 'xe', 'elation')
    return {
      dmg: a.dmg + b.dmg,
      avg: a.avg + b.avg,
    }
  }
}, {
  title: '战技对三900好活伤害',
  params: { punchline: 900 },
  dmg: ({ talent }, dmg) => {
    let a = dmg(talent.e['技能伤害'], 'e')
    let b = dmg(talent.t['技能伤害'], 'xe', 'elation')
    return {
      dmg: a.dmg + b.dmg * 3,
      avg: a.avg + b.avg * 3,
    }
  }
}, {
  title: '50笑点欢愉技伤害',
  params: { punchline: 50 },
  dmg: ({ talent }, dmg) => dmg(talent.xe['技能单体伤害'] + talent.xe['技能均分伤害'], 'xe', 'elation')
}]

export const defDmgIdx = 1
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '行迹-快哉快哉：若开拓者的攻击力高于1000点，每超过200点攻击力可使自身欢愉度提高10%，最多提高60%',
  tree: 1,
  data: {
    joyPct: ({ attr }) => Math.min(Math.trunc((attr.atk - 1000) / 200 * 10), 60)
  }
}, {
  title: '行迹-跟你爆了：自身暴击率提高[cpct]%',
  tree: 2,
  data: {
    cpct: 15
  }
}, {
  title: '笑点计算：计算笑点用',
  data: {
    punchline: ({ params }) => params.punchline
  }
}, {
  title: '4魂：施放欢愉技时，使敌方目标受到的伤害提高[enemydmg]%',
  cons: 4,
  data: {
    enemydmg: 10
  }
}, {
  title: '6魂：使自身暴击伤害提高[cdmg]%',
  cons: 6,
  data: {
    cdmg: 100
  }
}]

export const createdBy = '欧阳青瓜'
