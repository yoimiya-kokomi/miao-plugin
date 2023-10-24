export const details = [{
  title: '破局矢伤害',
  dmg: ({ talent, attr, calc }, { basic }) => basic(calc(attr.hp) * talent.a['破局矢伤害'] / 100, 'a2')

}, {
  title: 'E络命丝伤害',
  dmg: ({ talent, attr, calc }, { basic }) => basic(calc(attr.hp) * talent.e['技能伤害'] / 100, 'e')

}, {
  title: 'E络命丝蒸发',
  dmg: ({ talent, attr, calc }, { basic }) => basic(calc(attr.hp) * talent.e['技能伤害'] / 100, 'e', '蒸发')

}, {
  title: 'Q协同单段伤害',
  params: { q: true },
  dmg: ({ talent, attr, calc, cons }, { basic }) => {
    return basic(calc(attr.hp) * (talent.q['玄掷玲珑伤害'] / 3 / 100), 'q')
  }
}, {
  title: 'Q协同单段蒸发',
  params: { q: true },
  dmg: ({ talent, attr, calc, cons }, { basic }) => {
    return basic(calc(attr.hp) * (talent.q['玄掷玲珑伤害'] / 3 / 100), 'q', '蒸发')
  }
}]

export const defDmgIdx = 4
export const mainAttr = 'hp,cpct,cdmg,mastery'

export const buffs = [{
  title: '夜兰被动：有4个不同元素类型角色时，夜兰生命值上限提高30%',
  data: {
    hpPct: 30
  }
}, {
  title: '夜兰4命：E络命丝爆发提高生命值，满Buff下提高40%',
  cons: 4,
  data: {
    hpPct: 40
  }
}, {
  title: '夜兰被动：Q持续过程中满层Buff下提高伤害50%',
  data: {
    dmg: ({ params }) => params.q ? 50 : 0
  }
}, 'vaporize']
