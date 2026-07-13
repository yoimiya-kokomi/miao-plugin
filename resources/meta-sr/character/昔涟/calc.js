const addDmg = (...items) => {
  return items.reduce((ret, item) => {
    ret.dmg += item.dmg || 0
    ret.avg += item.avg || 0
    return ret
  }, { dmg: 0, avg: 0 })
}

const scaleDmg = (item, scale) => ({
  dmg: (item.dmg || 0) * scale,
  avg: (item.avg || 0) * scale
})

const getEnhancedBasic = ({ talent, attr, calc }, { basic }) => {
  const hp = calc(attr.hp)
  return basic(hp * (talent.a2['单体伤害'] + talent.a2['全体伤害']), 'a')
}

const getTrueDmgRate = ({ talent, cons, params }) => {
  let rate = talent.e['额外真实伤害比例']
  if (cons >= 2) {
    rate += Math.min(Math.max(params.e2BuffCount || 0, 0), 4) * 0.06
  }
  return rate
}

const addFieldDmg = (basicDmg, data) => {
  return addDmg(basicDmg, scaleDmg(basicDmg, getTrueDmgRate(data)))
}

const getTrueSelfDmg = ({ talent, attr, calc, cons, params }, { basic }) => {
  const hp = calc(attr.hp)
  const teammateCount = Math.min(Math.max(params.teammateCount || 0, 0), 3)
  const bounceCount = teammateCount + (cons >= 1 && params.trueSelfTriggered ? 12 : 0)
  const e4Stacks = cons >= 4 ? Math.min(Math.max(params.e4Stacks || 0, 0), 24) : 0
  const bouncePct = talent.me2['「真我」之诗•随机单体伤害'] + e4Stacks * 0.06
  return basic(hp * (talent.me['技能伤害'] + bounceCount * bouncePct), 'me')
}

const getBounceCount = ({ cons, params }) => {
  const teammateCount = Math.min(Math.max(params.teammateCount || 0, 0), 3)
  return teammateCount + (cons >= 1 && params.trueSelfTriggered ? 12 : 0)
}

export const details = [{
  title: '普攻',
  params: { ripple: false, Memosprite: false, trueSelfTriggered: false, e2BuffCount: 0 },
  dmg: (data, { basic }) => {
    const basicDmg = basic(data.calc(data.attr.hp) * data.talent.a['技能伤害'], 'a')
    return addFieldDmg(basicDmg, data)
  }
}, {
  title: '强化普攻·主目标',
  params: { ripple: true, e2BuffCount: 4 },
  dmg: (data, dmg) => addFieldDmg(getEnhancedBasic(data, dmg), data)
}, {
  title: '强化普攻·其余目标',
  params: { ripple: true, e2BuffCount: 4 },
  dmg: (data, { basic }) => {
    const basicDmg = basic(data.calc(data.attr.hp) * data.talent.a2['全体伤害'], 'a')
    return addFieldDmg(basicDmg, data)
  }
}, {
  title: (data) => `忆灵技【花与箭的舞曲】（${getBounceCount(data)}段弹射）`,
  params: {
    ripple: true,
    Memosprite: true,
    trueSelfTriggered: false,
    teammateCount: 3,
    e2BuffCount: 4,
    e4Stacks: 24
  },
  dmg: (data, dmg) => {
    const basicDmg = getTrueSelfDmg(data, dmg)
    return addFieldDmg(basicDmg, data)
  }
}, {
  title: (data) => `【献予「真我」之诗】（${getBounceCount(data)}段弹射）`,
  dmgKey: 'me',
  params: { ripple: true, Memosprite: true, trueSelfTriggered: true, teammateCount: 3, e2BuffCount: 4, e4Stacks: 24 },
  dmg: (data, dmg) => {
    const basicDmg = getTrueSelfDmg(data, dmg)
    return addFieldDmg(basicDmg, data)
  }
}]

export const defDmgIdx = 4
export const defDmgKey = 'me'
export const defParams = {
  ripple: true,
  Memosprite: true,
  trueSelfTriggered: true,
  teammateCount: 3,
  e2BuffCount: 4,
  e4Stacks: 24
}
export const mainAttr = 'hp,cpct,cdmg,speed'
export const createdBy = 'starim00'

export const buffs = [{
  title: '天赋-众愿啊，汇流如歌：我方全体造成的伤害提高[dmg]%',
  data: {
    dmg: ({ talent }) => talent.t['造成的伤害提高'] * 100
  }
}, {
  check: ({ params }) => params.ripple === true,
  title: '终结技-往昔的涟漪：昔涟与德谬歌的暴击率提高[cpct]%',
  data: {
    cpct: ({ talent }) => talent.q['暴击率提高'] * 100
  }
}, {
  check: ({ params }) => params.Memosprite === true,
  title: '忆灵天赋-等待，在所有的过去：昔涟与德谬歌的生命上限提高[hpPct]%',
  data: {
    hpPct: ({ talent }) => talent.mt['生命上限提高'] * 100
  }
}, {
  tree: 3,
  check: ({ attr, calc }) => calc(attr.speed) >= 180,
  title: '行迹-三相的因果：全队伤害提高[dmg]%，昔涟与德谬歌冰抗穿透提高[kx]%（[_speed]速度）',
  sort: 9,
  data: {
    _speed: ({ attr, calc }) => calc(attr.speed),
    dmg: 20,
    kx: ({ attr, calc }) => Math.min(Math.max(calc(attr.speed) - 180, 0), 60) * 2
  }
}, {
  cons: 6,
  check: ({ params }) => params.trueSelfTriggered === true,
  title: '昔涟6魂：【真我】首次触发后，敌方全体防御力降低[enemyDef]%',
  data: {
    enemyDef: 20
  }
}]
