export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '战技伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: '战技+剑势伤害',
  dmg: ({ talent }, dmg) => {
    let eDmg = dmg(talent.e['技能伤害'], 'e')
    let ePlusDmg = dmg.dynamic(talent.e['附加伤害'], 'e', { dynamicDmg: 20 })
    return {
      dmg: eDmg.dmg + ePlusDmg.dmg,
      avg: eDmg.avg + ePlusDmg.avg
    }
  }
}, {
  title: '终结技伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}, {
  title: '终结技后满剑势战技伤害',
  dmg: ({ talent }, dmg) => {
    let eDmg = dmg(talent.e['技能伤害'], 'e')
    let ePlusDmg = dmg.dynamic(talent.e['附加伤害'], 'e', { dynamicDmg: 20 })
    return {
      dmg: eDmg.dmg + ePlusDmg.dmg * 2,
      avg: eDmg.avg + ePlusDmg.avg * 2
    }
  }
}]

export const mainAttr = 'atk,cpct,cdmg'
export const defDmgIdx = 4

export const buffs = [{
  title: '天赋-游刃若水：敌方弱点被击破后，素裳速度提高[speedPct]%',
  data: {
    speedPct: ({ talent }) => talent.t['速度提高'] * 100
  }
}, {
  title: '行迹-逐寇：10层Buff提升【剑势】造成的伤害[_dmg]%',
  tree: 1,
  data: {
    _dmg: 20
  }
}, {
  title: '素裳4命：击破特攻提高[stance]%',
  cons: 4,
  data: {
    stance: 40
  }
}, {
  title: '素裳6命：天赋的加速效果额外提高[speedPct]%',
  cons: 6,
  data: {
    speedPct: ({ talent }) => talent.t['速度提高'] * 100
  }
}]

export const createdBy = 'Aluxes'
