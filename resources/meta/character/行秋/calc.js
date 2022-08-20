export const details = [{
  title: '先QA后E两段伤害',
  dmg: ({ talent, attr }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: '雨帘剑伤害',
  dmg: ({ talent, attr }, dmg) => dmg(talent.q['剑雨伤害'], 'q')
}, {
  title: '雨帘剑蒸发',
  dmg: ({ talent, attr }, dmg) => dmg(talent.q['剑雨伤害'], 'q', 'zf')
}]

export const mainAttr = 'atk,cpct,cdmg,mastery'

export const buffs = [{
  title: '行秋2命：受到剑雨攻击的敌人水元素抗性降低15%',
  cons: 2,
  data: {
    kx: 15
  }
}, {
  title: '行秋4命：开Q后E的伤害提升50%',
  cons: 4,
  data: {
    eMulti: 50
  }
}, 'zf']
