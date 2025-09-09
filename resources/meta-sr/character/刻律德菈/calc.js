export const createdBy = '催更'
export const mainAttr = 'atk,cdmg,speed'
export const defDmgIdx = 2

export const details = [{
  title: '【声明】',
  dmg: () => {
    return {
      avg: '本计算中,刻律德菈无【军功】buff',
      type: 'text',
    }
  }
}, {
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'],'a')
}, {
  title: '终结技伤害',
  dmgKey: 'MARK',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'],'q')
}, {
  title: '天赋附加伤害',
  dmg: ({ talent }, dmg) => dmg(talent.t['附加伤害'],'t')
}, {
  title: '【军功】角色攻击力提升',
  dmg: ({ talent, calc, attr }) => {
    return {
      avg: `${ Math.floor(calc(attr.atk) * talent.t['攻击力提高上限']) }点`,
      type: 'text',
    }
  }
},]

export const buffs = [{
  title: '额外能力-来者：刻律德菈的攻击力大于2000时,每超过100点攻击力可使自身暴击伤害提高18%,最多提高360%,已提高[cdmg]%',
  tree: 1,
  data: {
    cdmg: ({ calc, attr }) => 18 * Math.min(Math.floor(Math.max(calc(attr.atk) - 2000, 0) / 100), 20),
    }
}, {
  title: '额外能力-见者：刻律德菈的暴击率提高[cpct]%。当刻律德菈的充能小于上限时，持有【军功】的角色施放终结技时使刻律德菈获得1点充能，该效果单场战斗中可以触发1次。',
  tree: 2,
  data: {
    cpct: 100,
  }
}, {
  title: '额外能力-征服者：施放战技时，使自身和持有【军功】的队友速度提高[speedPlus]点，持续3回合。持有【军功】的角色施放普攻或战技时，为刻律德菈恢复5点能量。',
  tree: 3,
  data: {
    speedPlus: 20,
  }
}, {
  title: '刻律德菈2魂：持有【军功】的角色造成的伤害提高40%。场上存在持有【军功】的队友时，刻律德菈造成的伤害提高[dmg]%。',
  cons: 2,
  data: {
    dmg: 160,
  }
}, {
  title: '刻律德菈4魂：终结技的伤害倍率提高[qPct]%。',
  cons: 4,
  data: {
    qPct: 240,
  }
}, {
  title: '刻律德菈6魂：持有【军功】的角色全属性抗性穿透提高20%，且【军功】触发的附加伤害倍率提高[tPct]%。场上存在持有【军功】的队友时，刻律德菈全属性抗性穿透提高[kx]%。',
  cons: 6,
  data: {
    tPct: 300,
    kx: 20,
  }
},]
