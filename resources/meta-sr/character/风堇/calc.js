export const details = [{
  title: '【雨过天晴】状态普攻伤害',
  params: { AfterRain: true },
  dmg: ({ talent, calc, attr }, { basic }) => basic(calc(attr.hp) * talent.a['技能伤害'], 'a')
}, {
  title: '【雨过天晴】状态战技生命回复量',
  params: { AfterRain: true },
  dmg: ({ talent, attr, calc }, { heal }) => heal(calc(attr.hp) * talent.e['治疗·百分比生命'] + talent.e['治疗·固定值'])
}, {
  title: '首次终结技生命回复量',
  dmg: ({ talent, attr, calc }, { heal }) => heal(calc(attr.hp) * talent.q['治疗·百分比生命'] + talent.q['治疗·固定值'])
}, {
  title: '【雨过天晴】状态忆灵天赋生命回复量',
  params: { AfterRain: true },
  dmg: ({ talent, attr, calc }, { heal }) => heal(calc(attr.hp) * talent.mt['治疗·百分比生命'] * 2 + talent.mt['治疗·固定值'] * 2)
}, {
  title: '【雨过天晴】状态1魂额外条件回复量',
  params: { AfterRain: true },
  dmg: ({ talent, attr, calc }, { heal }) => heal(calc(attr.hp) * 0.08)
}, {
  title: '忆灵技对单伤害-我方6目标-无烧血C',
  params: { AfterRain: true , ServantDmg: true},
  dmg: ({ talent, attr, cons, calc }, { heal, basic }) => {
    let dmg = 0
    let avg = 0
    // 小伊卡治疗单个其他单位治疗量
    let perHeal = heal(calc(attr.hp) * talent.mt['治疗·百分比生命'] + talent.mt['治疗·固定值'])
    let HealServant = perHeal.avg
    // 有专武情况下算上风堇放技能全队烧血治疗
    let cureDelta = 0
    if ( attr.weapon.name === '愿虹光永驻天空') {
      cureDelta += 11 * HealServant   // 11是因为, 我方一共6个目标的前提下, 天赋5次, 雨过天晴全体算6次
    }
    // 释放e
    let healE = heal(5 * (calc(attr.hp) * talent.e['治疗·百分比生命'] + talent.e['治疗·固定值']) + 1 * (calc(attr.hp) * talent.e['小伊卡治疗·百分比生命'] + talent.e['小伊卡治疗·固定值']))
    let nume = healE.avg + cureDelta
    // 释放q
    let healQ = heal(5 * (calc(attr.hp) * talent.q['治疗·百分比生命'] + talent.q['治疗·固定值']) + 1 * (calc(attr.hp) * talent.q['小伊卡治疗·百分比生命'] + talent.q['小伊卡治疗·固定值']))
    let numq = healQ.avg + cureDelta
    // 风堇技能平均治疗
    let numEQ = (nume * 2 + numq * 1) / 3
    // 受击治疗量
    let numHit = 7 * HealServant
    // 队友主动烧血治疗量
    let numConsume = 0
    // 1魂攻击附加治疗量
    let HealCon1 = cons > 0 ? heal(calc(attr.hp) * 0.08) : {avg: 0}
    let numCon1 = 6 * HealCon1.avg
    // 治疗累积值
    let cureAmount = numEQ + numHit + numConsume + numCon1
    // 计算稳定累积治疗值并乘0.8以参考 (经验值, 以代替等比数列的循环求和计算, 可改)
    //let exprVal = cons === 6 ? 0.8 : 0.4
    //let cureMaxRate = cons === 6 ? 8.33 : 2    // 6 ? 1/(1-0.88) : １/(1-0.5)
    cureAmount *= (cons === 6 ? 3.4 : 1.6)
    // 计算伤害
    let tmp = basic(cureAmount * talent.me['技能伤害'], 'me')
    dmg += tmp.dmg, avg += tmp.avg
    return {
      dmg: dmg,
      avg: avg
    }
  }
}, {
  title: '忆灵技对单伤害-我方7目标-有烧血C',
  params: { AfterRain: true , ServantDmg: true },
  dmg: ({ talent, attr, cons, calc }, { heal, basic }) => {
    let dmg = 0
    let avg = 0
    // 小伊卡治疗单个其他单位治疗量
    let perHeal = heal(calc(attr.hp) * talent.mt['治疗·百分比生命'] + talent.mt['治疗·固定值'])
    let HealServant = perHeal.avg
    // 有专武情况下算上风堇放技能全队烧血治疗
    let cureDelta = 0
    if ( attr.weapon.name === '愿虹光永驻天空') {
      cureDelta += 13 * HealServant   // 13是因为, 我方一共7个目标的前提下, 天赋6次, 雨过天晴全体算7次
    }
    // 释放e
    let healE = heal(6 * (calc(attr.hp) * talent.e['治疗·百分比生命'] + talent.e['治疗·固定值']) + 1 * (calc(attr.hp) * talent.e['小伊卡治疗·百分比生命'] + talent.e['小伊卡治疗·固定值']))
    let nume = healE.avg + cureDelta
    // 释放q
    let healQ = heal(6 * (calc(attr.hp) * talent.q['治疗·百分比生命'] + talent.q['治疗·固定值']) + 1 * (calc(attr.hp) * talent.q['小伊卡治疗·百分比生命'] + talent.q['小伊卡治疗·固定值']))
    let numq = healQ.avg + cureDelta
    // 风堇技能平均治疗
    let numEQ = (nume * 2+numq * 1) / 3
    // 受击治疗量
    let numHit = 7 * HealServant
    // 队友主动烧血治疗量
    let numConsume = 11 * HealServant
    // 1魂攻击附加治疗量
    let HealCon1 = cons > 0 ? heal(calc(attr.hp) * 0.08) : {avg: 0}
    let numCon1 = 6 * HealCon1.avg
    // 治疗累积值
    let cureAmount = numEQ + numHit + numConsume + numCon1
    // 计算稳定累积治疗值并乘0.8以参考 (经验值, 以代替等比数列的循环求和计算, 可改)
    //let exprVal = cons === 6 ? 0.8 : 0.4
    //let cureMaxRate = cons === 6 ? 8.33 : 2    // 6 ? 1/(1-0.88) : １/(1-0.5)
    cureAmount *= (cons === 6 ? 3.4 : 1.6)
    // 计算伤害
    let tmp = basic(cureAmount * talent.me['技能伤害'], 'me')
    dmg += tmp.dmg, avg += tmp.avg
    return {
      dmg: dmg,
      avg: avg
    }
  }
}, {
  title: '【雨过天晴】状态战技回复遐蝶新蕊百分点',
  params: { AfterRain: true },
  dmg: ({ talent, attr, calc }, { heal }) => {
    let perHeal = heal(calc(attr.hp) * talent.e['治疗·百分比生命'] + talent.e['治疗·固定值'])
    let num = 6 * perHeal.avg
    if ( attr.weapon.name === '愿虹光永驻天空') {
      let servantHeal = heal(calc(attr.hp) * talent.mt['治疗·百分比生命'] + talent.mt['治疗·固定值'])
      num += 11 * servantHeal.avg
    }
    num = Math.floor( num / 340 )
    return {
      avg: num
    }
  }
}]

export const mainAttr = 'hp,cpct,cdmg'
export const defParams = { Memosprite: true }
export const defDmgIdx = 5

export const buffs = [{
  check: ({ params }) => params.AfterRain === true,
  title: '风堇终结技：处于【雨过天晴】状态时，风堇生命上限提高[hpPlus]点。',
  data: {
    hpPlus: ({ talent, attr, cons }) => {
      let num = cons > 0 ? 0.5 : 0
      return attr.hp.base * (talent.q['生命提高·百分比生命'] + num) + talent.q['生命提高·固定值']
    }
  }
}, {
  check: ({ params }) => params.ServantDmg === true,
  title: '风堇天赋：风堇或小伊卡提供治疗时，小伊卡造成的伤害提高 [_dmmgup]% ，最多可叠加 3 层至 [dmg]%。',
  data: {
    dmg: ({ talent }) => talent.t['伤害提高'] * 100 * 3,
    _dmmgup: ({talent}) => talent.t['伤害提高'] * 100
  }
}, {
  title: '行迹-阴云莞尔：风堇和小伊卡的暴击率提高[cpct]%。',
  tree: 1,
  data: {
    cpct: 100
  }
}, {
  title: '行迹-暴风停歇：风堇的速度大于200时，她与小伊卡的生命上限提高[hpPct]%，之后每超出1点速度，治疗量提高[heal]%。暴击伤害额外提高[cdmg]%（4魂效果）',
  tree: 3,
  sort: 9,
  check: ({ attr, calc }) => calc(attr.speed) > 200,
  data: {
    hpPct: 20,
    heal: ({ attr, calc }) => Math.min(calc(attr.speed) - 200, 200),
    cdmg: ({ cons, attr, calc }) => cons > 3 ? (calc(attr.speed) - 200) * 2 : 0
  }
}, {
  title: "风堇1魂：风堇处于【雨过天晴】状态时，我方全体目标生命上限额外提高50%",
  cons: 1
}, {
  title: '风堇2魂：我方目标生命值降低时，速度提高[speedPct]%。',
  cons: 2,
  data: {
    speedPct: 30
  }
}, {
  title: '风堇6魂：我方全体目标的全属性抗性穿透提高[kx]%。',
  cons: 6,
  data: {
    kx: 20
  }
}]

export const createdBy = '冰翼 & 77惨惨77'
