export const details = [{
  title: '战技伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: '终结技伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}, {
  title: '追加攻击伤害',
  dmgKey: 't',
  dmg: ({ talent, cons }, dmg) => {
    return cons < 6 ? dmg(talent.t['追加攻击伤害'], 't') : dmg(talent.t['追加攻击伤害'] + 0.25, 't')
  }
}, {
  title: '伸天卑飞，折翅为芒附加伤害',
  dmg: ({ talent }, dmg) => dmg(talent.t['附加伤害'], '')
}]

export const defDmgKey = 't'
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '胁翼匿迹：貊泽在隐身状态下攻击敌人进入战斗时伤害提高[dmg]%',
  data: {
    dmg: 30
  }
}, {
  title: '不折镆干：施放终结技造成伤害时，被视为发动了追加攻击。【猎物】受到的追加攻击伤害提高[tDmg]%',
  data: {
    tDmg: 25
  }
}, {
  title: '2魂：我方全体目标对成为【猎物】的敌方目标造成伤害时，暴击伤害提高[cdmg]%',
  cons: 2,
  data: {
    cdmg: 40
  }
}, {
  title: '4魂：施放终结技时，貊泽造成的伤害提高[dmg]%',
  cons: 4,
  data: {
    dmg: 30
  }
}, {
  title: '6魂：天赋的追加攻击的伤害倍率提高25%',
  cons: 6
}]

export const createdBy = '羊咩别闹！'
