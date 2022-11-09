export const details = [{
  title: '开E后首段普攻',
  params: { num: 1 },
  dmg: ({ talent }, dmg) => dmg(talent.a['一段伤害'], 'a')
}, {
  title: '开E满Buff普攻尾箭',
  params: { num: 10 },
  dmg: ({ talent }, dmg) => dmg(talent.a['五段伤害'], 'a')
}, {
  title: '开E满Buff尾箭蒸发',
  params: { num: 10 },
  dmg: ({ talent }, dmg) => dmg(talent.a['五段伤害'], 'a', 'vaporize')
}]

export const defDmgIdx = 2
export const mainAttr = 'atk,cpct,cdmg,mastery'

export const buffs = [{
  title: '焰硝庭火舞：开启E后额外提升普通[aMulti]%伤害',
  data: {
    aMulti: ({ talent }) => talent.e['炽焰箭伤害'] - 100
  }
}, {
  title: '宵宫被动：袖火百景图10层提高20%火伤加成',
  data: {
    dmg: ({ params }) => params.num ? params.num * 2 : 20
  }
}, {
  title: '宵宫2命：宵宫造成暴击后获得25%火伤加成',
  cons: 2,
  data: {
    dmg: ({ params }) => params.num > 1 ? 25 : 0
  }
}, 'vaporize']
