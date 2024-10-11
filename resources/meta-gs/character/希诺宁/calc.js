export const details = [{
  title: '刃轮巡猎一段伤害',
  dmg: ({ talent, calc, attr }, { basic }) => basic(calc(attr.def) * talent.a['刃轮巡猎一段伤害'] / 100, 'a,nightsoul')
},{
  title: '刃轮巡猎二段伤害',
  dmg: ({ talent, calc, attr }, { basic }) => basic(calc(attr.def) * talent.a['刃轮巡猎二段伤害'] / 100, 'a,nightsoul')
},{
  title: '刃轮巡猎三段伤害',
  dmg: ({ talent, calc, attr }, { basic }) => basic(calc(attr.def) * talent.a['刃轮巡猎三段伤害'] / 100, 'a,nightsoul')
},{
  title: '刃轮巡猎四段伤害',
  dmg: ({ talent, calc, attr }, { basic }) => basic(calc(attr.def) * talent.a['刃轮巡猎四段伤害'] / 100, 'a,nightsoul')
},{
  title: 'E突进伤害',
  dmg: ({ talent, calc, attr }, { basic }) => basic(calc(attr.def) * talent.e['突进伤害'] / 100, 'e,nightsoul')
},{
  // 同倍率不讲究
  title: 'Q释放/追加节拍伤害',
  dmg: ({ talent, calc, attr }, { basic }) => basic(calc(attr.def) * talent.q['技能伤害'] / 100, 'q,nightsoul')
},{
  title: 'Q单次治疗量',
  dmgKey: 'QZ',
  dmg: ({ talent, calc, attr }, { heal }) => heal(talent.q['持续治疗量2'][0] * calc(attr.def) / 100 + talent.q['持续治疗量2'][1] * 1)
}]

export const defParams = { Nightsoul: true }
export const defDmgKey = 'QZ'
export const mainAttr = 'def,cpct,cdmg,heal'

export const buffs = [{
  title: '源音采样：元素抗性降低[kx]%',
  data: {
    kx: ({ talent }) => talent.e['元素抗性降低']
  }
},{
  title: '四境四象回声：普通攻击与下落攻击,造成的伤害提升[aDmg]%。',
  data: {
    aDmg: 30,
    a3Dmg: 30
  }
},{
/** 单人不生效
  title: '便携铠装护层：附近的角色触发「夜魂迸发」时，希诺宁的防御力提升[defPct]%。',
  data: {
    defPct: 20
  }
},{*/
  title: '2命：岩元素采样，造成的伤害提升[dmg]%',
  cons: 2,
  data: {
    dmg: 50
  }
},{
  title: '4命：普通攻击、重击与下落攻击造成的伤害提升[aPlus]点',
  cons: 4,
  data: {
    aPlus: ({ attr, calc }) => calc(attr.def) * 0.65,
    a2Plus: ({ attr, calc }) => calc(attr.def) * 0.65,
    a3Plus: ({ attr, calc }) => calc(attr.def) * 0.65
  }
},{
  title: '6命：普通攻击与下落攻击造成的伤害提升[aPlus]点',
  cons: 6,
  data: {
    aPlus: ({ attr, calc }) => calc(attr.def) * 3,
    a3Plus: ({ attr, calc }) => calc(attr.def) * 3
  }
}]

export const createdBy = '羊咩别闹！'