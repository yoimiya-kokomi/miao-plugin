export const details = [{
  title: '开E后首段普攻',
  params: { pyro: false, cryo: false, team: false, team_ye: false },
  dmg: ({ talent }, dmg) => dmg(talent.a['一段伤害'], 'a')
}, {
  title: '开E后重击',
  params: { pyro: false, cryo: false, team: false, team_ye: false },
  dmg: ({ talent }, dmg) => dmg(talent.a['重击伤害'], 'a2')
}, {
  title: '开E满染火首段普攻',
  params: { pyro: true, cryo: false, team: false, team_ye: false },
  dmg: ({ talent }, dmg) => dmg(talent.a['一段伤害'], 'a')
}, {
  title: '开E满染火染冰首段普攻',
  params: { pyro: true, cryo: true, team: false, team_ye: false },
  dmg: ({ talent }, dmg) => dmg(talent.a['一段伤害'], 'a')
}, {
  title: '狂言·式乐五番',
  params: { pyro: true, cryo: true, team: false, team_ye: false },
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}, {
  check: ({ cons }) => cons >= 6,
  dmgKey: 'e',
  title: '散夜珐班E后普攻6轮接Q',
  params: { pyro: true, cryo: false, team: true, team_ye: true },
  dmg: ({ talent }, dmg) => {
    let a_1Dmg = dmg(talent.a['一段伤害'], 'a')
    let a_2Dmg = dmg(talent.a['二段伤害'], 'a')
    let a_3Dmg = dmg(talent.a['三段伤害'] / 2, 'a')
    //   let count = cons * 1 === 6 ? 1 : 0,
    let a1_2Dmg = dmg(talent.a['一段伤害'] * 0.4, 'a')
    let a2_2Dmg = dmg(talent.a['二段伤害'] * 0.4, 'a')
    let a3_2Dmg = dmg(talent.a['三段伤害'] * 0.4 / 2, 'a')
    let Q_Dmg = dmg(talent.q['技能伤害'], 'q')
    return {
      avg: 6 * (a_1Dmg.avg + a_2Dmg.avg + a_3Dmg.avg * 2 + a1_2Dmg.avg + a2_2Dmg.avg + a3_2Dmg.avg * 2) + Q_Dmg.avg,
      dmg: 6 * (a_1Dmg.dmg + a_2Dmg.dmg + a_3Dmg.dmg * 2 + a1_2Dmg.dmg + a2_2Dmg.dmg + a3_2Dmg.dmg * 2) + Q_Dmg.dmg
    }
  }
}, {
  check: ({ cons }) => cons < 6,
  dmgKey: 'e',
  title: '散夜珐班E后普攻6轮接Q',
  params: { pyro: true, cryo: false, team: true, team_ye: true },
  dmg: ({ talent }, dmg) => {
    let a_1Dmg = dmg(talent.a['一段伤害'], 'a')
    let a_2Dmg = dmg(talent.a['二段伤害'], 'a')
    let a_3Dmg = dmg(talent.a['三段伤害'] / 2, 'a')
    let Q_Dmg = dmg(talent.q['技能伤害'], 'q')
    return {
      avg: 6 * (a_1Dmg.avg + a_2Dmg.avg + a_3Dmg.avg * 2) + Q_Dmg.avg,
      dmg: 6 * (a_1Dmg.dmg + a_2Dmg.dmg + a_3Dmg.dmg * 2) + Q_Dmg.dmg
    }
  }
}, {
  check: ({ cons }) => cons >= 6,
  dmgKey: 'q',
  title: '散珐云班E后普攻6轮接Q',
  params: { pyro: true, cryo: false, team: true, team_ye: false },
  dmg: ({ talent }, dmg) => {
    let a_1Dmg = dmg(talent.a['一段伤害'], 'a')
    let a_2Dmg = dmg(talent.a['二段伤害'], 'a')
    let a_3Dmg = dmg(talent.a['三段伤害'] / 2, 'a')
    let a1_2Dmg = dmg(talent.a['一段伤害'] * 0.4, 'a')
    let a2_2Dmg = dmg(talent.a['二段伤害'] * 0.4, 'a')
    let a3_2Dmg = dmg(talent.a['三段伤害'] * 0.4 / 2, 'a')
    let Q_Dmg = dmg(talent.q['技能伤害'], 'q')
    return {
      avg: 6 * (a_1Dmg.avg + a_2Dmg.avg + a_3Dmg.avg * 2 + a1_2Dmg.avg + a2_2Dmg.avg + a3_2Dmg.avg * 2) + Q_Dmg.avg,
      dmg: 6 * (a_1Dmg.dmg + a_2Dmg.dmg + a_3Dmg.dmg * 2 + a1_2Dmg.dmg + a2_2Dmg.dmg + a3_2Dmg.dmg * 2) + Q_Dmg.dmg
    }
  }
}, {
  check: ({ cons }) => cons < 6,
  dmgKey: 'q',
  title: '散珐云班E后普攻6轮接Q',
  params: { pyro: true, cryo: false, team: true, team_ye: false },
  dmg: ({ talent }, dmg) => {
    let a_1Dmg = dmg(talent.a['一段伤害'], 'a')
    let a_2Dmg = dmg(talent.a['二段伤害'], 'a')
    let a_3Dmg = dmg(talent.a['三段伤害'] / 2, 'a')
    let Q_Dmg = dmg(talent.q['技能伤害'], 'q')
    return {
      avg: 6 * (a_1Dmg.avg + a_2Dmg.avg + a_3Dmg.avg * 2) + Q_Dmg.avg,
      dmg: 6 * (a_1Dmg.dmg + a_2Dmg.dmg + a_3Dmg.dmg * 2) + Q_Dmg.dmg
    }
  }
}]

export const defDmgKey = 'e'
export const mainAttr = 'atk,cpct,cdmg'

export const defParams = {
  pyro: true, cryo: true, team: true, team_ye: true
}

export const buffs = [{
  title: '羽画·风姿华歌：开启E后额外提升普通[aMulti]%伤害,重击[a2Multi]%伤害',
  data: {
    aMulti: ({ talent }) => talent.e['空居·不生断伤害'] - 100,
    a2Multi: ({ talent }) => talent.e['空居·刀风界伤害'] - 100
  }
}, {
  title: '天赋拾玉得花：火元素攻击力提升30%,冰元素暴击率提升20%',
  data: {
    atkPct: ({ params }) => params.pyro ? 30 : 0,
    cpct: ({ params }) => params.cryo ? 20 : 0
  }
}, {
  title: '二番·箙岛月白浪：至多使狂言·式乐五番造成的伤害提升200%',
  cons: 2,
  data: {
    qDmg: 200
  }
}, {
  title: '四番·花月歌浮舟：染色+1，默认冰',
  cons: 4,
  data: {
    cpct: ({ params }) => params.cryo ? 0 : 20
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
  check: ({ params }) => params.team === true,
  title: '满命珐露珊：获得[dmg]%增伤,获得[kx]%减抗,获得[cdmg]%爆伤',
  data: {
    dmg: 40,
    kx: 30,
    cdmg: 40
  }
}, {
  check: ({ params }) => params.team === true && params.team_ye === true,
  title: '夜兰：获得[dmg]%增伤',
  data: {
    dmg: 35
  }
}, {
  check: ({ params }) => params.team === true && params.team_ye === false,
  title: '云堇：普攻附加伤害值2000',
  data: {
    aPlus: 2000
  }
}]
