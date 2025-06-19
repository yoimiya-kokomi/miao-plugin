export const details = [{
  title: '6命夜魂加持普通攻击·一段伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['一段伤害'], 'a,nightsoul')
}, {
  title: '6命夜魂加持普通攻击·五段伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['五段伤害'], 'a,nightsoul')
}, {
  title: '（荧）6命夜魂加持重击伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['重击伤害'], 'a2,nightsoul')
}, {
  title: '6命夜魂加持高空下落伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['低空/高空坠地冲击伤害'][1], 'a3,nightsoul')
}, {
  title: 'E点按每跳伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['焰烈之槛伤害'], 'e,nightsoul')
}, {
  title: 'E长按伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['长按伤害'], 'e,nightsoul')
}, {
  title: 'E长按每跳伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['灼火之槛伤害'], 'e,nightsoul')
}, {
  title: 'Q技能伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q,nightsoul')
}]

export const defParams = { Nightsoul: true }
export const defDmgIdx = 6
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '火主1命：焰烈之槛或灼火之槛存在期间，且旅行者处于夜魂加持状态下时，造成的伤害提升[dmg]%',
  cons: 1,
  data: {
    dmg: 6 + 9
  }
}, {
  title: '火主4命：施放元素爆发后，获得[dmg]%火元素伤害加成',
  cons: 4,
  data: {
    dmg: 20
  }
}, {
  title: '火主6命：处于夜魂加持状态下时，普通攻击、重击与下落攻击伤害转为火附魔，且暴击伤害提升[aCdmg]%',
  cons: 6,
  data: {
    aCdmg: 40,
    a2Cdmg: 40,
    a3Cdmg: 40
  }
}]

export const createdBy = '冰翼'
