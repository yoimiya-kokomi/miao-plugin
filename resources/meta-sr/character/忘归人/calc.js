export const details = [{
  title: '强化普攻对三击破(精英怪)',
  check: ({ cons }) => cons < 6,
  dmg: ({ talent, attr, cons }, dmg) => {
    let atkDmg1 = dmg(talent.a2['技能伤害'], 'a')
    let atkDmg2 = dmg(talent.a2['相邻目标伤害'], 'a')
    let BreakAvg = dmg.reaction('fireBreak').avg / 0.9  * ( 10 + 2 ) / 4 * (1 + (cons >= 6 ? 0.2 : 0))
    return {
      dmg: atkDmg1.dmg + BreakAvg + 2 * (atkDmg2.dmg + BreakAvg),
      avg: atkDmg1.avg + BreakAvg + 2 * (atkDmg2.avg + BreakAvg)
    }
  }
}, {
  title: '持【狐祈】强化普攻对三击破(精英怪)',
  params: { eBuff: true },
  dmg: ({ talent, attr, cons }, dmg) => {
    let atkDmg1 = dmg(talent.a2['技能伤害'], 'a')
    let atkDmg2 = dmg(talent.a2['相邻目标伤害'], 'a')
    let BreakAvg = dmg.reaction('fireBreak').avg / 0.9  * ( 10 + 2 ) / 4 * (1 + (cons >= 4 ? 0.2 : 0))
    return {
      dmg: atkDmg1.dmg + BreakAvg + 2 * (atkDmg2.dmg + BreakAvg),
      avg: atkDmg1.avg + BreakAvg + 2 * (atkDmg2.avg + BreakAvg)
    }
  }
}, {
  title: '破韧后强化普攻对三伤害',
  check: ({ cons }) => cons < 6,
  dmg: ({ talent, attr, cons }, dmg) => {
    let atkDmg1 = dmg(talent.a2['技能伤害'], 'a')
    let atkDmg2 = dmg(talent.a2['相邻目标伤害'], 'a')
    let cost1 = 1 * (1 + (cons >= 6 ? 1 : 0))
    let cost2 = 0.5 * (1 + (cons >= 6 ? 1 : 0))
    let base = talent.t['超击破伤害']
    let superBreak1 = dmg.reaction('superBreak').avg / 0.9 * cost1 * base
    let superBreak2 = dmg.reaction('superBreak').avg / 0.9 * cost2 * base
    return {
      dmg: atkDmg1.dmg + superBreak1 + 2 * (atkDmg2.dmg + superBreak2),
      avg: atkDmg1.avg + superBreak1 + 2 * (atkDmg2.avg + superBreak2)
    }
  }
}, {
  title: '持【狐祈】破韧后强化普攻对三伤害',
  params: { eBuff: true },
  dmg: ({ talent, attr, cons }, dmg) => {
    let atkDmg1 = dmg(talent.a2['技能伤害'], 'a')
    let atkDmg2 = dmg(talent.a2['相邻目标伤害'], 'a')
    let cost1 = 1 * (1 + (cons >= 1 ? 0.5 : 0) + (cons >= 6 ? 0.5 : 0))
    let cost2 = 0.5 * (1 + (cons >= 1 ? 0.5 : 0) + (cons >= 6 ? 0.5 : 0))
    let base = talent.t['超击破伤害']
    let superBreak1 = dmg.reaction('superBreak').avg / 0.9 * cost1 * base
    let superBreak2 = dmg.reaction('superBreak').avg / 0.9 * cost2 * base
    return {
      dmg: atkDmg1.dmg + superBreak1 + 2 * (atkDmg2.dmg + superBreak2),
      avg: atkDmg1.avg + superBreak1 + 2 * (atkDmg2.avg + superBreak2)
    }
  }
}, {
  title: '终结技对三击破(精英怪)',
  check: ({ cons }) => cons < 6,
  dmg: ({ talent, attr, cons }, dmg) => {
    let atkDmg = dmg(talent.q['技能伤害'], 'q')
    let BreakAvg = dmg.reaction('fireBreak').avg / 0.9  * ( 10 + 2 ) / 4 * (1 + (cons >= 6 ? 0.2 : 0))
    return {
      dmg: 3 * (atkDmg.dmg + BreakAvg),
      avg: 3 * (atkDmg.avg + BreakAvg)
    }
  }
}, {
  title: '持【狐祈】终结技对三击破(精英怪)',
  params: { eBuff: true },
  dmg: ({ talent, attr, cons }, dmg) => {
    let atkDmg = dmg(talent.q['技能伤害'], 'q')
    let BreakAvg = dmg.reaction('fireBreak').avg / 0.9  * ( 10 + 2 ) / 4 * (1 + (cons >= 4 ? 0.2 : 0))
    return {
      dmg: 3 * (atkDmg.dmg + BreakAvg),
      avg: 3 * (atkDmg.avg + BreakAvg)
    }
  }
}, {
  title: '破韧后终结技对三伤害',
  check: ({ cons }) => cons < 6,
  dmg: ({ talent, attr, cons }, dmg) => {
    let atkDmg = dmg(talent.q['技能伤害'], 'q')
    let cost = 2 * (1 + (cons >= 6 ? 1 : 0))
    let base = talent.t['超击破伤害']
    let superBreak = dmg.reaction('superBreak').avg / 0.9 * cost * base
    return {
      dmg: 3 * (atkDmg.dmg + superBreak),
      avg: 3 * (atkDmg.avg + superBreak)
    }
  }
}, {
  title: '持【狐祈】破韧后终结技对三伤害',
  params: { eBuff: true },
  dmg: ({ talent, attr, cons }, dmg) => {
    let atkDmg = dmg(talent.q['技能伤害'], 'q')
    let cost = 2 * (1 + (cons >= 1 ? 0.5 : 0) + (cons >= 6 ? 0.5 : 0))
    let base = talent.t['超击破伤害']
    let superBreak = dmg.reaction('superBreak').avg / 0.9 * cost * base
    return {
      dmg: 3 * (atkDmg.dmg + superBreak),
      avg: 3 * (atkDmg.avg + superBreak)
    }
  }
}]

export const mainAttr = 'atk,stance'
export const defDmgIdx = 7

export const buffs = [{
  title: '灵砂战技：使指定我方单体击破特攻提高[stance]%，使敌方防御降低[enemyDef]%',
  check: ({ params }) => params.eBuff === true,
  data: {
    stance: ({ talent }) => talent.e['击破特攻提高'] * 100,
    enemyDef: ({ talent }) => talent.e['防御力降低'] * 100
  }
}, {
  title: '行迹-涂山玄设：使自身击破特攻提高[stance]%',
  tree: 2,
  data: {
    stance: 30
  }
}, {
  title: '忘归人1魂：持有【狐祈】的我方目标，弱点击破效率提高50%',
  cons: 1
}, {
  title: '忘归人4魂：持有【狐祈】的我方目标，造成的击破伤害提高20%',
  cons: 4
},{
  title: '忘归人6魂：忘归人的弱点击破效率提高50.0%。【狐祈】效果对我方全体生效。',
  cons: 6
}]

export const createdBy = '五里徘徊'
