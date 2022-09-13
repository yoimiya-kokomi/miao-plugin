export const details = [{
  title: 'E每跳治疗',
  dmg: ({
    talent,
    attr,
    calc
  }, { heal }) => heal(talent.e['持续治疗量2'][0] * calc(attr.atk) / 100 + talent.e['持续治疗量2'][1] * 1)
}, {
  title: '度厄真符每次治疗',
  dmg: ({ talent, attr, calc }, { heal }) => heal(talent.q['治疗量2'][0] * calc(attr.atk) / 100 + talent.q['治疗量2'][1] * 1)
}]

export const mainAttr = 'atk,cpct,cdmg'

export const buffs = []
