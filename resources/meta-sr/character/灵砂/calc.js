export const details = [{
  title: '战技治疗量',
  dmg: ({ talent, calc, attr }, { heal }) => heal(calc(attr.atk) * talent.e['回复·百分比攻击'] + talent.e['回复·固定值'])
}, {
  title: '终结技治疗量',
  dmg: ({ talent, calc, attr }, { heal }) => heal(calc(attr.atk) * talent.q['回复·百分比攻击'] + talent.q['回复·固定值'])
}, {
  title: '召唤物治疗量',
  dmg: ({ talent, calc, attr }, { heal }) => heal(calc(attr.atk) * talent.t['回复·百分比攻击'] + talent.t['回复·固定值'])
}, {
  title: '终结技击破(小怪)',
  params: { qBuff: true },
  dmg: ({ talent, attr, cons }, dmg) => {
    let atkDmg = dmg(talent.q['技能伤害'], 'q')
    let BreakAvg = dmg.reaction('fireBreak').avg / 0.9  * ( 2 + 2 ) / 4
    return {
      dmg: atkDmg.dmg + BreakAvg,
      avg: atkDmg.avg + BreakAvg
    }
  }
}, {
  title: '终结技击破(精英怪)',
  params: { qBuff: true },
  dmg: ({ talent, attr, cons }, dmg) => {
    let atkDmg = dmg(talent.q['技能伤害'], 'q')
    let BreakAvg = dmg.reaction('fireBreak').avg / 0.9  * ( 10 + 2 ) / 4
    return {
      dmg: atkDmg.dmg + BreakAvg,
      avg: atkDmg.avg + BreakAvg
    }
  }
}]

export const mainAttr = 'atk,stance'
export const defDmgIdx = 4

export const buffs = [{
  title: '灵砂终结技：使敌方全体受到的击破伤害提高[breakEnemydmg]%',
  check: ({ params }) => params.qBuff === true,
  data: {
    breakEnemydmg: ({ talent }) => talent.q['受到击破伤害提高'] * 100
  }
}, {
  title: '行迹-朱燎：基于自身击破特攻，使自身攻击力提高[atk]%，治疗量提高[heal]%',
  tree: 1,
  data: {
    atk: ({ attr }) => Math.min(attr.stance * 0.25, 50),
    heal: ({ attr }) => Math.min(attr.stance * 0.1, 20)
  }
}, {
  title: '灵砂1魂：当有敌方单位的弱点被击破时，使其防御力降低[enemyDef]%',
  cons: 1,
  data: {
    enemyDef: 20
  }
}, {
  title: '灵砂2魂：施放终结技时，使我方全体击破特攻提高[stance]%',
  cons: 2,
  data: {
    stance: 20
  }
},{
  title: '灵砂6魂：【浮元】在场时，使敌方全体全属性抗性降低[kx]%',
  cons: 6,
  check: ({ params }) => params.q === true,
  data: {
    kx: 20
  }
}]

export const createdBy = '五里徘徊'
