export const details = [{
  title: '重云E伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, ({ cons }) => {
  let count = cons === 6 ? 4 : 3
  return {
    title: `Q ${count}柄灵刃总伤害`,
    dmg: ({ talent, cons }, dmg) => dmg(talent.q['技能伤害'] * count, 'q')
  }
}]

export const defDmgIdx = 1
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '重云6命：对于生命百分比低于重云的敌人伤害提升15%，同时额外多一柄灵刃',
  cons: 6,
  data: {
    qDmg: 15
  }
}]
