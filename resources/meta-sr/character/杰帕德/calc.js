export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '战技伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: '终结技护盾量',
  dmg: ({ attr, calc, talent }, { shield }) => shield(calc(attr.def) * talent.q['百分比防御力'] + talent.q['固定数值'])
}, {
  title: '秘技护盾量',
  dmg: ({ attr, calc }, { shield }) => shield(calc(attr.def) * 0.24 + 150)
}]

export const defDmgIdx = 2
export const mainAttr = 'atk,cpct,cdmg,def'

export const buffs = [{
  title: '行迹-战意：基于防御值提高攻击力[atkPlus]',
  tree: 3,
  data: {
    atkPlus: ({ calc, attr }) => calc(attr.def) * 0.35
  }
}]
