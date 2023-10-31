export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '战技护盾量',
  dmg: ({ talent, attr, calc }, { shield }) => shield(calc(attr.def) * talent.e['百分比防御'] + talent.e['固定值'])
}, {
  title: '终结技伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}, {
  title: '冻结附加伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['冻结回合开始伤害'], 'q')
}, {
  title: '反击伤害',
  dmg: ({ talent }, dmg) => dmg(talent.t['反击伤害'], 't')
}, {
  title: '2命护盾量',
  cons: 2,
  dmg: ({ attr, calc }, { shield }) => shield(calc(attr.def) * 0.24 + 320)
}]

export const defDmgIdx = 1
export const mainAttr = 'atk,def,cpct,cdmg'

export const buffs = [{
  title: '三月七4命：反击造成的伤害提高[tPlus]',
  cons: 4,
  data: {
    tPlus: ({ calc, attr }) => calc(attr.def) * 0.3
  }
}]

export const createdBy = 'Aluxes'
