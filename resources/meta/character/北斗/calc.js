export const details = [{
  title: 'E伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['基础伤害'], 'e')
}, {
  title: '2层E伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['基础伤害'] + talent.e['受击时伤害提升'] * 2, 'e')
}, {
  title: 'Q每跳伤害',
  params: { q: true },
  dmg: ({ talent }, dmg) => dmg(talent.q['闪雷伤害'], 'q')
}]

export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '北斗6命：Q持续期间，周围敌人的雷元素抗性降低15%',
  cons: 6,
  data: {
    kx: ({ params }) => params.q ? 15 : 0
  }
}]
