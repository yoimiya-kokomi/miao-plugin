export const details = [{
  title: 'E释放伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: 'E持续攻击伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['持续攻击伤害'], 'e')
}, {
  title: 'Q点心伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['梦念冲击波伤害'], 'q')
}, {
  title: 'Q点心治疗量',
  dmg: ({ attr, calc, talent, cons }, { heal }) => heal(talent.q['拾取点心回复生命值2'][0] * calc(attr.mastery) / 100 + talent.q['拾取点心回复生命值2'][1] * 1)
}, {
  title: '扩散反应伤害',
  dmg: ({ attr, calc, talent, cons }, { reaction }) => {
    let { avg } = reaction('swirl')
    let cons6dmg = cons >= 6 ? 2 : 1
    let cons6avg = cons >= 6 ? 1.3 : 1
    return {
      dmg: cons >= 6 ? (avg * cons6dmg) : undefined,
      avg: avg * cons6avg
    }
  }
}, {
  title: '二十三夜待扩散反应',
  check: ({ cons }) => cons >= 1,
  params: { Nights: true },
  dmg: ({ attr, calc, talent, cons }, { reaction }) => {
    let { avg } = reaction('swirl')
    let cons6dmg = cons >= 6 ? 2 : 1
    let cons6avg = cons >= 6 ? 1.3 : 1
    return {
      dmg: cons >= 6 ? (avg * cons6dmg) : undefined,
      avg: avg * cons6avg
    }
  }
}]

export const defDmgIdx = 4
export const mainAttr = 'atk,cpct,cdmg,dmg,mastery'

export const buffs = [{
  check: ({ params }) => params.Nights === true,
  title: '1命效果：二十三夜待状态下的扩散反应的伤害提升[fyplus]',
  cons: 1,
  sort: 9,
  data: {
    fyplus: ({ attr, calc }) => calc(attr.mastery) * 1100 / 100
  }
}, {
  title: '瑞希被动：其他的火、水、冰雷、元素角色的攻击命中敌人时,元素精通提升[mastery]点',
  data: {
    mastery: 100
  }
}, {
  title: '瑞希天赋：扩散反应伤害提升[swirl]%',
  sort: 9,
  data: {
    swirl: ({ attr, calc, talent }) => calc(attr.mastery) * talent.e['每点精通提升扩散伤害百分比']
  }
}]

export const createdBy = 'liangshi'
