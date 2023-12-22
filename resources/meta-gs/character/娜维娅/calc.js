export const details = [{
  title: 'E后普通攻击一段',
  dmg: ({ talent }, dmg) => dmg(talent.a['一段伤害'], 'a')
},{
  title: '0消耗典仪式晶火',
  dmg: ({ talent }, dmg) => dmg(talent.e['玫瑰晶弹基础伤害'], 'e')
},{
  title: '3消耗典仪式晶火',
  params: { jp: 3 },
  dmg: ({ talent }, dmg) => dmg(talent.e['玫瑰晶弹基础伤害'] * 2 , 'e')
},{
  title: '6消耗典仪式晶火',
  params: { jp: 6 },
  dmg: ({ talent }, dmg) => dmg(talent.e['玫瑰晶弹基础伤害'] * 2 , 'e')
},{
  title: '如霰澄天的鸣礼伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
},{
  title: '支援炮击伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['支援炮击伤害'], 'q')
}]

export const defDmgIdx = 3
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  check: ({ params }) => params.jp > 3 ,
  title: '典仪式晶火：消耗[_count]枚弹片将使本次射击造成的伤害额外提升[eDmg]%',
  data: {
    _count: ({ params }) => params.jp ,
    eDmg: ({ params }) => ( params.jp - 3 ) * 15
  }
},{
  title: '娜维娅天赋：施放典仪式晶火后娜维娅的普攻,重击，下落攻击造成的伤害提升[aDmg]%',
  data: {
    aDmg: 40,
    a2Dmg: 40,
    a3Dmg: 40
  }
},{
  title: '娜维娅天赋：队伍中存在三位火雷冰水元素角色,攻击力提升[atkPct]%',
  data: {
    atkPct: 40
  }
},{
  check: ({ params }) => params.jp !== undefined ,
  title: '娜维娅2命：施放典仪式晶火时消耗「裂晶弹片」使本次典仪式晶火的暴击率提升[eCpct]%',
  cons: 2,
  data: {
    eCpct :  ({ params }) => Math.min( 36 , params.jp * 12 )
  }
},{
  title: '娜维娅4命：被如霰澄天的鸣礼命中的敌人抗性降低[kx]%',
  cons: 4,
  data: {
    kx: 20
  }
},{
  check: ({ params }) => params.jp > 3 ,
  title: '娜维娅6命：消耗[_count]枚弹片,使典仪式晶火的暴击伤害提升[eCdmg]%',
  cons: 6,
  data: {
    _count: ({ params }) => params.jp ,
    eCdmg :  ({ params }) => Math.min( 135 , ( params.jp - 3 ) * 45 )
  }
}]

export const createdBy = 'liangshi'