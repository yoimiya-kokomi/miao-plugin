export const details = [{
  title: '先QA后E两段伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: '雨帘剑伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['剑雨伤害'], 'q')
}, {
  title: '雨帘剑蒸发',
  dmg: ({ talent }, dmg) => dmg(talent.q['剑雨伤害'], 'q', 'vaporize')
}]

export const mainAttr = 'atk,cpct,cdmg,mastery'

export const buffs = [{
  title: '行秋被动：获得20%水伤加成',
  isStatic: true,
  data: {
    dmg: 20
  }
}, {
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
}, 'vaporize']
