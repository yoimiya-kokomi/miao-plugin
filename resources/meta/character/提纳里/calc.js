export const details = [{
  title: '花筥箭激化伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['花筥箭伤害'], 'a2', 'spread')
}, {
  title: '满蓄力重击总伤害',
  dmg: ({ talent, cons }, dmg) => {
    let d1 = dmg(talent.a['花筥箭伤害'], 'a2')
    let d2 = dmg(talent.a['藏蕴花矢伤害'], 'a2')
    let talentc6a2 = 150.0
    let d2c6 = dmg(talentc6a2, 'a2')
    let count = cons >= 6 ? 1 : 0
    return {
      dmg: d1.dmg + d2.dmg * 4 + d2c6.dmg * count,
      avg: d1.avg + d2.avg * 4 + d2c6.avg * count
    }
  }
}, {
  title: '满蓄力重击激化总伤害',
  dmgKey: 'a2_j',
  dmg: ({ talent, cons }, dmg) => {
    let d1j = dmg(talent.a['花筥箭伤害'], 'a2', 'spread')
    let d2 = dmg(talent.a['藏蕴花矢伤害'], 'a2')
    let d2j = dmg(talent.a['藏蕴花矢伤害'], 'a2', 'spread')
    let talentc6a2 = 150.0
    let d2jc6 = dmg(talentc6a2, 'a2', 'spread')
    let count = cons >= 6 ? 1 : 0
    return {
      dmg: d1j.dmg + d2.dmg * 3 + d2j.dmg + d2jc6.dmg * count,
      avg: d1j.avg + d2.avg * 3 + d2j.dmg + d2jc6.dmg * count
    }
  }
}, {
  title: 'Q总伤害',
  params: { q: true },
  dmg: ({ talent }, dmg) => {
    return dmg(talent.q['缠藤箭伤害'] * 6 + talent.q['次级缠藤箭伤害'] * 6, 'q')
  }
}, {
  title: 'Q激化总伤害',
  params: { q: true },
  dmg: ({ talent }, dmg) => {
    let q1 = dmg(talent.q['缠藤箭伤害'], 'q')
    let q1j = dmg(talent.q['缠藤箭伤害'], 'q', 'spread')
    let q2 = dmg(talent.q['次级缠藤箭伤害'], 'q')
    let q2j = dmg(talent.q['次级缠藤箭伤害'], 'q', 'spread')
    return {
      dmg: q1.dmg * 4 + q1j.dmg * 2 + q2.dmg * 4 + q2j.dmg * 2,
      avg: q1.avg * 4 + q1j.avg * 2 + q2.avg * 4 + q2j.avg * 2
    }
  }
}]

export const mainAttr = 'atk,cpct,cdmg,mastery'
export const defDmgKey = 'a2_j'

export const buffs = [{
  title: '提纳里被动：发射花筥箭后，元素精通提升50点',
  data: {
    mastery: 50
  }
}, {
  title: '提纳里被动：基于元素精通提升重击及Q伤害[a2Dmg]%',
  sort: 9,
  data: {
    a2Dmg: ({ calc, attr }) => Math.min(60, calc(attr.mastery) * 0.06),
    qDmg: ({ calc, attr }) => Math.min(60, calc(attr.mastery) * 0.06)
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
}, 'spread']
