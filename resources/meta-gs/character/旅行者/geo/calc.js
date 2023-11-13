export const details = [{
  title: 'E荒星伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: 'Q地震波单次伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['地震波单次伤害'], 'q')
}]

export const mainAttr = 'atk,cpct,cdmg,dmg'

export const buffs = [{
  title: '岩主1命：处于Q岩造物范围内时，暴击率提高[cpct]%',
  cons: 1,
  data: {
    cpct: 10
  }
}]

export const createdBy = 'Aluxes'
