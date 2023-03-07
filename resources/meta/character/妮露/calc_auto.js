export const details = [{
  title: '水月伤害',
  params: { sy: true ,team:false},
  dmg: ({ talent, calc, attr }, { basic }) => basic(calc(attr.hp) * talent.e['水月/水轮伤害2'][0] / 100, 'e')
}, {
  title: '剑舞步三段伤害',
  params: {team:false },
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
  title: 'Q两段蒸发总伤害',
  params: {team:false },
  dmg: ({ talent, calc, attr }, { basic }) => basic(calc(attr.hp) * (talent.q['技能伤害'] + talent.q['永世流沔伤害']) / 100, 'q', '蒸发')
}, {
  title: '夜万妮香Q总蒸发伤害',
  params: {team:true },
  dmg: ({ talent, calc, attr }, { basic }) => basic(calc(attr.hp) * (talent.q['技能伤害'] + talent.q['永世流沔伤害']) / 100, 'q', '蒸发')
}, {
  title: '丰穰之核伤害',
  params: {team:false },
  params: { bloom: true },
  dmg: ({calc, attr}, { reaction }) => {
      return reaction('bloom')}
}]

export const mainAttr = 'hp,atk,cpct,cdmg,mastery'
export const defDmgIdx = 3


export const defParams = {
    team:true,
}

export const buffs = [{check: ({ params }) => params.team === false,
  title: '妮露天赋：丰穰之核增伤[bloom]%,元素精通提升100点',
  data: {
    bloom: ({ calc, attr }) => Math.min(400,(calc(attr.hp)-30000)/1000*9),
    mastery:({ params }) => params.bloom ? 100 : 0
  }
},{
  title: '妮露1命：水月造成的伤害提升65%',
  cons: 1,
  data: {
    eDmg: ({ params }) => params.sy ? 65 : 0
  }
}, {
  check: ({params }) => params.team === false,
  title: '妮露2命：金杯的丰馈下降低敌人35%水抗与草抗',
  cons: 2,
  data: {
    kx: 35
  }
}, {
    check: ({ cons,params }) => cons <= 1 && params.team === true,
    title: '精1苍古0命万叶：获得[dmg]%增伤(苍古普攻16增伤)，增加[atkPct]%攻击,减抗[kx]%',
    data: {
      aDmg:16,
      a2Dmg:16,
      a3Dmg:16,
      dmg: 40,
      atkPct:20,
      kx:40,
   }
  }, {
    check: ({ cons,params }) => ((cons < 6 && cons >1) && params.team === true),
    title: '精1苍古2命万叶：获得[dmg]%增伤(苍古普攻16增伤)，增加[atkPct]%攻击,减抗[kx]%,精通[mastery]',
    data: {
      aDmg:16,
      a2Dmg:16,
      a3Dmg:16,
      dmg: 48,
      atkPct:20,
      kx:40,
      mastery:200
   }
  }, {
    check: ({ cons,params }) =>  (cons >= 6 && params.team === true),
    title: '精5苍古6命万叶：获得[dmg]%增伤(苍古普攻32增伤)，增加[atkPct]%攻击,减抗[kx]%,精通[mastery]',
    data: {
      aDmg:32,
      a2Dmg:32,
      a3Dmg:32,
      dmg: 48,
      atkPct:40,
      kx:40,
      mastery:200
   }
  }, {
    check: ({ cons,params }) =>  (cons >= 4 && params.team === true),
    title: '双水夜兰2层4命：双水,夜兰4命[hpPct]%生命值,[dmg]增伤',
    data: {
      hpPct: 45,
      dmg:30
   }
  }, {
    check: ({ cons,params }) =>  (cons < 4 && params.team === true),
    title: '双水夜兰：双水[hpPct]%生命值,[dmg]增伤',
    data: {
      hpPct: 25,
      dmg:30
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
  data: {
    cpct: ({ calc, attr }) => Math.min(30, calc(attr.hp) / 1000 * 0.6),
    cdmg: ({ calc, attr }) => Math.min(60, calc(attr.hp) / 1000 * 1.2)
  }
}, 'vaporize']
