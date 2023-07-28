let eDmg = false
let eAggrDmg = false
let eAllDmg = false
let ePlusDmg = false
let ePlusAggrDmg = false

export const details = [{
  title: 'Q状态·普攻首段',
  dmg: ({ talent }, dmg) => dmg(talent.q['一段伤害'], 'a')
}, {
  title: 'Q状态·E伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['冥祭伤害'], 'e')
}, {
  title: 'Q状态·强化E伤害',
  params: { showEBuff: true, eBuff: true },
  dmg: ({ talent }, dmg) => {
    eDmg = dmg(talent.e['冥祭伤害'], 'e')
    eAggrDmg = dmg(talent.e['冥祭伤害'], 'e', 'aggravate')
    return eDmg
  }
}, {
  title: 'Q状态·QTE总伤害',
  params: { showEBuff: true },
  dmg: ({ attr, calc }, { basic }) => {
    const em = calc(attr.mastery)
    const atk = calc(attr.atk)
    const ePlustd = 1.00 * atk + em * 2.5
    ePlusDmg = basic(ePlustd, 'e')
    return {
      dmg: eDmg.dmg + ePlusDmg.dmg * 3,
      avg: eDmg.avg + ePlusDmg.avg * 3
    }
  }
}, {
  title: 'Q状态·QTE超激化总伤害',
  params: { showEBuff: true },
  dmg: ({ attr, calc }, { basic }) => {
    const em = calc(attr.mastery)
    const atk = calc(attr.atk)
    const ePlustd = 1.00 * atk + em * 2.5
    ePlusAggrDmg = basic(ePlustd, 'e', 'aggravate')
    eAllDmg = {
      dmg: eAggrDmg.dmg + ePlusAggrDmg.dmg + ePlusDmg.dmg * 2,
      avg: eAggrDmg.avg + ePlusAggrDmg.avg + ePlusDmg.avg * 2
    }
    return eAllDmg
  }
}, {
  check: ({ cons }) => cons < 6,
  title: 'Q状态·一轮普攻5A+QTE超激化总伤害',
  params: { showEBuff: true },
  dmg: ({ talent }, dmg) => {
    let a1Aggrdmg = dmg(talent.q['一段伤害'], 'a', 'aggravate')
    let a2dmg = dmg(talent.q['二段伤害'], 'a')
    let a3dmg = dmg(talent.q['三段伤害'], 'a')
    let a4Aggrdmg = dmg(talent.q['四段伤害2'][0], 'a', 'aggravate')
    let a4dmg = dmg(talent.q['四段伤害2'][1], 'a')
    let a5dmg = dmg(talent.q['五段伤害'], 'a')
    return {
      dmg: eAllDmg.dmg + a1Aggrdmg.dmg + a2dmg.dmg + a3dmg.dmg + a4Aggrdmg.dmg + a4dmg.dmg + a5dmg.dmg,
      avg: eAllDmg.avg + a1Aggrdmg.avg + a2dmg.avg + a3dmg.avg + a4Aggrdmg.avg + a4dmg.avg + a5dmg.avg
    }
  }
}, {
  check: ({ cons }) => cons >= 6,
  title: 'Q状态·一轮普攻5A+QTE超激化总伤害（消耗4层豺祭）',
  params: { showEBuff: true },
  dmg: ({ talent }, dmg) => {
    let a1Aggrdmg = dmg(talent.q['一段伤害'], 'a', 'aggravate')
    let a2dmg = dmg(talent.q['二段伤害'], 'a')
    let a3dmg = dmg(talent.q['三段伤害'], 'a')
    let a4Aggrdmg = dmg(talent.q['四段伤害2'][0], 'a', 'aggravate')
    let a4dmg = dmg(talent.q['四段伤害2'][1], 'a')
    let a5dmg = dmg(talent.q['五段伤害'], 'a')
    return {
      dmg: eAllDmg.dmg + a1Aggrdmg.dmg + a2dmg.dmg + a3dmg.dmg + a4Aggrdmg.dmg + a4dmg.dmg + a5dmg.dmg + ePlusDmg.dmg * 3 + ePlusAggrDmg.dmg,
      avg: eAllDmg.avg + a1Aggrdmg.avg + a2dmg.avg + a3dmg.avg + a4Aggrdmg.avg + a4dmg.avg + a5dmg.avg + ePlusDmg.avg * 3 + ePlusAggrDmg.avg
    }
  }
}]

export const defDmgIdx = 5
export const mainAttr = 'atk,cpct,cdmg,mastery'

export const buffs = [{
  title: '圣仪·煟煌随狼行：Q状态下提升元素精通100点',
  data: {
    mastery: 100
  }
}, {
  title: '赛诺2命：普攻后提高雷伤，满5层Buff增加50%雷元素伤害',
  cons: 2,
  data: {
    dmg: 50
  }
}, {
  check: ({ params }) => params.showEBuff === true,
  title: '赛诺被动：末途真眼状态提升秘仪·律渊渡魂35%伤害，发射渡荒之雷造成100%攻击力伤害',
  data: {
    eDmg: ({ params }) => params.eBuff ? 35 : 0
  }
}, {
  title: '赛诺被动：基于元素精通提升普攻[aPlus]点伤害值，渡荒之雷提升[_ePlus]伤害值',
  data: {
    aPlus: ({ attr, calc }) => calc(attr.mastery) * 1.5,
    _ePlus: ({ attr, calc }) => calc(attr.mastery) * 2.5
  }
}]
