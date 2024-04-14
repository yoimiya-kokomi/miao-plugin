export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '战技伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: '终结技伤害·主目标',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}, {
  title: '终结技伤害·副目标',
  dmg: ({ talent, cons }, dmg) => cons < 6 ? dmg(talent.q['相邻目标伤害'], 'q') : dmg(talent.q['技能伤害'], 'q')
}]

export const mainAttr = 'atk,cpct,cdmg,dmg'
export const defDmgIdx = 2

export const buffs = [{
  title: '天赋-至痛至怒：根据当前损失生命值百分比获得伤害加成，使造成伤害提高[dmg]%',
  data: {
    dmg: ({ talent }) => talent.t['伤害提高'] * 100
  }
}, {
  title: '阿兰1命：当前生命百分比小于等于50%时，战技造成的伤害提高[eDmg]%',
  cons: 1,
  data: {
    eDmg: 10
  }
}, {
  title: '阿兰6命：当前生命百分比小于等于50%时，终结技造成的伤害提高[qDmg]%，且对相邻目标造成与主目标相同的伤害倍率',
  cons: 6,
  data: {
    qDmg: 20
  }
}]

export const createdBy = 'Aluxes'
