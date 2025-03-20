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
  title: '战技【弑神登神】伤害·主目标',
  dmg: ({ talent, calc, attr, cons }, { basic }) => {
    let num = cons > 0 ? 30 / 100 : 0
    let primaryDmg = basic(calc(attr.hp) * (talent.e2['技能伤害'] + num), 'e')
    return {
      dmg: primaryDmg.dmg,
      avg: primaryDmg.avg
    }
  }
}, {
  check: ({ cons }) => cons < 1,
  title: '战技【弑神登神】伤害·相邻目标',
  dmg: ({ talent, calc, attr }, { basic }) => basic(calc(attr.hp) * talent.e2['相邻目标伤害'], 'e')
}, {
  title: '终结技伤害',
  dmg: ({ talent, calc, attr }, { basic }) => basic(calc(attr.hp) * talent.q['技能伤害'], 'q')
}]

export const defDmgIdx = 3
export const mainAttr = 'hp,cpct,cdmg'

export const buffs = [{
  title: '万敌天赋：【血仇】状态下生命上限提高，数值等同于当前生命上限的50%',
  sort: 2,
  data: {
    hpPlus: ({ calc, attr }) => calc(attr.hp) * 50 / 100
  }
}, {
  title: '万敌额外能力：若万敌的生命上限高于4000点，每超过100点生命值可使自身暴击率提高1.2%',
  tree: 3,
  data: {
    cpct: ({ calc, attr }) => {
      let num = Math.min(Math.floor(calc(attr.hp) - 4000) / 100, 40)
      if (num > 0) {
        return num * 1.2
      } else {
        return 0
      }
    }
  }
}, {
  title: '万敌2魂：【血仇】状态期间，万敌造成的伤害无视敌方目标[ignore]%的防御力',
  cons: 2,
  data: {
    ignore: 15
  }
}, {
  title: '万敌4魂：【血仇】状态期间暴击伤害提高[cdmg]%',
  cons: 4,
  data: {
    cdmg: 30
  }
}]

export const createdBy = '冰翼'
