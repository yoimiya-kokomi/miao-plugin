export const details = [{
  title: '附魔普攻第四段',
  dmg: ({ talent }, dmg) => dmg(talent.a['四段伤害'], 'a')
}, {
  title: 'E冰尘弹伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['冰尘弹伤害'], 'e')
}, {
  title: 'E冷冻炸弹伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['冷冻炸弹伤害'], 'e')
}, {
  title: 'Q技能伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}]

export const buffs = [{
  title: '埃洛伊天赋：冰驰状态提高普攻伤害',
  data: {
    aDmg: ({ talent }) => talent.e['冰驰普通攻击伤害提升']
  }
}]
