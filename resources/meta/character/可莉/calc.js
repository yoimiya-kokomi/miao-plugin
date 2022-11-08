export const details = [{
  title: 'E后带火花重击',
  params: { q: false },
  dmg: ({ talent }, dmg) => dmg(talent.a['重击伤害'], 'a2')
}, {
  title: 'E后带火花重击蒸发',
  params: { q: false },
  dmg: ({ talent }, dmg) => dmg(talent.a['重击伤害'], 'a2', 'vaporize')
}, {
  title: '单次轰轰火花伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['轰轰火花伤害'], 'q')
}]

export const defDmgIdx = 1
export const mainAttr = 'atk,cpct,cdmg,mastery'

export const buffs = [{
  title: '可莉天赋：爆裂火花使重击伤害提升50%',
  data: {
    a2Dmg: 50
  }
}, {
  title: '可莉2命：蹦蹦炸弹的诡雷会使敌人的防御力降低23%',
  cons: 2,
  data: {
    enemyDef: 23
  }
}, {
  title: '可莉6命：释放轰轰火花后获得10%火元素伤害加成',
  cons: 6,
  data: {
    dmg: ({ params }) => params.q === false ? 0 : 10
  }
}, 'vaporize']
