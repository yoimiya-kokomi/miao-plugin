export const details = [{
  title: 'E技能伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: 'E「冻霜芭菲」伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['冻霜芭菲伤害'], 'e')
}, {
  title: 'Q技能伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}, {
  title: 'Q释放治疗量',
  dmg: ({ talent, attr, calc }, { heal }) => heal(talent.q['治疗量2'][0] / 100 * calc(attr.atk) + talent.q['治疗量2'][1])
}, {
  title: '天赋每跳治疗',
  dmg: ({ attr, calc }, { heal }) => heal(138.24 / 100 * calc(attr.atk))
}, {
  title: '6命「特级冻霜芭菲」伤害',
  cons: 6,
  dmg: ({}, dmg) => dmg(500, 'e')
}]

export const defDmgIdx = 1
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '爱可菲天赋：当队伍中存在4名水/冰元素角色时，爱可菲的元素战技或元素爆发命中敌人后，将使该敌人的水元素抗性与冰元素抗性降低[kx]%',
  data: {
    kx: 55
  }
}, {
  title: '爱可菲1命：队伍中所有角色的元素类型均为水/冰元素时，爱可菲施放元素战技或元素爆发后，冰元素伤害的暴击伤害提升[cdmg]%',
  cons: 1,
  data: {
    cdmg: 60
  }
}]

export const createdBy = '冰翼'
