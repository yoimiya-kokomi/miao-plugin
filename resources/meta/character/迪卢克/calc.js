export const details = [{
  title: 'E三段伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['三段伤害'], 'e')
}, {
  title: 'E三段蒸发',
  dmg: ({ talent }, dmg) => dmg(talent.e['三段伤害'], 'e', 'vaporize')
}, {
  title: 'Q爆发伤害',
  params: { q: true },
  dmg: ({ talent }, dmg) => dmg(talent.q['斩击伤害'], 'q')
}, {
  title: '开Q后单次重击',
  params: { q: true },
  dmg: ({ talent }, dmg) => dmg(talent.a['重击循环伤害'], 'a2')
}]

export const defParams = { monv: 3 }
export const mainAttr = 'atk,cpct,cdmg,mastery'
export const defDmgIdx = 1

export const buffs = [{
  title: '迪卢克天赋：释放元素爆发后获得20%火伤加成',
  data: {
    dmg: ({ params }) => params.q ? 20 : 0
  }
}, {
  title: '迪卢克1命：对于生命值高于50%的敌人，造成伤害提高15%',
  cons: 1,
  data: {
    dmg: 15
  }
}, {
  title: '迪卢克2命：受伤3层提高攻击力30%',
  cons: 2,
  data: {
    atkPct: 30
  }
}, {
  title: '迪卢克4命：间隔2秒释放E提高伤害40%',
  cons: 4,
  data: {
    eDmg: 40
  }
}, 'vaporize']
