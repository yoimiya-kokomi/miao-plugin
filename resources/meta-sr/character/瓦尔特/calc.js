export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '战技主目标伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: '终结技伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}, {
  title: '天赋附加伤害',
  dmg: ({ talent }, dmg) => dmg(talent.t['附加伤害'], 't')
}]

export const defDmgIdx = 1
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '行迹-惩戒：施放终结技提高敌人受到伤害12%',
  tree: 1,
  data: {
    dmg: 12
  }
}, {
  title: '行迹-裁决：弱点击破的敌方目标造成的伤害提高20%',
  tree: 3,
  data: {
    dmg: 20
  }
}]
