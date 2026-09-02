export const details = [{
  title: 'E持续攻击伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['持续攻击伤害'], 'e')
}, {
  title: '天赋「廓然梦生」E持续攻击伤害',
  params: { skills: true },
  dmg: ({ talent }, dmg) => dmg(talent.e['持续攻击伤害'], 'e')
}, {
  title: '【辉映·星扩散】E额外持续星扩散伤害',
  params: { cons_6: true },
  dmg: ({ attr, calc }, { basic }) => basic(calc(attr.mastery) * 1000 / 100, '', 'stellarSwirl')
}, {
  title: 'E后Q点心伤害',
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
  title: '反应星扩散单层伤害',
  dmg: ({}, { reaction }) => reaction('stellarSwirl')
}, {
  cons: 1,
  title: '1命「二十三夜待」扩散反应伤害',
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
}, {
  cons: 1,
  title: '1命「二十三夜待」额外风元素伤害',
  dmg: ({ attr, calc }, { basic }) => basic(calc(attr.mastery) * 1000 / 100)
}, {
  cons: 1,
  title: '【辉映·星扩散】1命「二十三夜待」额外星扩散伤害',
  params: { cons_6: true },
  dmg: ({ attr, calc }, { basic }) => basic(calc(attr.mastery) * 400 / 100, '', 'stellarSwirl')
}, {
  cons: 4,
  title: '4命额外治疗',
  dmg: ({ attr, calc }, { heal }) => heal(calc(attr.mastery) * 266 / 100)
}]

export const defDmgIdx = 2
export const mainAttr = 'atk,cpct,cdmg,mastery'

export const buffs = [{
  check: ({ params }) => params.Nights === true,
  title: '1命效果：二十三夜待状态下的扩散反应的伤害提升[fyplus]',
  cons: 1,
  sort: 9,
  data: {
    fyplus: ({ attr, calc }) => calc(attr.mastery) * 1100 / 100
  }
}, {
  title: '2命效果：处于梦浮状态下时，风元素抗性降低[kx]%',
  cons: 2,
  data: {
    kx: 20
  }
}, {
  check: ({ params }) => params.cons_6 === true,
  title: '6命效果：星扩散反应伤害暴击率提升[cpct]%，暴击伤害提升[cdmg]%',
  cons: 6,
  data: {
    cpct: 10,
    cdmg: 20
  }
}, {
  title: '6命效果：基于梦见月瑞希元素精通，使暴击率提升[cpct]%，暴击伤害提升[cdmg]%',
  cons: 6,
  sort: 9,
  data: {
    cpct: ({ attr, calc }) => Math.min(Math.max(calc(attr.mastery) - 500, 0) * 0.04, 20),
    cdmg: ({ attr, calc }) => Math.min(Math.max(calc(attr.mastery) - 500, 0) * 0.16, 80),
  }
}, {
  title: '瑞希天赋：梦见月处于梦浮状态下时，其他的火、水、冰、雷元素角色的攻击命中敌人时,元素精通提升[mastery]点',
  data: {
    mastery: 100 + 100 * 0.1    // 因为下一个天赋【梦浮状态下时，元素精通提升10%】，所以这个天赋加的100精通后面，再追加 100 * 0.1
  }
}, {
  title: '瑞希天赋：梦见月处于梦浮状态下时，队伍中附近的角色的元素精通提升[mastery]%',
  data: {
    masteryPct: 10
  }
}, {
  check: ({ params }) => params.skills === true,
  title: '瑞希天赋：梦浮状态下的持续性伤害获得提升，提升值相当于梦见月元素精通的1000%',
  sort: 9,
  data: {
    ePlus: ({ calc, attr }) => calc(attr.mastery) * 1000 / 100,
  }
}, {
  title: '瑞希元素战技：扩散反应伤害提升[swirl]%；星扩散反应伤害提升[stellarSwirl]%',
  sort: 9,
  data: {
    swirl: ({ attr, calc, talent }) => calc(attr.mastery) * talent.e['每100点精通提升扩散伤害百分比'] / 100,
    stellarSwirl: ({ attr, calc, talent }) => calc(attr.mastery) * talent.e['每100点精通提升星扩散伤害百分比'] / 100,
  }
}]

export const createdBy = 'liangshi & 冰翼'
