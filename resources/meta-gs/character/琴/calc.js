export const details = [{
  title: '风压剑伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: 'Q爆发伤害',
  params: { q: true },
  dmg: ({ talent }, dmg) => dmg(talent.q['爆发伤害'], 'q')
}, {
  title: 'Q爆发治疗',
  dmg: ({ talent, calc, attr }, { heal }) =>
    heal(talent.q['领域发动治疗量2'][0] * calc(attr.atk) / 100 + talent.q['领域发动治疗量2'][1] * 1)
}, {
  title: 'Q每跳治疗',
  dmg: ({ talent, calc, attr }, { heal }) =>
    heal(talent.q['持续治疗2'][0] * calc(attr.atk) / 100 + talent.q['持续治疗2'][1] * 1)
}]

export const mainAttr = 'atk,cpct,cdmg'
export const defDmgIdx = 2

export const buffs = [{
  cons: 1,
  title: '琴1命：长按1秒后风压剑伤害提升40%',
  data: {
    eDmg: 40
  }
}, {
  cons: 4,
  title: '琴4命：蒲公英之风的领域内敌人风元素抗性降低40%',
  data: {
    kx: ({ params }) => params.q ? 40 : 0
  }
}]
