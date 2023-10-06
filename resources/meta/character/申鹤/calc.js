export const details = [{
  title: 'E基础伤害提升值',
  dmg: ({ talent, calc, attr }) => {
    return {
      avg: talent.e['伤害值提升'] * calc(attr.atk) / 100
    }
  }
}, {
  title: 'E点按技能伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['点按技能伤害'], 'e')
}, {
  title: 'E长按技能伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['长按技能伤害'], 'e')
}, {
  title: 'Q每跳伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['持续伤害'], 'q')
}]

export const buffs = [{
  title: '天赋-大洞弥罗尊法：Q范围内冰伤提高15%',
  data: {
    dmg: 15
  }
}, {
  title: '天赋-缚灵通真法印：点按E提高15%元素战技及元素爆发伤害，长按E提高15%普攻、重击和下落攻击伤害',
  data: {
    eDmg: 15,
    qDmg: 15,
    aDmg: 15,
    a2Dmg: 15,
    a3Dmg: 15
  }
}, {
  title: '申鹤2命：Q范围内暴击伤害提高15%',
  cons: 2,
  data: {
    cdmg: 15
  }
}, {
  title: '申鹤天赋：E提升冰伤害[ePlus]',
  sort: 9,
  data: {
    ePlus: ({ talent, calc, attr }) => talent.e['伤害值提升'] * calc(attr.atk) / 100,
    qPlus: ({ talent, calc, attr }) => talent.e['伤害值提升'] * calc(attr.atk) / 100
  }
}]
