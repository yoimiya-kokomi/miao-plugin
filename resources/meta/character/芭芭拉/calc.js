export const details = [{
  title: '重击伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['重击伤害'], 'a2')
}, {
  title: '重击蒸发',
  dmg: ({ talent }, dmg) => dmg(talent.a['重击伤害'], 'a2', 'zf')
}, {
  title: 'E每跳治疗',
  dmg: ({ talent, attr, calc }, { heal }) =>
    heal(talent.e['持续治疗量2'][0] * calc(attr.hp) / 100 + talent.e['持续治疗量2'][1] * 1)
}, {
  title: 'Q治疗量',
  dmg: ({ talent, attr, calc }, { heal }) =>
    heal(talent.q['治疗量2'][0] * calc(attr.hp) / 100 + talent.q['治疗量2'][1] * 1)
}]

export const defDmgIdx = 1
export const mainAttr = 'atk,hp,cpct,cdmg,mastery'

export const buffs = [{
  title: '芭芭拉2命：开E水环持续期间获得15%水伤加成',
  cons: 2,
  data: {
    dmg: 15
  }
}, 'zf']

export const artisSect = function ({ attr, calc }) {
  let test = calc(attr.cpct) * 2 + calc(attr.cdmg) + calc(attr.dmg)
  return test > 150 ? '暴力' : false
}
