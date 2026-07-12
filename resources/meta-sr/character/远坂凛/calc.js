export const details = [{
    title: '普攻',
    dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
  }, {
    title: '战技',
    dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
  }, {
    title: '30宝石能量强化战技',
    dmg: ({ talent }, dmg) => dmg(talent.e2['群攻伤害'] + talent.e2['技能伤害'] * 10, 'e2')
  }, {
    title: '大招对五',
    dmg: ({ talent }, dmg) => dmg(talent.q['单体伤害'] + talent.q['群攻伤害'] * 4, 'q')
  }, {
    title: '凛天赋合击伤害',
    dmg: ({ talent }, dmg) => dmg(talent.t2['技能伤害'], 't2')
  }]
  
  export const defDmgIdx = 3
  export const mainAttr = 'atk,cpct,cdmg,dmg'
  
  export const buffs = [{
    title: '天赋-秉持优雅：量子属性抗性穿透提高[kx]%、攻击力提高[atkPct]%',
    tree: 1,
    data: {
      kx: 20,
      atkPct: 150
    }
  }, {
    title: '终结技使敌方全体受到的伤害提高[enemydmg]%',
    data: {
      enemydmg: 20
    }
  }, {
    title: '我方目标消耗或恢复战技点时，使其暴击伤害提高[cdmg]%',
    data: {
      cdmg: 70
    }
  },{
    title: '远坂凛2魂：远坂凛造成的战技伤害提高[eDmg]%。远坂凛在场时，我方全体造成的战技伤害为原伤害的[eMulti]%',
    cons: 2,
    data: {
      eDmg: 30,
      e2Dmg: 30,
      eMulti: 130
    }
  }, {
    title: '远坂凛4魂：天赋的暴击伤害提高效果对远坂凛生效时，效果可以叠加',
    cons: 4,
    data: {
      cdmg: 70
    }
  }, {
    title: '远坂凛6魂：远坂凛的全属性抗性穿透提高[kx]%',
    cons: 6,
    data: {
      kx: 20
    }
  }]
  
  export const createdBy = '欧阳青瓜'
  