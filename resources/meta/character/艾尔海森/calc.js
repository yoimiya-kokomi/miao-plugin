export const details = [{
  title: 'E普攻第一段激化',
  dmg: ({ talent }, dmg) => dmg(talent.a['一段伤害'], 'a', '蔓激化')
}, {
  title: 'E突进激化',
  params: { e: true, q: false },
  dmg: ({ talent, calc, attr }, { basic }) => {
    const td = talent.e['突进攻击伤害2']
    const em = calc(attr.mastery)
    const atk = calc(attr.atk)
    return basic(td[0] * atk / 100 + td[1] * em / 100, 'e', 'spread')
  }
}, {
  title: '3枚光幕单段',
  dmg: ({ talent, calc, attr }, { basic }) => {
    const td = talent.e['1枚光幕攻击伤害2']
    const em = calc(attr.mastery)
    const atk = calc(attr.atk)
    return basic(td[0] * atk / 100 + td[1] * em / 100, 'e')
  }
}, {
  title: '3枚光幕单段激化',
  dmg: ({ talent, calc, attr }, { basic }) => {
    const td = talent.e['1枚光幕攻击伤害2']
    const em = calc(attr.mastery)
    const atk = calc(attr.atk)
    return basic(td[0] * atk / 100 + td[1] * em / 100, 'e', 'spread')
  }
}, {
  title: 'Q激化总伤-4段',
  params: { e: false, q: true },
  dmg: ({ talent, calc, attr }, { basic }) => {
    const td = talent.q['单次伤害2']
    const em = calc(attr.mastery)
    const atk = calc(attr.atk)
    let q = basic(td[0] * atk / 100 + td[1] * em / 100, 'q', 'spread')
    let q_spread = basic(td[0] * atk / 100 + td[1] * em / 100, 'q')
    return {
      dmg: q.dmg * 2 + q_spread.dmg * 2,
      avg: q.avg * 2 + q_spread.avg * 2
    }
  }
}, {
  title: 'Q激化总伤-10段',
  params: { e: false, q: true },
  dmg: ({ talent, calc, attr }, { basic }) => {
    const td = talent.q['单次伤害2']
    const em = calc(attr.mastery)
    const atk = calc(attr.atk)
    let q_spread = basic(td[0] * atk / 100 + td[1] * em / 100, 'q', 'spread')
    let q = basic(td[0] * atk / 100 + td[1] * em / 100, 'q')
    return {
      dmg: q.dmg * 6 + q_spread.dmg * 4,
      avg: q.avg * 6 + q_spread.avg * 4
    }
  }
}]

export const defDmgIdx = 3
export const mainAttr = 'atk,cpct,cdmg,mastery'

export const defParams = {
  q: false,
  e: true
}

export const buffs = [{
  title: '艾尔海森被动：基于元素精通提升EQ伤害[eDmg]%',
  sort: 9,
  data: {
    eDmg: ({ calc, attr }) => Math.min(100, (calc(attr.mastery)) * 0.1),
    qDmg: ({ calc, attr }) => Math.min(100, (calc(attr.mastery)) * 0.1)
  }
}, {
  title: '海森2命：每1枚产生的琢光镜将使元素精通提升50点，默认3层',
  cons: 2,
  data: {
    mastery: 150
  }
}, {
  check: ({ params }) => params.q === false,
  title: '海森4命：每1枚产生的琢光镜将使草元素伤害提升10%，默认3层,不加成Q',
  cons: 4,
  data: {
    dmg: 30
  }
}, {
  check: ({ params }) => params.q === false,
  title: '艾尔海森六命：暴击率提升10%，暴击伤害提升70%,不加成Q',
  cons: 6,
  data: {
    cpct: 10,
    cdmg: 70
  }
}, 'spread']
