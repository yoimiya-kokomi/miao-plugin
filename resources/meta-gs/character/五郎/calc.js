export const details = [{
  title: '三岩E伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: '三岩Q伤害',
  dmg: ({ talent, attr }, { basic }) => {
    let ret = talent.q['技能伤害'] / 100 * attr.def
    return basic(ret, 'q')
  }
}, {
  title: '三岩Q每跳伤害',
  dmg: ({ talent, attr }, { basic }) => {
    let ret = talent.q['岩晶崩破伤害'] / 100 * attr.def
    return basic(ret, 'q')
  }
}, {
  title: 'Q每跳治疗',
  cons: 4,
  dmg: ({ attr }, { heal }) => heal(0.5 * attr.def)
}]

export const mainAttr = 'atk,def,cpct,cdmg'

export const buffs = [{
  title: '五郎天赋：释放E或Q后防御力提高[defPlus]，岩伤提高15%',
  data: {
    defPlus: ({ talent }) => talent.e['防御力提升'] * 1,
    dmg: 15
  }
}, {
  title: '天赋-报恩之守：基于防御力，提高E伤害[ePlus]，提高Q伤害[qPlus]',
  sort: 9,
  data: {
    ePlus: ({ attr }) => 1.56 * attr.def,
    qPlus: ({ attr }) => 0.156 * attr.def
  }
}, {
  title: '五郎被动：释放E后防御力提高25%',
  data: {
    defPct: 25
  }
}, {
  title: '五郎4命：Q每跳回复防御力50%',
  cons: 4
}, {
  title: '五郎6命：三岩队伍提高40%岩伤',
  cons: 6,
  data: {
    dmg: 40
  }
}]
