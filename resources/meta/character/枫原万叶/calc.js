export const details = [{
  title: 'E长按伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['长按技能伤害'], 'e')
}, {
  title: 'Q斩击伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['斩击伤害'], 'q')
}, {
  title: 'Q无转化每段伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['持续伤害'], 'q')
}, {
  title: '扩散反应伤害',
  dmg: ({}, { ks }) => ks()
}]

export const mainAttr = 'atk,cpct,cdmg,mastery'

export const buffs = [{
  title: '万叶2命：开Q后精通提高200',
  cons: 2,
  data: {
    mastery: 200
  }
}, {
  title: '元素精通：扩散伤害提高[ks]%',
  sort: 2,
  mastery: 'ks'
}]
