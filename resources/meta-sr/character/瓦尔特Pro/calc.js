export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'] * 1.8, 'a')
}, {
  title: '战技伤害',
  dmg: ({ talent }, dmg, cons) => dmg(talent.e['技能伤害'] * 6.2 + (cons > 0 ? talent.q['技能伤害'] * 0.4 : 0), 'e')
}, {
  title: '终结技伤害',
  dmg: ({ talent }, dmg, cons) => dmg(talent.q['技能伤害'] * (cons > 0 ? 1.4 : 1), 'q')
}, {
  title: '天赋附加伤害',
  dmg: ({ talent }, dmg) => dmg(talent.t['附加伤害'], 't')
}]

export const defDmgIdx = 1
export const mainAttr = 'atk,cpct,cdmg,effPct'
export const createdBy = '欧阳青瓜'

export const buffs = [{
  title: '行迹-惩戒：我方目标攻击【失重】状态下的目标时，造成的伤害提高10%，该效果最多叠加10层',
  tree: 1,
  data: {
    dmg: 100
  }
}, {
  title: '行迹-审判：施放普攻造成的附加伤害等同于普攻伤害倍率的80%，施放战技造成的附加伤害等同于战技伤害倍率的120%',
  tree: 2
}, {
  title: '行迹-裁决：效果命中大于40%时，每超过10%，则攻击力提高20%，最多提高80%',
  tree: 3,
  data: {
    atkPct: ({ attr }) => Math.min(Math.ceil(attr.effPct - 40) / 10 * 20, 80)
  }
}, {
  title: '天赋：处于【失重】状态下的敌方目标防御力降低[def]%',
  data: {
    def: 40
  }
}, {
  title: '星魂1：施放战技或终结技击中【失重】状态下的目标后，额外造成1次等同于终结技伤害倍率40%的虚数属性附加伤害',
  cons: 1
}, {
  title: '星魂4：【失重】状态下的敌方目标全属性抗性降低[kx]%',
  cons: 4,
  data: {
    kx: 30
  }
}, {
  title: '星魂6：施放战技或终结技击中减速状态下的敌方目标时，造成伤害的暴击率提高[cpct]%，暴击伤害提高[cdmg]%',
  cons: 6,
  data: {
    cpct: 30,
    cdmg: 60
  }
}]
