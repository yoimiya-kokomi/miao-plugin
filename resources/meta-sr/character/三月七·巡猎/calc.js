export const details = [{
  title: '强化普攻单次伤害',
  params: { EnhancedBasicAtk: true },
  dmg: ({ talent }, dmg) => dmg(talent.a2['技能伤害'], 'a')
}, {
  title: '终结技伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}]

export const defDmgIdx = 0
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '三月七·巡猎天赋：充能大于等于7点时，三月七立即行动，造成的伤害提高[dmg]%',
  cons: 1,
  data: {
    dmg: ({ talent }) => talent.t['伤害提高'] * 100
  }
}, {
  check: ({ params }) => params.EnhancedBasicAtk === true,
  title: '三月七·巡猎6魂：施放终结技后，下一次强化普攻造成的暴击伤害提高[aCdmg]%',
  cons: 6,
  data: {
    aCdmg: 50
  }
}]

export const createdBy = '冰翼'
