export const details = [{
  title: '重击伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['重击伤害'], 'a2')
}, {
  title: '璇玑屏伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: 'Q单颗宝石伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['宝石伤害'], 'q')
}]

export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '凝光被动：穿过璇玑屏获得12%岩伤加成',
  data: {
    dmg: 12
  }
}]
