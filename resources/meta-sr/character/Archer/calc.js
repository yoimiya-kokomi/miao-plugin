export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '【回路连接】5次战技伤害',
  dmg: ({ talent }, dmg) => {
    let ret1 = dmg(talent.e['技能伤害'], 'e')
    let ret2 = dmg(talent.e['技能伤害'], 'e', false, 0, 'talent', { dynamicDmg: talent.e['战技伤害提高'] * 100 })
    let ret3 = dmg(talent.e['技能伤害'], 'e', false, 0, 'talent', { dynamicDmg: talent.e['战技伤害提高'] * 100 })
    return {
      dmg: ret1.dmg + ret2.dmg + ret3.dmg * 3,
      avg: ret1.avg + ret2.avg + ret3.avg * 3,
    }
  }
}, {
  title: '终结技伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}, {
  title: '天赋追加攻击伤害',
  dmg: ({ talent }, dmg) => dmg(talent.t['技能伤害'], 't')
}]

export const defDmgIdx = 2
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '行迹-守护者：暴击伤害提高[cdmg]%',
  tree: 2,
  data: {
    cdmg: 60
  }
}, {
  title: 'Archer 2魂：施放终结技时，使敌方目标的量子属性的抗性降低[kx]%',
  cons: 2,
  data: {
    kx: 20
  }
}, {
  title: 'Archer 4魂：造成的终结技伤害提高[qDmg]%',
  cons: 4,
  data: {
    qDmg: 150
  }
}, {
  check: ({ params }) => params.cons6 === true,
  title: 'Archer 6魂：战技伤害无视20%的防御力',
  cons: 6,
  data: {
    ignore: 20
  }
}]

export const createdBy = '冰翼'
