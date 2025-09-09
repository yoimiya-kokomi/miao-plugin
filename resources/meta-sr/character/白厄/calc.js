export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '强化普攻伤害·主目标',
  params: ({ qBuff: true, Khaslana: true }),
  dmg: ({ talent }, dmg) => dmg(talent.a2['技能伤害'], 'a2')
}, {
  title: '强化普攻伤害·相邻目标',
  params: ({ qBuff: true, Khaslana: true }),
  dmg: ({ talent }, dmg) => dmg(talent.a2['相邻目标伤害'], 'a2')
}, {
  title: '战技伤害·主目标',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: '战技伤害·相邻目标',
  dmg: ({ talent }, dmg) => dmg(talent.e['相邻目标伤害'], 'e')
}, {
  title: '4层[弑魂之炽]强化战技【弑魂焚诏】总伤害',
  params: ({ qBuff: true, Khaslana: true }),
  dmg: ({ talent }, dmg) => dmg(talent.e1['技能伤害'] + talent.e1['随机伤害'] * 4 + 0.2 * 4, 'e2')
}, {
  title: '4点[毁伤]强化战技【死星天裁】总伤害',
  params: ({ qBuff: true, Khaslana: true }),
  dmg: ({ talent }, dmg) => dmg(talent.e2['技能伤害'], 'e2')
}, {
  title: '终结技伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}]

export const defDmgIdx = 7
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '白厄天赋：当白厄成为队友的技能目标时，暴击伤害提高[cdmg]%',
  data: {
    cdmg: ({ talent }) => talent.t['暴伤提高'] * 100,
  }
}, {
  check: ({ params }) => params.qBuff === true,
  title: '卡厄斯兰那天赋：变身期间攻击力提高[atkPct]%',
  data: {
    atkPct: ({ talent }) => talent.t2['攻击力提高'] * 100,
  }
}, {
  title: '行迹-身承炎炬万千：造成的伤害提高[dmg]%',
  tree: 2,
  data: {
    dmg: 45
  }
}, {
  title: '行迹-照见英雄本色：进入战斗或变身结束时，攻击力提高[atkPct]%',
  tree: 3,
  data: {
    atkPct: 50 * 2
  }
}, {
  title: '白厄 1魂：施放终结技时，暴击伤害提高[cdmg]%',
  cons: 1,
  data: {
    cdmg: 50
  }
}, {
  check: ({ params }) => params.Khaslana === true,
  title: '白厄 2魂：卡厄斯兰那的物理属性抗性穿透提高[kx]%',
  cons: 2,
  data: {
    kx: 20
  }
}]

export const createdBy = '冰翼'
