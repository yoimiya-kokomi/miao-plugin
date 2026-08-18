export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '战技伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: '战技欢愉伤害',
  params: { punchline: 30 },
  dmg: ({ talent }, dmg) => dmg(talent.t['战技额外伤害'], 't', 'elation')
}, {
  title: '大招伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}, {
  title: '大招欢愉伤害',
  params: { punchline: 30 },
  dmg: ({ talent }, dmg) => dmg(talent.t['终结技额外伤害'], 't', 'elation')
}, {
  title: '天赋欢愉技伤害',
  params: { punchline: 20 },
  dmg: ({ talent }, dmg) => dmg(talent.xe['技能伤害'] + talent.xe['额外伤害'] * 10, 'xe', 'elation')
}, {
  title: '阿哈时刻伤害',
  params: { punchline: 40 },
  // 热意按上限计算：2命前30点，2命后（含2命）50点
  dmg: ({ talent, cons }, dmg) => dmg(talent.xe2['技能伤害'] + talent.xe2['额外伤害'] * 10 + talent.xe2['每点【热意】提升伤害'] * (cons >= 2 ? 50 : 30), 'xe2', 'elation')
}]

export const defDmgIdx = 5
export const mainAttr = 'hp,cpct,cdmg'

export const buffs = [{
  title: '行迹-极乐派对：速度大于等于140时，使自身欢愉度提高30%，之后每超过1点速度使自身欢愉度额外提高1%，最多计入200点超出的速度',
  tree: 1,
  data: {
    joy: ({ attr }) => attr.speed >= 140 ? 30 + Math.min(attr.speed - 140, 200) : 0
  }
}, {
  title: '行迹-纵享惊涛：队伍中存在1名其他「欢愉」命途角色时，我方全体欢愉度提高20%，砂金•戏浪额外提高80%',
  tree: 2,
  data: {
    joy: 100
  }
}, {
  title: '行迹-旧梦淘金：暴击伤害提高48%，队友施放普攻、战技、追加攻击或终结技后，我方全体暴击伤害额外提高48%',
  tree: 3,
  data: {
    cdmg: 96
  }
}, {
  title: '笑点计算：计算笑点用',
  data: {
    punchline: ({ params }) => params.punchline
  }
}, {
  title: '砂金•戏浪1魂：全属性抗性穿透提高[kx]%',
  cons: 1,
  data: {
    kx: 24
  }
}, {
  title: '砂金•戏浪4魂：施放战技时，我方全体造成的伤害无视敌方目标[ignore]%的防御力',
  cons: 4,
  data: {
    ignore: 18
  }
}, {
  title: '砂金•戏浪6魂：砂金•戏浪造成的欢愉伤害增笑[merrymakes]%',
  cons: 6,
  data: {
    merrymakes: 25
  }
}]
