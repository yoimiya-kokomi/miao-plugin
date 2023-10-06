export const details = [{
  title: 'E每跳治疗',
  dmg: ({ talent, calc, attr }, { heal }) =>
    heal(talent.e['白玉萝卜治疗量2'][0] * calc(attr.hp) / 100 + talent.e['白玉萝卜治疗量2'][1])
}, {
  title: 'E每跳伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['白玉萝卜伤害'], 'e')
}, {
  title: 'Q每跳治疗',
  dmg: ({ talent, calc, attr }, { heal }) =>
    heal(talent.q['桂子仙机白玉萝卜治疗量2'][0] * calc(attr.hp) / 100 + talent.q['桂子仙机白玉萝卜治疗量2'][1])
}, {
  title: '萝卜炸裂天赋治疗',
  dmg: ({ calc, attr }, { heal }) => heal(calc(attr.hp) * 0.8 / 100)
}, {
  title: '6命大萝卜治疗',
  cons: 6,
  dmg: ({ calc, attr }, { heal }) => heal(calc(attr.hp) * 7.5 / 100)
}]

export const mainAttr = 'atk,hp,cpct,cdmg'

export const buffs = [{
  title: '瑶瑶1命：萝卜炸裂获得15%草伤加成',
  cons: 1,
  data: {
    dmg: 15
  }
}, {
  title: '瑶瑶4命：释放E或Q后，提升元素精通[mastery]点',
  cons: 4,
  sort: 5,
  data: {
    mastery: ({ calc, attr }) => calc(attr.hp) * 0.3 / 100
  }
}]
