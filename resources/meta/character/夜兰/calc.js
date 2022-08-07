export const details = [{
  title: '破局矢伤害',
  dmg: ({ talent, attr, calc }, { basic }) => basic(calc(attr.hp) * talent.a['破局矢伤害'] / 100, 'a2')

}, {
  title: 'E络命丝伤害',
  dmg: ({ talent, attr, calc }, { basic }) => basic(calc(attr.hp) * talent.e['技能伤害'] / 100, 'e')

}, {
  title: 'Q协同单段伤害',
  dmg: ({ talent, attr, calc, cons }, { basic }) => {
    return basic(calc(attr.hp) * (talent.q['玄掷玲珑伤害'] / 3 / 100), 'q')
  }
}]

export const mainAttr = 'hp,cpct,cdmg'

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
}]
