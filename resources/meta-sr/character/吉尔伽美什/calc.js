export const details = [{
    title: '普攻',
    dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
  }, {
    title: '战技',
    dmg: ({ talent, cons }, dmg) => dmg(talent.e['单体伤害'] * 2 + (cons > 2 ? 2 : 0), 'e')
  }, {
    title: '大招',
    dmg: ({ talent }, dmg) => dmg(talent.q['群攻伤害'] + talent.q['弹射伤害'] * 10, 'q')
  }, {
    title: '吉尔伽美什天赋合击伤害',
    dmg: ({ talent }, dmg) => dmg(talent.t2['技能伤害'], 't2')
  }]
  
  export const defDmgIdx = 3
  export const mainAttr = 'atk,cpct,cdmg,dmg'
  
  export const buffs = [{
    title: '天赋-英雄的孤傲：自身暴击伤害提高[cdmg]%',
    tree: 2,
    data: {
      cdmg: 150
    }
  }, {
    title: '天赋-王霸的竞逐：我方全体目标攻击力提高[atkPct]%，暴击伤害提高[cdmg]%。',
    tree: 3,
    data: {
      atkPct: ({ attr }) => { return attr.sp > 140 ? attr.sp > 240 ? 120 : attr.sp - 120 : 0},
      cdmg: ({ attr }) => { return attr.sp > 140 ? attr.sp > 240 ? 120 : attr.sp - 120 : 0},
    }
  }, {
    title: '终结技使敌方全体受到的伤害提高[enemydmg]%',
    data: {
      enemydmg: 20
    }
  }, {
    title: '吉尔伽美什造成的终结技伤害提高[qDmg]%',
    data: {
      qDmg: 40
    }
  }, {
    title: '造成伤害时无视目标[ignore]%的防御力',
    data: {
      ignore: 30
    }
  }, {
    title: '吉尔伽美什1魂：使吉尔伽美什攻击力提高[atkPct]%',
    cons: 1,
    data: {
      atkPct: 60
    }
  }, {
    title: '吉尔伽美什2魂：战技伤害倍率提高',
    cons: 2
  }, {
    title: '吉尔伽美什4魂：能量恢复效率提高[recharge]%',
    cons: 4,
    data: {
      recharge: 20
    }
  }, {
    title: '吉尔伽美什6魂：全属性抗性穿透提高[kx]%。3点【黄金律】造成的终结技伤害的暴击伤害提高[qCdmg]%',
    cons: 6,
    data: {
      kx: 20,
      qCdmg: 300
    }
  }]
  
  export const createdBy = '欧阳青瓜'
  