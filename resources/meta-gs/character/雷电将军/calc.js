export const details = [{
  title: '零愿力Q首刀',
  params: {
    type: 1,
    num: 0
  },
  dmg: ({ talent, attr }, dmg) => dmg(talent.q['梦想一刀基础伤害'], 'q')
}, {
  title: '满愿力Q首刀',
  params: {
    type: 0,
    num: 60
  },
  dmg: ({ talent, attr }, dmg) => dmg(talent.q['梦想一刀基础伤害'], 'q')
}, {
  title: '满愿力Q后重击',
  params: {
    type: 1,
    num: 60
  },
  dmg: ({ talent, attr }, dmg) => dmg(talent.q['重击伤害'], 'q')
}]

export const defParams = {
  num: 60,
  type: 0
}

export const defDmgIdx = 1
export const mainAttr = 'atk,cpct,cdmg,recharge'

export const buffs = [{
  title: '恶曜开眼：开E元素爆发伤害提升[qDmg]%',
  data: {
    qDmg: ({ talent }) => talent.e['元素爆发伤害提高'] * 90
  }
}, {
  title: '梦想真说：Q满愿力获得[qPct]%大招倍率加成',
  data: {
    qPct: ({ talent, params }) => talent.q['愿力加成'][params.type || 0] * params.num
  }
}, {
  check: ({ cons }) => cons >= 2,
  title: '雷神2命：大招无视敌人[qIgnore]%防御力',
  data: {
    qIgnore: 60
  }
}, {
  title: '雷神被动：基于元素充能获得[dmg]%雷伤加成',
  sort: 4,
  data: {
    dmg: ({ attr }) => Math.max(attr.recharge.base + attr.recharge.plus - 100, 0) * 0.4
  }
}]
