export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '战技伤害',
  params: { buff: true },
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: '终结技单体伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['单体伤害'], 'q')
}, {
  title: '终结技伤害·主目标',
  params: { buff: true },
  dmg: ({ talent }, dmg) => dmg(talent.q['扩散伤害'], 'q')
}, {
  title: '终结技伤害·副目标',
  dmg: ({ talent }, dmg) => dmg(talent.q['扩散伤害·相邻目标'], 'q')
}]

export const defDmgIdx = 2
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '天赋-牵制盗垒：攻击力提高[atkPct]%',
  data: {
    atkPct: ({ talent }) => talent.t['攻击力提高'] * 100
  }
}, {
  title: '行迹-坚韧：防御力提高[defPct]%',
  tree: 2,
  data: {
    defPct: 20
  }
}, {
  title: '行迹-斗志：造成伤害提高[dmg]%',
  tree: 3,
  check: ({ params }) => params.buff === true,
  data: {
    dmg: 25
  }
}]

export const createdBy = 'Aluxes'
