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
  title: '强化战技伤害（遐蝶）',
  params: { cons1: true },
  dmg: ({ talent, cons, calc, attr }, { basic }) => basic(calc(attr.hp) * talent.e2['遐蝶伤害'], 'e')
}, {
  title: '强化战技伤害（死龙）',
  params: { cons1: true },
  dmg: ({ talent, cons, calc, attr }, { basic }) => basic(calc(attr.hp) * talent.e2['死龙伤害'], 'e')
}, {
  title: '忆灵天赋单次伤害',
  params: { cons1: true },
  dmg: ({ talent, calc, attr }, { basic }) => basic(calc(attr.hp) * talent.mt2['技能伤害'], 'mt')
}, {
  title: '忆灵技（爪痕）伤害',
  params: { cons1: true },
  dmg: ({ talent, calc, attr }, { basic }) => basic(calc(attr.hp) * talent.me['技能伤害'], 'me')
}, {
  title: '三次死龙焰息+死龙晦翼总伤害',
  params: { cons1: true },
  dmg: ({ talent, cons, attr, calc }, { basic }) => {
    let cost = cons > 1 ? 4 : 2
    let meDmg1 = basic(calc(attr.hp) * talent.me2["技能伤害"], "me", false, { dynamicDmg: 30 })
    let meDmg2 = basic(calc(attr.hp) * talent.me2["二次释放伤害"], "me", false, { dynamicDmg: 60 })
    let meDmg3 = basic(calc(attr.hp) * talent.me2["三次释放伤害"], "me", false, { dynamicDmg: 90 })
    for (let i = 1; i < cost; i++) {
      let dmg = basic(calc(attr.hp) * talent.me2["三次释放伤害"], "me", false, { dynamicDmg: 90 + 30 * i })
      meDmg3.dmg += dmg.dmg
      meDmg3.avg += dmg.avg
    }
    let meDmg4 = basic(calc(attr.hp) * talent.me2["灼掠幽墟的晦翼伤害"] * (cons === 6 ? 9 : 6), "mt", false, { dynamicDmg: 60 + 30 * cost })
    return {
      dmg: meDmg1.dmg + meDmg2.dmg + meDmg3.dmg + meDmg4.dmg,
      avg: meDmg1.avg + meDmg2.avg + meDmg3.avg + meDmg4.avg
    }
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
  title: '忆灵天赋-震彻寂壤的怒啸：死龙被召唤时，我方全体造成的伤害提高[dmg]%',
  data: {
    dmg: 10
  }
}, {
  check: ({ params }) => params.cons1 === true,
  title: '遐蝶1魂：敌方目标当前生命值小于等于自身生命上限50%时，强化战技对其造成的伤害为原伤害的140%',
  cons: 1,
  data: {
    multi: 40
  }
}, {
  title: '遐蝶6魂：遐蝶与死龙造成伤害时，量子属性抗性穿透提高[kx]%',
  cons: 6,
  data: {
    kx: 20
  }
}]

export const createdBy = '冰翼 & 其实雨很好'
