export const details = [{
  title: '万达开E后重击',
  dmg: ({ talent }, dmg) => dmg(talent.e['重击伤害'], 'a2')
}, {
  title: '万达断流·斩 伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['断流·斩 伤害'], 'e')
}, {
  title: '万达开E后Q伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害·近战'], 'q')
}, {
  title: '万达开E后Q蒸发',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害·近战'], 'q', 'vaporize')
}]

export const defDmgIdx = 3
export const mainAttr = 'atk,cpct,cdmg,mastery'

export const buffs = [{
    title: '风鹰宗室班：增加[atkPlus]点攻击力与[atkPct]%攻击力',
    data: {
      atkPct: 20,
      atkPlus: 1202.35
  }
  }, {
    title: '精1苍古0命万叶：获得[dmg]%增伤(苍古普攻16增伤)，增加[atkPct]%攻击,减抗[kx]%',
    data: {
      aDmg:16,
      a2Dmg:16,
      a3Dmg:16,
      dmg: 40,
      atkPct:20,
      kx:40
   }
  },'vaporize']
