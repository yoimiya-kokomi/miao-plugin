export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '战技伤害·单体',
  dmg: ({ talent }, dmg) => dmg(talent.e['单体伤害'], 'e')
}, {
  title: '战技伤害·相邻目标',
  dmg: ({ talent }, dmg) => dmg(talent.e['相邻目标伤害'], 'e')
}, {
  title: '终结技伤害·10段',
  dmg: ({ talent, cons }, dmg) => {
    let extraTd = cons >= 4 ? 0.06 : 0
    let td = (talent.q['每段攻击伤害'] + extraTd) * 10
    return dmg(td, 'q')
  }
}, {
  title: '终结技伤害·15段',
  check: ({ cons }) => cons >= 1,
  dmg: ({ talent, cons }, dmg) => {
    let extraTd = cons >= 4 ? 0.06 : 0
    let td = (talent.q['每段攻击伤害'] + extraTd) * 15
    return dmg(td, 'q')
  }
}]

export const mainAttr = 'atk,cpct,cdmg,dmg'
export const defDmgIdx = 3

export const buffs = [{
  title: '行迹-锁接：释放终结技时，效果命中提高[effPct]%',
  tree: 2,
  data: {
    effPct: 60
  }
}, {
  title: '行迹-传冲：对陷入冻结状态的敌人造成的暴击伤害提高[cdmg]%',
  tree: 3,
  data: {
    cdmg: 30
  }
}, {
  title: '米沙2命：降低目标防御力[enemyDef]%',
  cons: 2,
  data: {
    enemyDef: 16
  }
}, {
  title: '米沙4命：终结技每段攻击的伤害倍率提高6%',
  cons: 4
}, {
  title: '米沙6命：释放终结技时，自身造成的伤害提高[dmg]%',
  cons: 6,
  data: {
    dmg: 30
  }
}]

export const createdBy = 'Aluxes'