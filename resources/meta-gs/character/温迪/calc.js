export const details = [{
  title: '【魔导·秘仪】飓风箭首段总伤害',
  params: { WindsunderArrow : true, cons_6: true },
  dmg: ({ talent }, dmg) => dmg(talent.a['一段伤害'], 'a')
}, {
  title: '【魔导·秘仪】飓风箭尾段伤害',
  params: { WindsunderArrow : true, cons_6: true },
  dmg: ({ talent }, dmg) => dmg(talent.a['六段伤害'], 'a')
}, {
  title: 'E点按伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['点按伤害'], 'e')
}, {
  title: 'Q后E点按伤害',
  params: { cons_2: true, cons_6: true  },
  cons: 2,
  dmg: ({ talent }, dmg) => dmg(talent.e['点按伤害'], 'e')
}, {
  title: 'Q单段伤害',
  params: { cons_6: true },
  dmg: ({ talent }, dmg) => dmg(talent.q['持续伤害'], 'q')
}, {
  title: 'Q含转化单段',
  params: { cons_6: true },
  dmg: ({ talent }, dmg) => {
    let basic = dmg(talent.q['持续伤害'], 'q')
    // 暂时以物伤近似计算
    let fj = dmg(talent.q['附加元素伤害'], 'q', 'phy')
    return {
      dmg: basic.dmg + fj.dmg,
      avg: basic.avg + fj.avg
    }
  }
}, {
  title: '扩散反应伤害',
  dmg: ({}, { reaction }) => reaction('swirl')
}]

export const defParams = { Hexenzirkel: true } // 魔女会成员
export const defDmgIdx = 1
export const mainAttr = 'atk,cpct,cdmg,mastery'

export const buffs = [{
  check: ({ params }) => params.WindsunderArrow === true,
  title: '温迪被动：飓风箭造成原本[_aMulti]%的普通攻击伤害',
  data: {
    aMulti: ({ talent }) => talent.a['飓风箭伤害'] - 100,
    _aMulti: ({ talent }) => talent.a['飓风箭伤害']
  }
}, {
  title: '温迪2命：E降低24%风抗与物抗',
  cons: 2,
  data: {
    kx: 24
  }
}, {
  check: ({ params }) => params.cons_2 === true,
  title: '温迪2命：施放元素爆发后，点按元素战技将造成原本[_eMulti]%的伤害',
  cons: 2,
  data: {
    eMulti: 200,
    _eMulti: 300
  }
}, {
  title: '温迪4命：温迪获取元素晶球或元素微粒后，获得25%风元素伤害加成',
  cons: 4,
  data: {
    dmg: 25
  }
}, {
  check: ({ params }) => params.cons_6 === true,
  title: '温迪6命：受元素爆发伤害的敌人，风元素抗性降低[kx]%，温迪对这些敌人造成的伤害，还会获得[cdmg]%暴击伤害加成',
  cons: 6,
  data: {
    kx: 20,
    cdmg: 100,
  }
}, 'swirl']

export const createdBy = '喵喵 & 冰翼'
