export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '强化普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a2['技能伤害'], 'a')
}, {
  title: '战技生命回复',
  dmg: ({ talent }, { heal }) => heal(talent.e['生命值回复'])
}, {
  title: '天赋生命回复',
  dmg: ({ talent }, { heal }) => heal(talent.t['生命值回复'])
}, {
  title: '开阮加·普攻超击破伤害',
  params: { team: true },
  dmg: ({ cons }, { reaction }) => {
    // 加拉赫6命提高20%弱点击破效率，阮梅提供50%弱点击破效率
    let cost = 1 * ((cons < 6 ? 1 : 1.2) + 0.5)
    return {
      avg: reaction('superBreak').avg / 0.9 * cost * 1.6 // 同谐主提供1.6独立增伤乘区
    }
  }
}, {
  title: '开阮加·强化普攻超击破伤害',
  params: { team: true },
  dmg: ({ cons }, { reaction }) => {
    // 加拉赫6命提高20%弱点击破效率，阮梅提供50%弱点击破效率
    let cost = 3 * ((cons < 6 ? 1 : 1.2) + 0.5)
    return {
      avg: reaction('superBreak').avg / 0.9 * cost * 1.6 // 同谐主提供1.6独立增伤乘区
    }
  }
}, {
  title: '开阮加·终结技超击破伤害',
  params: { team: true },
  dmg: ({ cons }, { reaction }) => {
    // 加拉赫6命提高20%弱点击破效率，阮梅提供50%弱点击破效率
    let cost = 2 * ((cons < 6 ? 1 : 1.2) + 0.5)
    return {
      avg: reaction('superBreak').avg / 0.9 * cost * 1.6 // 同谐主提供1.6独立增伤乘区
    }
  }
}]

export const mainAttr = 'atk,heal,stance'
export const defDmgIdx = 3

export const buffs = [{
  title: '行迹-崭新配方：基于自身击破特攻，提高治疗量[heal]%',
  tree: 1,
  sort: 9,
  data: {
    heal: ({ attr }) => Math.min(attr.stance * 0.5, 75)
  }
}, {
  title: '天赋-鏖战正酣：终结技Debuff使敌方受到的击破伤害提高[breakEnemydmg]%',
  data: {
    breakEnemydmg: ({ talent }) => talent.t['击破伤害提高'] * 100
  }
}, {
  title: '加拉赫1命：效果抵抗提高[effDef]%',
  cons: 1,
  data: {
    effDef: 50
  }
}, {
  title: '加拉赫6命：击破特攻提高[stance]%，弱点击破效率提高20%',
  cons: 6,
  data: {
    stance: 20
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
  title: '6魂钟表匠开拓者：提高击破特攻[stance]%，场上敌人数量为1时，超击破伤害提高60%',
  check: ({ params }) => params.team === true,
  data: {
    stance: 30 + 30 + 300 * 0.15 // 终结技30+钟表匠30+四命转化
  }
}]

export const createdBy = 'Aluxes'
