export const details = [{
  title: '首段普攻',
  params: { num: 1, team: false },
  dmg: ({ talent }, dmg) => dmg(talent.a['一段伤害'], 'a')
}, {
  title: '普攻尾箭',
  params: { num: 10, team: false },
  dmg: ({ talent }, dmg) => dmg(talent.a['五段伤害'], 'a')
}, {
  title: '尾箭蒸发',
  params: { num: 10, team: false },
  dmg: ({ talent }, dmg) => dmg(talent.a['五段伤害'], 'a', 'vaporize')
}, {
  title: '宵夜万班尾箭蒸发',
  params: { num: 10, team: true },
  dmg: ({ talent }, dmg) => dmg(talent.a['五段伤害'], 'a', 'vaporize')
}, {
  check: ({ cons }) => cons >= 6,
  dmgKey: 'e',
  title: '宵夜万班凹双蒸',
  params: { num: 10, team: true },
  dmg: ({ talent }, dmg) => {
    let a0Dmg = dmg(talent.a['一段伤害'] / 2, 'a', 'vaporize')
    let a1Dmg = dmg(talent.a['一段伤害'] / 2, 'a')
    let a1_5Dmg = dmg(talent.a['一段伤害'] / 2, 'a')
    let a2Dmg = dmg(talent.a['二段伤害'], 'a')
    let a3Dmg = dmg(talent.a['三段伤害'], 'a', 'vaporize')
    let a4Dmg = dmg(talent.a['四段伤害'], 'a')
    let a4_5Dmg = dmg(talent.a['四段伤害'] / 2, 'a')
    let a5Dmg = dmg(talent.a['五段伤害'], 'a', 'vaporize')
    let a5_5Dmg = dmg(talent.a['五段伤害'] / 2, 'a', 'vaporize')
    return {
      avg: a0Dmg.avg + a1Dmg.avg + a1_5Dmg.avg + a2Dmg.avg + a3Dmg.avg + 3 * a4_5Dmg.avg + a5_5Dmg.avg + a5Dmg.avg,
      dmg: a0Dmg.dmg + a1Dmg.dmg + a1_5Dmg.dmg + a2Dmg.dmg + a3Dmg.dmg + 3 * a4_5Dmg.dmg + a5_5Dmg.dmg + a5Dmg.dmg
    }
  }
}, {
  check: ({ cons }) => cons < 6,
  dmgKey: 'e',
  title: '宵夜万班147蒸发',
  params: { num: 10, team: true },
  dmg: ({ talent }, dmg) => {
    let a0Dmg = dmg(talent.a['一段伤害'], 'a', 'vaporize')
    let a1Dmg = dmg(talent.a['一段伤害'], 'a')
    let a2Dmg = dmg(talent.a['二段伤害'], 'a')
    let a3Dmg = dmg(talent.a['三段伤害'], 'a', 'vaporize')
    let a4Dmg = dmg(talent.a['四段伤害'], 'a')
    let a5Dmg = dmg(talent.a['一段伤害'], 'a', 'vaporize')
    return {
      avg: a0Dmg.avg / 2 + a1Dmg.avg / 2 + a2Dmg.avg + a3Dmg.avg + a4Dmg.avg + a5Dmg.avg,
      dmg: a0Dmg.dmg / 2 + a1Dmg.dmg / 2 + a2Dmg.dmg + a3Dmg.dmg + a4Dmg.dmg + a5Dmg.dmg
    }
  }
}]

export const defDmgKey = 'e'
export const mainAttr = 'atk,cpct,cdmg,mastery'

export const defParams = {
  num: 10, team: true
}

export const buffs = [{
  title: '焰硝庭火舞：开启E后额外提升普通[aMulti]%伤害',
  data: {
    aMulti: ({ talent }) => talent.e['炽焰箭伤害'] - 100
  }
}, {
  title: '宵宫被动：袖火百景图10层提高20%火伤加成',
  data: {
    dmg: ({ params }) => params.num ? params.num * 2 : 20
  }
}, {
  check: ({ params }) => params.team === true,
  title: '风鹰宗室班：增加[atkPlus]点攻击力',
  data: {
    atkPlus: 1202.35
  }
}, {
  check: ({ params , artis }) => params.team === true && artis.昔日宗室之仪 !== 4 ,
  title: '班尼特-昔日宗室之仪：增加攻击[atkPct]%',
  data: {
    atkPct: 20
  }
}, {
  check: ({ cons, params }) => cons <= 1 && params.team === true,
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
  check: ({ cons, params }) => ((cons < 6 && cons > 1) && params.team === true),
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
  check: ({ cons, params }) => (cons >= 6 && params.team === true),
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
  check: ({ params }) => params.team === true,
  title: '夜兰：获得[dmg]%增伤',
  data: {
    dmg: 35
  }
}, {
  title: '宵宫2命：宵宫造成暴击后获得25%火伤加成',
  cons: 2,
  data: {
    dmg: ({ params }) => params.num > 1 ? 25 : 0
  }
}, {
  title: '宵宫6命：加特林(按照一轮普攻触发3次，尾箭双蒸计算)',
  cons: 6,
  data: {
    aMulti: 0
  }
}, 'vaporize']
