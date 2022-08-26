export const details = [{
  title: '花筥箭伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['花筥箭伤害'], 'a2')
}, {
  title: '单支藏蕴花矢伤害',
  dmg: ({ talent, cons }, dmg) => dmg(talent.a['藏蕴花矢伤害'], 'a2')
}, {
  title: '二段重击总伤害',
  dmg: ({ talent, cons }, dmg) => {
    let d1 = dmg(talent.a['花筥箭伤害'], 'a2')
    let d2 = dmg(talent.a['藏蕴花矢伤害'], 'a2')
    let count = cons * 1 === 6 ? 5 : 4
    return {
      dmg: d1.dmg + d2.dmg * count,
      avg: d1.avg + d2.avg * count
    }
  }
}, {
  title: 'Q总伤害',
  params: { q: true },
  dmg: ({ talent, cons }, dmg) => {
    return dmg(talent.q['缠藤箭伤害'] * 6 + talent.q['次级缠藤箭伤害'] * 6, 'q')
  }
}]

// 10144 6794&10596
export const mainAttr = 'atk,cpct,cdmg,mastery'

export const buffs = [{
  title: '提纳里被动：发射花筥箭后，元素精通提升50点',
  data: {
    mastery: 50,
    qMastery: 0
  }
}, {
  title: '提纳里被动：基于元素精通提升重击及Q伤害[a2Dmg]%',
  sort: 5,
  data: {
    a2Dmg: ({ calc, attr }) => Math.min(80, calc(attr.mastery) * 0.08),
    qDmg: ({ calc, attr }) => Math.min(80, calc(attr.mastery) * 0.08)
  }
}, {
  title: '提纳里1命：重击暴击率提高15%',
  cons: 1,
  data: {
    a2Cpct: 15
  }
}, {
  title: '提纳里2命：E范围中存在敌人时，获得20%草伤加成',
  cons: 2,
  data: {
    dmg: 20
  }
}, {
  title: '提纳里4命：释放Q时提高元素精通60，触发反应进一步提升60',
  cons: 4,
  data: {
    mastery: ({ params }) => params.q ? 120 : 0
  }
}, {
  title: '提纳里6命：花筥箭在命中后能产生1枚额外的藏蕴花矢',
  cons: 6
}]
