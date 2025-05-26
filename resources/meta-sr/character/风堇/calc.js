export const details = [{
  title: '【雨过天晴】状态普攻伤害',
  params: { AfterRain: true },
  dmg: ({ talent, calc, attr }, { basic }) => basic(calc(attr.hp) * talent.a['技能伤害'], 'a')
}, {
  title: '【雨过天晴】状态战技生命回复量',
  params: { AfterRain: true },
  dmg: ({ talent, attr, calc }, { heal }) => heal(calc(attr.hp) * talent.e['治疗·百分比生命'] + talent.e['治疗·固定值'])
}, {
  title: '终结技生命回复量',
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
  title: '忆灵技对单参考伤害-我方6目标-无烧血C',
  params: { AfterRain: true , ServantDmg: true},
  dmg: ({ talent, attr, calc }, { heal }) => heal(calc(attr.hp) * 0.08)
}, {
  title: '忆灵技对单参考伤害-我方7目标-有烧血C',
  params: { AfterRain: true , ServantDmg: true },
  dmg: ({ talent, attr, calc }, { heal }) => heal(calc(attr.hp) * 0.08)
}, {
  title: '【雨过天晴】状态战技回复遐蝶新蕊保守量',
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
export const defDmgIdx = 2

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
  title: '风堇额外能力：风堇和小伊卡的暴击率提高100%。为当前生命值小于等于自身生命上限的50%的我方目标提供治疗时，治疗量提高25%。',
  tree: 1,
  data: {
    cpct: 100,
    heal: 25
  }
}, {
  title: '风堇额外能力：风堇的速度大于200时，她与小伊卡的生命上限提高[hpPct]%，之后每超出1点速度，治疗量提高[heal]%。暴击伤害额外提高[cdmg]%（4魂效果）',
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
