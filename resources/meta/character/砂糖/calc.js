export const details = [{
  title: 'E伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: 'Q每跳基础伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['持续伤害'], 'q')
}, {
  title: '为队友提升精通',
  dmg: ({ calc, attr }) => {
    return {
      avg: calc(attr.mastery) * 0.2 + 50 + (attr.mastery.inc || 0)
    }
  }
}, {
  title: '扩散反应伤害',
  dmg: ({}, { ks }) => ks()
}]

export const mainAttr = 'atk,cpct,cdmg,mastery'

export const buffs = [{
  title: '砂糖被动：触发扩散反应时，队伍提升50精通'
}, {
  title: '砂糖被动：释放QE命中敌人时，基于自身精通提升队伍[_mastery]精通',
  data: {
    _mastery: ({ attr, calc }) => calc(attr.mastery) * 0.2
  }
}, 'ks']
