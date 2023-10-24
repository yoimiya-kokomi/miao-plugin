export const details = [{
    title: '半血开E重击',
    params: { team: false },
    dmg: ({ talent }, dmg) => dmg(talent.a['重击伤害'], 'a2')
  }, {
    title: '半血开E重击蒸发',
    params: { team: false },
    dmg: ({ talent }, dmg) => dmg(talent.a['重击伤害'], 'a2', 'vaporize')
  }, {
    title: '胡桃双水半血重击蒸发',
    params: { team: true},
    dmg: ({ talent }, dmg) => dmg(talent.a['重击伤害'], 'a2', 'vaporize')
  }, {
    title: '半血开E后Q蒸发',
    params: { team: false },
    dmg: ({ talent }, dmg) => dmg(talent.q['低血量时技能伤害'], 'q', 'vaporize')
  }, {
    title: '胡桃双水半血Q蒸发',
    params: { team: true},
    dmg: ({ talent }, dmg) => dmg(talent.q['低血量时技能伤害'], 'q', 'vaporize')
  }]
  
  export const defDmgIdx = 2
  export const mainAttr = 'hp,atk,cpct,cdmg,mastery'
  
  export const defParams = {
    team: true
  }
  
  export const buffs = [{
    check: ({ params }) => params.team === true,
    title: '双水共鸣：获得[hpPct]%生命值',
    data: {
      hpPct: 25
    }
  },{
    title: '蝶引来生：开E获得[atkPlus]点攻击力加成',
    sort: 9,
    data: {
      atkPlus: ({ talent, attr, calc }) => {
        return Math.min(talent.e['攻击力提高'] * calc(attr.hp) / 100, attr.atk.base * 4)
      }
    }
  }, {
    title: '胡桃被动：半血获得33%火伤加成',
    data: {
      dmg: 33
    }
  },{
    check: ({ params }) => params.team === true,
    title: '夜兰：获得平均[dmg]%增伤',
    data: {
      dmg: 35
    }
  },{
    check: ({ params }) => params.team === true,
    title: '钟离：降低敌人[kx]%全抗',
    data: {
      kx: 20
    }
  },'vaporize']
  