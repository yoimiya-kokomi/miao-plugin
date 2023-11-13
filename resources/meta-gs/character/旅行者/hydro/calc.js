export const details = [{
  title: 'E点按伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['喷发激流伤害'], 'e')
}, {
  title: 'E点按伤害·蒸发',
  dmg: ({ talent }, dmg) => dmg(talent.e['喷发激流伤害'], 'e', 'vaporize')
}, {
  title: 'E长按露滴伤害',
  params: { talentE1: true },
  dmg: ({ talent }, dmg) => dmg(talent.e['露滴伤害'], 'e')
}, {
  title: 'E长按结束伤害',
  params: { talentE2: true },
  dmg: ({ talent }, dmg) => dmg(talent.e['喷发激流伤害'], 'e')
}, {
  title: 'E长按结束伤害·蒸发',
  params: { talentE2: true },
  dmg: ({ talent }, dmg) => dmg(talent.e['喷发激流伤害'], 'e', 'vaporize')
}, {
  title: 'Q每跳伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}, {
  title: 'Q每跳伤害·蒸发',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q', 'vaporize')
}]

export const defDmgIdx = 1
export const mainAttr = 'atk,cpct,cdmg,mastery,dmg'

export const buffs = [{
  title: '天赋E-水纹剑：长按E释放时，基于自身生命值上限的[_hpPct]%，提高伤害值[ePlus]',
  check: ({ params }) => params.talentE1 === true,
  data: {
    _hpPct: ({ talent }) => talent.e['充盈伤害增加'],
    ePlus: ({ talent, attr }) => talent.e['充盈伤害增加'] * attr.hp / 100
  }
}, {
  title: '天赋-澄明的净水：长按E时，根据消耗的生命值的45%，提高伤害值[ePlus]',
  check: ({ params }) => params.talentE2 === true,
  data: {
    ePlus: ({ attr }) => Math.min(5000, attr.hp * 0.24 * 0.45)
  }
}, 'vaporize']

export const createdBy = 'Aluxes'
