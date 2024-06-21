// 强化战技 主目标3削韧，副目标1.5削韧

export const details = [{
  title: '强化战技伤害',
  params: { q: true },
  dmg: ({ talent, attr }, dmg) => {
    let td = talent.e2['目标伤害'] + Math.min(attr.stance * 0.2, 72) / 100
    return dmg(td, 'e')
  }
}, {
  title: '破韧后战技主目标伤害',
  params: { q: true },
  dmg: ({ talent, attr, cons }, dmg) => {
    let td = talent.e2['目标伤害'] + Math.min(attr.stance * 0.2, 72) / 100
    let atkDmg = dmg(td, 'e')
    // 弱点击破效率：自身50%，六命50%
    let cost = 3 * (1 + 0.5 + (cons >= 6 ? 0.5 : 0))
    let base = 0
    if (attr.stance >= 360) {
      base = 0.5
    } else if (attr.stance >= 200) {
      base = 0.35
    }
    let superBreak = dmg.reaction('superBreak').avg / 0.9 * cost * base
    return {
      dmg: atkDmg.dmg + superBreak,
      avg: atkDmg.avg + superBreak
    }
  }
}, {
  title: '破韧后战技副目标伤害',
  params: { q: true },
  dmg: ({ talent, attr, cons }, dmg) => {
    let td = talent.e2['相邻目标伤害'] + Math.min(attr.stance * 0.1, 36) / 100
    let atkDmg = dmg(td, 'e')
    // 弱点击破效率：自身50%，六命50%
    let cost = 1.5 * (1 + 0.5 + (cons >= 6 ? 0.5 : 0))
    let base = 0
    if (attr.stance >= 360) {
      base = 0.5
    } else if (attr.stance >= 200) {
      base = 0.35
    }
    let superBreak = dmg.reaction('superBreak').avg / 0.9 * cost * base
    return {
      dmg: atkDmg.dmg + superBreak,
      avg: atkDmg.avg + superBreak
    }
  }
}, {
  title: '流开阮加·战技主目标伤害',
  params: { q: true, team: true },
  dmg: ({ talent, attr, cons }, dmg) => {
    let td = talent.e2['目标伤害'] + Math.min(attr.stance * 0.2, 72) / 100
    let atkDmg = dmg(td, 'e')
    // 弱点击破效率：自身50%，阮梅50%，六命50%
    let cost = 3 * (1 + 0.5 + 0.5 + (cons >= 6 ? 0.5 : 0))
    let base = 0
    if (attr.stance >= 360) {
      base = 0.5
    } else if (attr.stance >= 200) {
      base = 0.35
    }
    // 自身触发的超击破
    let superBreak = dmg.reaction('superBreak').avg / 0.9 * cost * base
    // 同谐主【伴舞】触发的超击破
    let superBreakTrailblazer = dmg.reaction('superBreak').avg / 0.9 * cost * 1.6 // 同谐主提供1.6独立增伤乘区
    return {
      dmg: atkDmg.dmg + superBreak + superBreakTrailblazer,
      avg: atkDmg.avg + superBreak + superBreakTrailblazer
    }
  }
}, {
  title: '流开阮加·战技副目标伤害',
  params: { q: true, team: true },
  dmg: ({ talent, attr, cons }, dmg) => {
    let td = talent.e2['相邻目标伤害'] + Math.min(attr.stance * 0.1, 36) / 100
    let atkDmg = dmg(td, 'e')
    // 弱点击破效率：自身50%，阮梅50%，六命50%
    let cost = 1.5 * (1 + 0.5 + 0.5 + (cons >= 6 ? 0.5 : 0))
    let base = 0
    if (attr.stance >= 360) {
      base = 0.5
    } else if (attr.stance >= 200) {
      base = 0.35
    }
    // 自身触发的超击破
    let superBreak = dmg.reaction('superBreak').avg / 0.9 * cost * base
    // 同谐主【伴舞】触发的超击破
    let superBreakTrailblazer = dmg.reaction('superBreak').avg / 0.9 * cost * 1.4 // 同谐主提供1.4独立增伤乘区
    return {
      dmg: atkDmg.dmg + superBreak + superBreakTrailblazer,
      avg: atkDmg.avg + superBreak + superBreakTrailblazer
    }
  }
}]

export const mainAttr = 'atk,stance'
export const defDmgIdx = 3

export const buffs = [{
  title: '终结技Buff：速度提高[speed]点，释放强化普攻和战技时弱点击破效率提高50%，使敌方受到的击破伤害提高[breakEnemydmg]%',
  check: ({ params }) => params.q === true,
  data: {
    speed: ({ talent }) => talent.q['速度提高'],
    breakEnemydmg: ({ talent }) => talent.q['击破伤害提高'] * 100
  }
}, {
  title: '行迹-过载核心：基于攻击力，提高自身击破特攻[stance]%',
  check: ({ params, attr }) => params.q === true && attr.atk >= 1800,
  sort: 9,
  tree: 3,
  data: {
    stance: ({ attr }) => Math.floor((attr.atk - 1800) / 10) * 0.8
  }
}, {
  title: '流萤1魂：释放强化战技时无视目标[ignore]%的防御',
  cons: 1,
  data: {
    ignore: 15
  }
}, {
  title: '流萤4魂：终结技状态下，效果抵抗提高[effDef]%',
  cons: 4,
  check: ({ params }) => params.q === true,
  data: {
    effDef: 50
  }
}, {
  title: '流萤6魂：终结技状态下，火属性抗性穿透提高[kx]%，释放强化普攻和战技时的弱点击破效率提高50%',
  cons: 6,
  check: ({ params }) => params.q === true,
  data: {
    kx: 20
  }
}, {
  title: '0魂阮梅：弱点击破效率提高50%，击破特攻提高20%，抗性穿透提高25%，速度提高10%',
  check: ({ params }) => params.team === true,
  data: {
    stance: 20,
    kx: 25,
    speedPct: 10
  }
}, {
  title: '6魂钟表匠开拓者：提高击破特攻[stance]%，场上敌人数量为1时，超击破伤害提高60%。计算副目标伤害时，按3名敌人，超击破伤害提高40%计算',
  check: ({ params }) => params.team === true,
  data: {
    stance: 30 + 30 + 300 * 0.15 // 终结技30+钟表匠30+四命转化
  }
}, {
  title: '加拉赫：敌方受到的击破伤害提高13.2%',
  check: ({ params }) => params.team === true,
  data: {
    breakEnemydmg: 13.2
  }
}]

export const createdBy = 'Aluxes'
