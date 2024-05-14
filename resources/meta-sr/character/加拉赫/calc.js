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
  title: '加拉赫6命：击破特攻提高[stance]%',
  cons: 6,
  data: {
    stance: 20
  }
}]

export const createdBy = 'Aluxes'
