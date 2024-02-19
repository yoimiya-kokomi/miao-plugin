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
},{
  title: '一五千钟 E切后台10斩2协',
  check: ({ cons }) => cons < 4,
  params: { team: true },
  dmg: ({ talent, attr, cons }, { basic }) => {
    let e1 = basic(talent.e['上挑攻击伤害2'][0] * attr.atk / 100 + talent.e['上挑攻击伤害2'][1] * attr.def/ 100 , 'e')
    let e2 = basic(talent.e['袖伤害2'][0] * attr.atk / 100 + talent.e['袖伤害2'][1] * attr.def/ 100 , 'e')
    return {
      dmg: e1.dmg * 3 + e2.dmg * 10,
      avg: e1.avg * 3 + e2.avg * 10
    }
  }
},{
  title: '一五千钟 E切后台10斩2协3绢',
  check: ({ cons }) => cons >= 4,
  params: { team: true },
  dmg: ({ talent, attr, cons }, { basic }) => {
    let e1 = basic(talent.e['上挑攻击伤害2'][0] * attr.atk / 100 + talent.e['上挑攻击伤害2'][1] * attr.def / 100, 'e')
    let e2 = basic(talent.e['袖伤害2'][0] * attr.atk / 100 + talent.e['袖伤害2'][1] * attr.def / 100, 'e')
    return {
      dmg: e1.dmg * 3 + e2.dmg * 10 + e2.dmg * 3 * 1.7,
      avg: e1.avg * 3 + e2.avg * 10 + e2.avg * 3 * 1.7
    }
  }
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
},{
  check: ({ params }) => params.team === true,
  title: '6命五郎：增加[defPct]%防御力，增加[cdmg]%暴击伤害',
  data: {
    cdmg: 40,
    defPct: 25
  }
},{
   check: ({ params }) => params.team === true,
   title: '钟离：降低敌人[kx]%全抗',
   data: {
     kx: 20
   }
},{
  check: ({ params }) => params.team === true,
  title: '坚定之岩：造成的伤害提升[dmg]%，降低敌人[kx]%岩元素抗性',
  data: {
    dmg: 15,
    kx: 20
  }
}]

export const createdBy = 'liangshi'
