export const details = [{
  title: 'E秘藏瓶装满伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['秘藏瓶装满伤害'], 'e')
}, {
  title: 'E猫猫球伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['猫猫球伤害'], 'e')
}, {
  title: 'Q技能伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}, {
  title: 'Q释放治疗量（通常）',
  dmg: ({ talent, attr, calc }, { heal }) => heal(talent.q['猫型家用互助协调器治疗量2'][0] / 100 * calc(attr.atk) + talent.q['猫型家用互助协调器治疗量2'][1])
}, {
  title: 'Q释放治疗量（通常+额外）',
  dmg: ({ talent, attr, calc }, { heal }) => heal((talent.q['猫型家用互助协调器治疗量2'][0] + talent.q['最低生命值角色额外治疗量2'][0]) / 100 * calc(attr.atk)
    + talent.q['猫型家用互助协调器治疗量2'][1] + talent.q['最低生命值角色额外治疗量2'][1])
}]

export const defDmgIdx = 3
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '雅珂达6命：月兆·满辉情况下，秘藏瓶装满后，暴击率提升[cpct]%，暴击伤害提升[cdmg]%',
  cons: 6,
  data: {
    cpct: 5,
    cdmg: 40
  }
}]

export const createdBy = '冰翼'
