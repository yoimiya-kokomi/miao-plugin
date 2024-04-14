import { Format } from '#miao'

export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '战技伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: '终结技伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}, {
  title: '终结技降低防御',
  dmg: ({ talent }) => {
    return {
      avg: Format.percent(talent.q['防御力降低']),
      type: 'text'
    }
  }
}]

export const defDmgIdx = 2
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '终结技：【通解】状态下敌方目标防御力降低[enemyDef]%',
  data: {
    enemyDef: ({ talent }) => talent.q['防御力降低'] * 100
  }
}, {
  title: '行迹-痛击：对处于负面效果的敌方目标造成伤害提高[dmg]%',
  tree: 1,
  data: {
    dmg: 20
  }
}, {
  title: '行迹-秘策：效果命中提高[effPct]%',
  tree: 2,
  data: {
    effPct: 10
  }
}, {
  title: '行迹-追歼：施放战技解除增益效果后，下一次攻击造成伤害提高[dmg]%',
  tree: 3,
  data: {
    dmg: 20
  }
}, {
  title: '佩拉2命：施放战技解除增益效果后，速度提高[speedPct]%',
  cons: 2,
  data: {
    speedPct: 10
  }
}, {
  title: '佩拉4命：释放战技时，使敌方目标冰抗性降低[kx]%',
  cons: 4,
  data: {
    kx: 12
  }
}]

export const createdBy = 'Aluxes'
