export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '战技伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: '终结技伤害',
  params: { qBuff: true },
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}, {
  title: '3层奥迹持续伤害',
  params: { qBuff: true },
  dmg: ({ talent }, dmg) => {
    const td = talent.t['持续伤害'] + talent.t['倍率提高'] * 3
    return dmg(td, 'dot', 'skillDot')
  }
}, {
  title: '7层奥迹持续伤害',
  params: { ignoreDef: true, qBuff: true },
  dmg: ({ talent }, dmg) => {
    const td = talent.t['持续伤害'] + talent.t['倍率提高'] * 7
    return dmg(td, 'dot', 'skillDot')
  }
}, {
  title: '50层奥迹持续伤害',
  params: { ignoreDef: true, qBuff: true },
  dmg: ({ talent }, dmg) => {
    const td = talent.t['持续伤害'] + talent.t['倍率提高'] * 50
    return dmg(td, 'dot', 'skillDot')
  }
}]

export const mainAttr = 'atk,cpct,cdmg,dmg,effPct'
export const defDmgIdx = 4

export const buffs = [{
  title: '行迹-烛影朕兆：基于效果命中，提高造成的伤害[dmg]%',
  tree: 3,
  data: {
    dmg: ({ attr }) => Math.min(attr.effPct * 0.6, 72),
  }
}, {
  title: '战技：使得目标防御力降低[enemyDef]%',
  data: {
    enemyDef: ({ talent }) => talent.e['防御力降低'] * 100,
  }
}, {
  title: '终结技：【揭露】状态下，目标受到的伤害提高[enemydmg]%',
  check: ({ params }) => params.qBuff === true,
  data: {
    enemydmg: ({ talent }) => talent.q['伤害提高'] * 100,
  }
}, {
  title: '奥迹：层数大于等于7层时，造成的持续伤害无视目标防御力[dotIgnore]%',
  check: ({ params }) => params.ignoreDef === true,
  data: {
    dotIgnore: 20,
  }
}, {
  title: '黑天鹅1命：敌方抗性降低[kx]%',
  cons: 1,
  data: {
    kx: 25,
  }
}]

export const createdBy = 'Aluxes'
