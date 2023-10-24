export const details = [{
  title: '重击伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['重击伤害'], 'a2')
}, {
  title: '重击蒸发',
  dmg: ({ talent }, dmg) => dmg(talent.a['重击伤害'], 'a2', 'vaporize')
}, {
  title: 'E每跳治疗',
  dmg: ({ talent, attr, calc }, { heal }) =>
    heal(talent.e['持续治疗量2'][0] * calc(attr.hp) / 100 + talent.e['持续治疗量2'][1] * 1)
}, {
  title: 'Q治疗量',
  dmgKey: 'qHeal',
  dmg: ({ talent, attr, calc }, { heal }) =>
    heal(talent.q['治疗量2'][0] * calc(attr.hp) / 100 + talent.q['治疗量2'][1] * 1)
}]

export const defDmgKey = 'qHeal'
export const mainAttr = 'atk,hp,cpct,cdmg,mastery'

export const buffs = [{
  title: '芭芭拉2命：开E水环持续期间获得15%水伤加成',
  cons: 2,
  data: {
    dmg: 15
  }
}, 'vaporize']