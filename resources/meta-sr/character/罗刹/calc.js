export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '战技治疗量',
  dmg: ({ talent, calc, attr }, { heal }) => heal(calc(attr.atk) * talent.e['攻击力百分比'] + talent.e['固定生命值'])
}, {
  title: '终结技伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}, {
  title: '天赋治疗量',
  dmg: ({ talent, calc, attr }, { heal }) => heal(calc(attr.atk) * talent.t['攻击力百分比'] + talent.t['固定生命值'])
}, {
  title: '行迹额外治疗量',
  dmg: ({ calc, attr }, { heal }) => heal(calc(attr.atk) * 0.07 + 93)
}, {
  title: '2命护盾量',
  cons: 2,
  dmg: ({ calc, attr }, { shield }) => shield(calc(attr.atk) * 0.18 + 240)
}]

export const defDmgIdx = 1
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '罗刹1命：结界中我方全体攻击力提高[atkPct]%',
  cons: 1,
  data: {
    atkPct: 20
  }
}, {
  title: '罗刹2命：指定治疗目标生命值小于等于50%时，治疗量提高30%',
  cons: 2,
  data: {
    heal: 30
  }
}, {
  title: '罗刹6命：使敌方全属性抗性降低20%',
  cons: 6,
  data: {
    kx: 20
  }
}]

export const createdBy = 'Aluxes'
