// 纳西妲、妮露、艾尔海森、心海
const team2 = createTeam('海妮心妲', ['纳西妲', '艾尔海森', '心海'])

export const details = [{
  title: '水月伤害',
  params: { sy: true, team: false },
  dmg: ({ talent, calc, attr }, { basic }) => basic(calc(attr.hp) * talent.e['水月/水轮伤害2'][0] / 100, 'e')
}, {
  title: '水月蒸发伤害',
  params: { sy: true, team: false },
  dmg: ({ talent, calc, attr }, { basic }) => basic(calc(attr.hp) * talent.e['水月/水轮伤害2'][0] / 100, 'e', '蒸发')
}, {
  title: '剑舞步三段伤害',
  params: { team: false },
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
  params: { team: false },
  dmg: ({ talent, calc, attr }, { basic }) => basic(calc(attr.hp) * (talent.q['技能伤害'] + talent.q['永世流沔伤害']) / 100, 'q')
}, {
  title: 'Q两段蒸发总伤害',
  params: { team: false },
  dmg: ({ talent, calc, attr }, { basic }) => basic(calc(attr.hp) * (talent.q['技能伤害'] + talent.q['永世流沔伤害']) / 100, 'q', '蒸发')
}, {
  title: '丰穰之核伤害',
  params: { bloom: true, team: false },
  dmg: ({ calc, attr }, { reaction }) => {
    return reaction('bloom')
  }
}, {
  title: '海妮心二妲·丰穰之核',
  params: { team: false, bloom: true, ...team2.params },
  dmg: ({}, { reaction }) => {
    // 草神二命固定暴击率20%、暴击伤害100%
    const cpctNum = 20 / 100; const cdmgNum = 100 / 100
    // 计算丰穰之核非暴击伤害
    const { avg } = reaction('bloom')
    return {
      // 暴击伤害
      dmg: avg * (1 + cdmgNum),
      // 平均伤害
      avg: avg * (1 + cpctNum * cdmgNum)
    }
  }
}, {
  title: '夜万妮香Q总蒸发伤害',
  params: { team: true },
  dmg: ({ talent, calc, attr }, { basic }) => basic(calc(attr.hp) * (talent.q['技能伤害'] + talent.q['永世流沔伤害']) / 100, 'q', '蒸发')
}]

export const mainAttr = 'hp,atk,cpct,cdmg,mastery'
export const defDmgIdx = 6

export const defParams = {
  team: true
}

export const buffs = [{
  check: ({ params }) => params.team === false || team2.is(params),
  title: '天赋-折旋落英之庭：元素精通提升100点',
  data: {
    mastery: ({ params }) => params.bloom ? 100 : 0
  }
}, {
  check: ({ params }) => params.team === false || team2.is(params),
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
  check: ({ params }) => params.team === false || team2.is(params),
  title: '妮露2命：金杯的丰馈下降低敌人35%水抗与草抗',
  cons: 2,
  data: {
    kx: 35
  }
}, {
  check: ({ cons, params }) => cons <= 1 && params.team === true && team2.not(params),
  title: '精1苍古0命万叶：获得[dmg]%增伤(苍古普攻16增伤)，增加[atkPct]%攻击,减抗[kx]%',
  data: {
    aDmg: 16,
    a2Dmg: 16,
    a3Dmg: 16,
    dmg: 40,
    atkPct: 20,
    kx: 40
  }
}, {
  check: ({ cons, params }) => ((cons < 6 && cons > 1) && params.team === true && team2.not(params)),
  title: '精1苍古2命万叶：获得[dmg]%增伤(苍古普攻16增伤)，增加[atkPct]%攻击,减抗[kx]%,精通[mastery]',
  data: {
    aDmg: 16,
    a2Dmg: 16,
    a3Dmg: 16,
    dmg: 48,
    atkPct: 20,
    kx: 40,
    mastery: 200
  }
}, {
  check: ({ cons, params }) => (cons >= 6 && params.team === true && team2.not(params)),
  title: '精5苍古6命万叶：获得[dmg]%增伤(苍古普攻32增伤)，增加[atkPct]%攻击,减抗[kx]%,精通[mastery]',
  data: {
    aDmg: 32,
    a2Dmg: 32,
    a3Dmg: 32,
    dmg: 48,
    atkPct: 40,
    kx: 40,
    mastery: 200
  }
}, {
  check: ({ cons, params }) => (cons >= 4 && params.team === true && team2.not(params)),
  title: '双水夜兰2层4命：双水,夜兰4命[hpPct]%生命值,[dmg]%增伤',
  data: {
    hpPct: 45,
    dmg: 30
  }
}, {
  check: ({ cons, params }) => (cons < 4 && params.team === true && team2.not(params)),
  title: '双水夜兰：双水[hpPct]%生命值,[dmg]%增伤',
  data: {
    hpPct: 25,
    dmg: 30
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
}, {
  check: ({ params }) => team2.is(params),
  title: '双水双草共鸣：双水提升[hpPct]%生命值上限；双草提升精通50点，触发绽放再提升30点，共提升[mastery]点',
  data: {
    hpPct: 25,
    mastery: 50 + 30
  }
}, {
  check: ({ params }) => team2.is(params),
  title: '千精纳西妲开Q：增加[mastery]点精通',
  sort: 7,
  data: {
    mastery: 1000 * 0.25
  }
}, {
  check: ({ params , artis }) => team2.is(params) && artis.深林的记忆 !== 4 ,
  title: '纳西妲-草套：草抗降低[kx]%',
  data: {
    kx: 30
  }
}, {
  check: ({ params }) => team2.is(params),
  title: '精1千夜浮梦：队伍中装备者以外的角色元素精通提升[mastery]点',
  data: {
    mastery: 40
  }
}, {
  check: ({ params }) => team2.is(params),
  title: '纳西妲2命：提供绽放反应固定20%暴击率和100%的暴击伤害'
}, 'vaporize']

/**
 * 创建队伍
 * @param name 队伍名
 * @param members 队员
 * @return {{name, members, params, go, is, not}}
 */
function createTeam (name, members) {
  const team = { name, members }
  // 队伍出战
  team.go = () => {
    const params = {}
    team.members.forEach(k => params[name + '_' + k] = true)
    return params
  }
  team.params = team.go()
  // 是否是当前配队
  team.is = (params) => members.filter(k => params[name + '_' + k] === true).length === members.length
  // 是否不是当前配队
  team.not = (params) => !team.is(params)
  return team
}
