export const details = [{
  title: 'E后普攻一段',
  dmg: ({ talent }, dmg) => dmg(talent.a['一段伤害'], 'a')
},{
  title: 'E突刺伤害',
  dmg: ({ talent, attr }, { basic }) => basic(talent.e['上挑攻击伤害2'][0] * attr.atk / 100 + talent.e['上挑攻击伤害2'][1] * attr.def / 100 , 'e')
},{
  title: 'E人偶伤害',
  dmg: ({ talent, attr }, { basic }) => basic(talent.e['袖伤害2'][0] * attr.atk / 100 + talent.e['袖伤害2'][1] * attr.def / 100 , 'e')
},{
  title: '2命人偶切斩伤害',
  check: ({ cons }) => cons >= 2,
  dmg: ({ talent, attr }, { basic }) => basic( ( talent.e['袖伤害2'][0] * attr.atk / 100 + talent.e['袖伤害2'][1] * attr.def / 100 ) * 1.7 , 'e')
},{
  title: 'Q伤害',
  dmg: ({ talent, attr }, { basic }) => basic(talent.q['技能伤害2'][0] * attr.atk / 100 + talent.q['技能伤害2'][1] * attr.def / 100 , 'q')
}]

export const defDmgIdx = 2
export const mainAttr = 'atk,def,cpct,cdmg,dmg'

export const buffs = [{
  title: '千织天赋：队伍中角色创造岩造物时，获得[dmg]%岩伤加成',
  data: {
    dmg: 20
  }
},{
  title: '千织6命：普攻造成的伤害提升[aPlus]',
  sort: 9,
  cons: 6,
  data: {
    aPlus: ({ attr }) => attr.def * 235 / 100
  }
}]

export const createdBy = 'liangshi'
