export const details = [{
  title: '水月伤害',
  params: { sy: true },
  dmg: ({ talent, calc, attr }, { basic }) => basic(calc(attr.hp) * talent.e['水月/水轮伤害2'][0] / 100, 'e')
}, {
  title: '水月蒸发伤害',
  params: { sy: true },
  dmg: ({ talent, calc, attr }, { basic }) => basic(calc(attr.hp) * talent.e['水月/水轮伤害2'][0] / 100, 'e', '蒸发')
}, {
  title: '剑舞步三段伤害',
  dmg: ({ talent, calc, attr, cons }, { basic }) => {
    let pct = talent.e['剑舞步/旋舞步一段伤害2'][0] * 1 + talent.e['剑舞步/旋舞步二段伤害2'][0] * 1
    let ret1 = basic(calc(attr.hp) * pct / 100, 'e')
    if (cons >= 1) {
      attr.e.dmg += 65
    }
    let ret2 = basic(calc(attr.hp) * talent.e['水月/水轮伤害2'][0] / 100, 'e')
    return {
      dmg: ret1.dmg + ret2.dmg,
      avg: ret2.avg + ret2.avg
    }
  }
}, {
  title: 'Q两段总伤害',
  dmg: ({ talent, calc, attr }, { basic }) => basic(calc(attr.hp) * (talent.q['技能伤害'] + talent.q['永世流沔伤害']) / 100, 'q')
}, {
  title: 'Q两段总蒸发伤害',
  dmg: ({ talent, calc, attr }, { basic }) => basic(calc(attr.hp) * (talent.q['技能伤害'] + talent.q['永世流沔伤害']) / 100, 'q', '蒸发')
}, {
  title: '丰穰之核伤害',
  params: { bloom: true },
  dmg: ({ calc, attr }, { reaction }) => {
    return reaction('bloom')
  }
}]

export const mainAttr = 'hp,atk,cpct,cdmg,mastery'

export const buffs = [{
  title: '天赋-折旋落英之庭：元素精通提升100点',
  data: {
    mastery: ({ params }) => params.bloom ? 100 : 0
  }
}, {
  title: '天赋-翩舞永世之梦：丰穰之核增伤[bloom]%',
  sort: 9,
  data: {
    bloom: ({ calc, attr }) => Math.min(400, (calc(attr.hp) - 30000) / 1000 * 9)
  }
}, {
  title: '妮露1命：水月造成的伤害提升65%',
  cons: 1,
  data: {
    eDmg: ({ params }) => params.sy ? 65 : 0
  }
}, {
  title: '妮露2命：金杯的丰馈下降低敌人35%水抗与草抗',
  cons: 2,
  data: {
    kx: 35
  }
}, {
  title: '妮露4命：第三段舞步命中敌人Q伤害提高50%',
  cons: 4,
  data: {
    qDmg: 50
  }
}, {
  title: '妮露6命：提高暴击[cpct]%，爆伤[cdmg]%',
  cons: 6,
  sort: 9,
  data: {
    cpct: ({ calc, attr }) => Math.min(30, calc(attr.hp) / 1000 * 0.6),
    cdmg: ({ calc, attr }) => Math.min(60, calc(attr.hp) / 1000 * 1.2)
  }
}, 'vaporize']
