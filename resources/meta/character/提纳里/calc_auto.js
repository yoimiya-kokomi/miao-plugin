export const details = [{
  title: '花筥箭激化伤害',
  params: { q: false,team:false },
  dmg: ({ talent }, dmg) => dmg(talent.a['花筥箭伤害'], 'a2', '超激化')
}, {
  title: '单支藏蕴花矢伤害',
  params: { q: false,team:false },
  dmg: ({ talent, cons }, dmg) => dmg(talent.a['藏蕴花矢伤害'], 'a2')
}, {
  title: '二段重击总伤害',
  params: { q: false,team:false },
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
}, {
  title: '提万妲eQ3ae3a总激化伤害',
  params: { q: true,team:true },
  dmg: ({ talent, cons }, dmg) => {
    let d1 = dmg(talent.a['花筥箭伤害'], 'a2', '超激化')
    let d2 = dmg(talent.a['藏蕴花矢伤害'], 'a2')
    let d3 = dmg(talent.a['藏蕴花矢伤害'], 'a2', '超激化')
    let q1 = dmg(talent.q['缠藤箭伤害'] , 'q', '超激化')
    let q2 = dmg(talent.q['缠藤箭伤害'] , 'q')
    let q3 = dmg(talent.q['次级缠藤箭伤害'] , 'q', '超激化')
    let q4 = dmg(talent.q['次级缠藤箭伤害'] , 'q')
    let count = cons * 1 === 6 ? 4 : 2
    return {
      dmg: 3*(d1.dmg * count + d2.dmg * 6 + d3.dmg * 2) + q1.dmg * 2+ q2.dmg * 4+ q3.dmg * 2+ q4.dmg * 4,
      avg: 3*(d1.avg * count + d2.avg * 6 + d3.avg * 2) + q1.avg * 2+ q2.avg * 4+ q3.avg * 2+ q4.avg * 4
    }
  }
}]
export const defParams = {
    q: true,
    team:true
}

// 10144 6794&10596
export const mainAttr = 'atk,cpct,cdmg,mastery'
export const defDmgIdx = 4
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
}, {check: ({ cons,params }) => cons <= 1 && params.team === true,
    title: '精1苍古0命万叶：获得[dmg]%增伤(苍古普攻16增伤)，增加[atkPct]%攻击',
    data: {
      aDmg:16,
      a2Dmg:16,
      a3Dmg:16,
      atkPct:20
   }
  }, {check: ({ cons,params }) => ((cons < 6 && cons >1) && params.team === true),
    title: '精1苍古2命万叶：获得[dmg]%增伤(苍古普攻16增伤)，增加[atkPct]%攻击,精通[mastery]',
    data: {
      aDmg:16,
      a2Dmg:16,
      a3Dmg:16,
      atkPct:20,
      mastery:200
   }
  }, {check: ({ cons,params }) =>  (cons >= 6 && params.team === true),
    title: '精5苍古6命万叶：获得[dmg]%增伤(苍古普攻32增伤)，增加[atkPct]%攻击,精通[mastery]',
    data: {
      aDmg:32,
      a2Dmg:32,
      a3Dmg:32,
      atkPct:40,
      mastery:200
   }
  }, {check: ({ cons,params }) =>  (cons >= 2&& params.team === true),
    title: '精5千夜草套纳西妲：增加精通[mastery]（包括双草）,减防[enemyDef]%,减抗[kx]%',
    data: {
      mastery: 398,
      enemyDef: 30,
      kx:30
   }
  }, {check: ({ cons,params }) =>  (cons < 2&& params.team === true),
    title: '精1千夜草套纳西妲：增加精通[mastery]（包括双草）,减抗[kx]%',
    data: {
      mastery: 390,
      kx:30
   }
  }]
