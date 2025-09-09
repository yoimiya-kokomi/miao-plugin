export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '战技伤害·主目标',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: '战技伤害·相邻目标',
  dmg: ({ talent }, dmg) => dmg(talent.e['相邻目标伤害'], 'e')
}, {
  title: '终结技非真实伤害·主目标',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}, {
  title: '终结技非真实伤害·相邻目标',
  dmg: ({ talent }, dmg) => dmg(talent.q['相邻目标伤害'], 'q')
}, {
  title: '天赋追加攻击伤害',
  dmg: ({ talent }, dmg) => dmg(talent.t['技能伤害'], 't')
}, {
  title: '4魂附加伤害',
  cons: 4,
  dmg: ({ talent }, dmg) => dmg(0.5)
}]

export const defDmgIdx = 3
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [ {
  title: '赛飞儿战技：赛飞儿的攻击力提高[atkPct]%。',
  data: {
    atkPct: 30
  }
}, {
  check: ({ attr, calc }) => calc(attr.speed) >= 140,
  title: '行迹-神行宝鞋：赛飞儿的速度大于等于[_speed]时，暴击率提高[cpct]%。',
  sort: 9,
  tree: 1,
  data: {
    _speed: ({ attr, calc }) => calc(attr.speed) >= 170 ? 170 : 140,
    cpct: ({ attr, calc }) => calc(attr.speed) >= 170 ? 50 : 25
  }
}, {
  title: '行迹-偷天换日：天赋的追加攻击造成的暴击伤害提高[tCdmg]%。赛飞儿在场时，敌方全体目标受到的伤害提高[enemydmg]%。',
  tree: 3,
  data: {
    tCdmg: 100,
    enemydmg: 40
  }
}, {
  title: '赛飞儿1魂：施放天赋的追加攻击时，赛飞儿的攻击力提高[atkPct]%。',
  cons: 1,
  data: {
    atkPct: 80
  }
}, {
  title: '赛飞儿2魂：赛飞儿击中敌方目标时，有120%的基础概率使其受到的伤害提高[enemydmg]%。',
  cons: 2,
  data: {
    enemydmg: 30
  }
}, {
  title: '赛飞儿6魂：赛飞儿天赋的追加攻击造成的伤害提高[tDmg]%。',
  cons: 6,
  data: {
    tDmg: 350
  }
}]

export const createdBy = '冰翼'
