export const details = [{
  title: 'E后普攻首段',
  dmg: ({ talent }, dmg) => dmg(talent.a['一段伤害'], 'a')
}, {
  title: 'E后强化重击伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['重击伤害'], 'a2')
}, {
  title: 'E后强化重击融化伤害',
  params: { Melt: true },
  dmg: ({ talent }, dmg) => dmg(talent.a['重击伤害'], 'a2', 'melt')
}, {
  title: 'Q总伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}, {
  title: 'Q融化总伤害',
  params: { Melt: true },
  dmg: ({ talent }, dmg) => {
    const td = talent.q['技能伤害2'][0]
    let normalDmg = dmg(td, 'q')
    let meltDmg = dmg(td, 'q', 'melt')
    return {
      dmg: normalDmg.dmg * 3 + meltDmg.dmg * 2,
      avg: normalDmg.avg * 3 + meltDmg.avg * 2
    }
  }
}, {
  title: '一轮普攻5A接重击',
  dmg: ({ talent, cons }, dmg) => {
    let a1Dmg = dmg(talent.a['一段伤害'], 'a')
    let a2Dmg = dmg(talent.a['二段伤害'], 'a')
    let a3Dmg = dmg(talent.a['三段伤害'], 'a')
    let a4Dmg = dmg(talent.a['四段伤害'], 'a')
    let a5Dmg = dmg(talent.a['五段伤害'], 'a')
    let azDmg = dmg(talent.a['重击伤害'], 'a2')
    let azCount = cons < 6 ? 1 : 2
    return {
      dmg: a1Dmg.dmg + a2Dmg.dmg + a3Dmg.dmg + a4Dmg.dmg + a5Dmg.dmg + azDmg.dmg * azCount,
      avg: a1Dmg.avg + a2Dmg.avg + a3Dmg.avg + a4Dmg.avg + a5Dmg.avg + azDmg.avg * azCount
    }
  }
}, {
  title: '一轮普攻5A接重击(融化)',
  params: { Melt: true },
  dmg: ({ talent, cons }, dmg) => {
    let a1Dmg = dmg(talent.a['一段伤害'], 'a', 'melt')
    let a2Dmg = dmg(talent.a['二段伤害'], 'a')
    let a3Dmg = dmg(talent.a['三段伤害'], 'a')
    let a41Dmg = dmg(talent.a['四段伤害2'][0], 'a', 'melt')
    let a42Dmg = dmg(talent.a['四段伤害2'][0], 'a')
    let a5Dmg = dmg(talent.a['五段伤害'], 'a')
    let azDmg = dmg(talent.a['重击伤害'], 'a2', 'melt')
    let azMeltCount = cons < 6 ? 1 : 2
    return {
      dmg: a1Dmg.dmg + a2Dmg.dmg + a3Dmg.dmg + a41Dmg.dmg + a42Dmg.dmg + a5Dmg.dmg + azDmg.dmg * azMeltCount,
      avg: a1Dmg.avg + a2Dmg.avg + a3Dmg.avg + a41Dmg.avg + a42Dmg.avg + a5Dmg.avg + azDmg.avg * azMeltCount
    }
  }
}, {
  title: '一轮普攻5A接重击(星超导)',
  params: { Stellar: true },
  dmg: ({ talent, cons, attr, calc }, dmg) => {
    let a1Dmg = dmg(talent.a['一段伤害'], 'a')
    let a2Dmg = dmg(talent.a['二段伤害'], 'a')
    let a3Dmg = dmg(talent.a['三段伤害'], 'a')
    let a4Dmg = dmg(talent.a['四段伤害'], 'a')
    // 1命(星超导)：第五段斥逐拳与天辉·凌跃拳互相触发，造成的伤害提升50%
    let c1Mult = cons >= 1 ? 1.5 : 1
    let a5Dmg = dmg(talent.a['五段伤害'] * c1Mult, 'a')
    // 星超导反应伤害：第三段、第五段额外造成，天辉·凌跃拳（重击）视为星超导反应伤害
    let stellarPct3 = cons < 2 ? 60 : 90
    let stellarPct5 = cons < 2 ? 80 : 120
    let stellarPctZ = cons < 2 ? 100 : 150
    let s3Dmg = dmg.basic(calc(attr.atk) * talent.a['三段伤害'] * stellarPct3 / 100, 'a', 'stellarConduct')
    let s5Dmg = dmg.basic(calc(attr.atk) * talent.a['五段伤害'] * stellarPct5 * c1Mult / 100, 'a', 'stellarConduct')
    let szDmg = dmg.basic(calc(attr.atk) * talent.a['重击伤害'] * stellarPctZ * c1Mult / 100, 'a2', 'stellarConduct')
    let sDmg = s3Dmg.dmg + s5Dmg.dmg + szDmg.dmg
    let sAvg = s3Dmg.avg + s5Dmg.avg + szDmg.avg
    // 6命：第五段斥逐拳与天辉·凌跃拳额外生成冰锥，造成原本20%的星超导反应伤害
    if (cons >= 6) {
      let s5Extra = dmg.basic(calc(attr.atk) * talent.a['五段伤害'] * 20 * c1Mult / 100, 'a', 'stellarConduct')
      let szExtra = dmg.basic(calc(attr.atk) * talent.a['重击伤害'] * 20 * c1Mult / 100, 'a2', 'stellarConduct')
      sDmg += s5Extra.dmg + szExtra.dmg
      sAvg += s5Extra.avg + szExtra.avg
    }
    return {
      dmg: a1Dmg.dmg + a2Dmg.dmg + a3Dmg.dmg + a4Dmg.dmg + a5Dmg.dmg + sDmg,
      avg: a1Dmg.avg + a2Dmg.avg + a3Dmg.avg + a4Dmg.avg + a5Dmg.avg + sAvg
    }
  }
}]

export const defDmgIdx = 7
export const mainAttr = 'atk,cpct,cdmg,mastery'

export const buffs = [{
  title: '冰牙突驰：强化普攻，使其造成的伤害提升至[_aMulti]%',
  data: {
    _aMulti: ({ talent }) => talent.e['强化斥逐拳伤害'],
    aMulti: ({ talent }) => talent.e['强化斥逐拳伤害'] - 100
  }
}, {
  title: '天赋-公理终有辩诉之日：重击造成的伤害提升[a2Dmg]%',
  data: {
    a2Dmg: 50
  }
}, {
  title: '天赋-罪业终有报偿之时：生命变动时获得1层Buff，5层Buff使得攻击力提升[atkPct]%',
  data: {
    atkPct: 30
  }
}, {
  title: '莱欧1命：重击造成的伤害额外提升[a2Dmg]%',
  cons: 1,
  data: {
    a2Dmg: 150
  }
}, {
  check: ({ params }) => params.Stellar === true,
  cons: 1,
  title: '莱欧1命(星超导)：第五段斥逐拳与天辉·凌跃拳互相触发，造成的伤害提升50%',
  data: {}
}, {
  title: '莱欧2命：5层Buff使得Q造成的伤害提升[qDmg]%',
  cons: 2,
  data: {
    qDmg: 200
  }
}, {
  check: ({ params }) => params.Stellar !== true,
  cons: 2,
  title: '莱欧2命：5层Buff使得普攻与重击分别造成原本125%/130%的伤害',
  data: {
    // 普攻：独立乘区为加算(1+multi)，E技能强化已占用 aMulti=强化斥逐拳伤害-100。
    // 直接写25会与之加算导致结果偏低，故反推所需值：
    // 令 (1+(S-100+m)/100) = (1+(S-100)/100)*1.25，解得 m = S*0.25（S=强化斥逐拳伤害）
    aMulti: ({ talent }) => talent.e['强化斥逐拳伤害'] * 0.25,
    // 重击不受E技能强化，a2无其他multi来源，可直接写30
    a2Multi: 30
  }
}, {
  title: '莱欧6命：重击的暴击率提升[a2Cpct]%,暴击伤害提升[a2Cdmg]%,并能够额外造成一次伤害',
  cons: 6,
  data: {
    a2Cpct: 10,
    a2Cdmg: 80
  }
}, {
  // 融化队通常搭配双火共鸣(+25%攻击力)
  check: ({ params }) => params.Melt === true,
  title: '双火共鸣：队伍中有2名火元素角色时，攻击力提升[atkPct]%',
  data: {
    atkPct: 25
  }
}, {
  // 星超导队通常搭配双冰共鸣(+15%暴击率)
  check: ({ params }) => params.Stellar === true,
  title: '双冰共鸣：攻击冰元素附着或冻结状态下的敌人时，暴击率提高[cpct]%',
  data: {
    cpct: 15
  }
}, {
  check: ({ params }) => params.Stellar === true,
  title: '天赋-冤苦终有显明之期：莱欧斯利造成的星超导反应伤害提升[stellarConduct]%',
  data: {
    stellarConduct: 30
  }
}, {
  check: ({ params }) => params.Stellar === true,
  cons: 6,
  title: '莱欧6命(星超导)：被寒烈的惩裁强化的斥逐拳与天辉·凌跃拳的暴击率提升[aCpct]%,暴击伤害提升[aCdmg]%',
  data: {
    aCpct: 10,
    aCdmg: 80
  }
}]

export const createdBy = 'Aluxes'
