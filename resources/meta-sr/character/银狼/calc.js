export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '战技伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['单体伤害'], 'e')
}, {
  title: '终结技伤害',
  dmg: ({ talent, cons }, dmg) => {
    let addDmg = (cons * 1 >= 4) ? 1 : 0
    return dmg(talent.q['技能伤害'] + addDmg, 'q')
  }
}]

export const mainAttr = 'atk,cpct,cdmg,effPct'

export const buffs = [{
  title: '银狼天赋：防御力缺陷降低敌方防御力[enemyDef]%',
  data: {
    enemyDef: ({ talent }) => talent.t['防御力降低'] * 100
  }
}, {
  title: '银狼战技：添加弱点降低对方对应属性抗性[kx]%',
  data: {
    kx: ({ talent }) => talent.e['伤害抗性降低'] * 100
  }
}, {
  title: '银狼终结技：释放终结技降低敌方防御[enemyDef]%',
  data: {
    enemyDef: ({ talent }) => talent.q['防御力降低'] * 100
  }
}, {
  title: '银狼4命：敌方有5个负面Buff附加100%攻击力的量子属性附加伤害',
  cons: 4,
  data: {}
}, {
  title: '银狼6命：敌方有5个负面Buff提高100%受到的伤害',
  cons: 6,
  data: {
    dmg: 100
  }
}, {
  title: '行迹-旁注：敌方目标的负面效果数量大于等于3个额外降低抗性3%',
  tree: 2,
  data: {
    kx: 3
  }
}]
