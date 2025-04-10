export const details = [{
  title: '天赋反击伤害·主目标',
  dmg: ({ talent }, dmg) => dmg(talent.t['反击·目标伤害'], 't')
}, {
  title: '天赋反击伤害·相邻目标',
  dmg: ({ talent }, dmg) => dmg(talent.t['反击·相邻目标伤害'], 't')
}, {
  title: '【勘破•灭】伤害·主目标',
  dmg: ({ talent }, dmg) => dmg(talent.q['反击·目标伤害'], 'q')
}, {
  title: '【勘破•灭】伤害·相邻目标',
  dmg: ({ talent }, dmg) => dmg(talent.q['反击·相邻目标伤害'], 'q')
}, {
  title: '【勘破•灭】伤害·随机单次',
  dmg: ({ talent }, dmg) => dmg(talent.q['勘破灭·随机伤害'], 'q')
}]

export const mainAttr = 'atk,cpct,cdmg'
export const defDmgIdx = 2

export const buffs = [{
  title: '云璃额外能力：施放反击时，云璃的攻击力提高[atkPct]%',
  tree: 3,
  data: {
    atkPct: 30
  }
}, {
  title: '云璃终结技：下一次反击造成的暴击伤害提高[cdmg]%',
  data: {
    cdmg: ({ talent }) => talent.q['暴击伤害提高'] * 100
  }
}, {
  title: '云璃1魂：【勘破•斩】与【勘破•灭】造成的伤害提高[qDmg]%',
  cons: 1,
  data: {
    qDmg: 20
  }
}, {
  title: '云璃2魂：发动反击造成伤害时无视敌方目标[ignore]%的防御力',
  cons: 2,
  data: {
    ignore: 20
  }
}, {
  title: '云璃6魂：发动【勘破•斩】或【勘破•灭】造成伤害时暴击率提高[qCpct]%，物理属性抗性穿透提高[kx]%',
  cons: 6,
  data: {
    qCpct: 15,
    kx: 20
  }
}]

export const createdBy = '冰翼'
