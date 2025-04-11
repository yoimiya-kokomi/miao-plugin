export const details = [{
  title: '普攻伤害',
  dmg: ({ talent, calc, attr }, { basic }) => basic(calc(attr.hp) * talent.a['技能伤害'], 'a')
}, {
  title: '战技伤害·主目标',
  dmg: ({ talent, calc, attr }, { basic }) => basic(calc(attr.hp) * talent.e['技能伤害'], 'e')
}, {
  title: '战技伤害·相邻目标',
  dmg: ({ talent, calc, attr }, { basic }) => basic(calc(attr.hp) * talent.e['相邻目标伤害'], 'e')
}, {
  title: '强化战技伤害(遐蝶)',
  dmg: ({ talent, cons,  calc, attr }, { basic }) => {
    let num = cons > 0 ? 1.4 : 1
    return basic(calc(attr.hp) * talent.e2['遐蝶伤害'] * num, 'e')
  }
}, {
  title: '强化战技伤害(死龙)',
  dmg: ({ talent, cons,  calc, attr }, { basic }) => {
    let num = cons > 0 ? 1.4 : 1
    return basic(calc(attr.hp) * talent.e2['死龙伤害'] * num, 'e')
  }
}]

export const defDmgIdx = 3
export const mainAttr = 'hp,cpct,cdmg'

export const buffs = [{
  title: '遐蝶天赋：我方损失生命值时，遐蝶与死龙造成的伤害最多提高[dmg]%',
  data: {
    dmg: ({ talent }) => talent.t['伤害提高'] * 100 * 3
  }
}, {
  title: '遐蝶终结技：展开境界【遗世冥域】，使敌方全体全属性抗性降低[kx]%',
  data: {
    kx: ({ talent }) => talent.q['抗性降低'] * 100
  }
}, {
  title: '遐蝶1魂：敌方目标当前生命值小于等于自身生命上限50%时，强化战技对其造成的伤害为原伤害的140%',
  cons: 1
}, {
  title: '遐蝶6魂：遐蝶与死龙造成伤害时，量子属性抗性穿透提高[kx]%',
  cons: 6,
  data: {
    kx: 20
  }
}]

export const createdBy = '冰翼'
