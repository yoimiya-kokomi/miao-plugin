export const details = [{
  title: 'E后普攻首段',
  dmg: ({ talent }, dmg) => dmg(talent.a['一段伤害'], 'a')
}, {
  title: 'E后强化重击伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['重击伤害'], 'a2')
}, {
  title: 'E后强化重击融化伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['重击伤害'], 'a2', 'melt')
}, {
  title: 'Q总伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}, {
  title: 'Q融化总伤害',
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
}]

export const defDmgIdx = 6
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
  title: '莱欧2命：5层Buff使得Q造成的伤害提升[qDmg]%',
  cons: 2,
  data: {
    qDmg: 200
  }
}, {
  title: '莱欧6命：重击的暴击率提升[a2Cpct]%,暴击伤害提升[a2Cdmg]%,并能够额外造成一次伤害',
  cons: 6,
  data: {
    a2Cpct: 10,
    a2Cdmg: 80
  }
}, 'melt']

export const createdBy = 'Aluxes'
