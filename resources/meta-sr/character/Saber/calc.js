export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '强化普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a2['技能伤害'], 'a2')
}, {
  title: '强化普攻伤害·2名敌人',
  dmg: ({ talent }, dmg) => dmg(talent.a2['技能伤害'] + talent.a2['2目标伤害'], 'a2')
}, {
  title: '强化普攻伤害·1名敌人',
  dmg: ({ talent }, dmg) => dmg(talent.a2['技能伤害'] + talent.a2['1目标伤害'], 'a2')
}, {
  title: '战技伤害·主目标（4点炉心）',
  dmg: ({ cons, talent }, dmg) => {
    let num = cons < 2 ? 14 : 21
    return dmg(talent.e['技能伤害'] + num * 4 / 100, 'e')
  }
}, {
  title: '战技伤害·相邻目标（4点炉心）',
  dmg: ({ cons, talent }, dmg) => {
    let num = cons < 2 ? 14 : 21
    return dmg(talent.e['相邻目标伤害'] + num * 4 / 100, 'e')
  }
}, {
  title: '终结技·全体伤害',
  params: { cons_6: true },
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}, {
  title: '终结技·对单总伤害',
  params: { cons_6: true },
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'] + talent.q['随机伤害'] * 10, 'q')
}]

export const defDmgIdx = 6
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: 'Saber天赋：我方任意目标施放终结技时，Saber造成的伤害提高[dmg]%',
  data: {
    dmg: ({ talent }) => talent.t['伤害提高'] * 100,
  }
}, {
  title: '行迹-龙之骑士：Saber的暴击率提高[cpct]%',
  tree: 1,
  data: {
    cpct: 20
  }
}, {
  title: '行迹-星之冠冕：施放战技时，使Saber的暴击伤害提高50%。本场战斗中每获得1点【炉心共鸣】，使Saber的暴击伤害提高4%，该效果最多叠加8层。总计最多提高[cdmg]%',
  tree: 3,
  data: {
    cdmg: 50 + 4 * 8
  }
}, {
  title: 'Saber 1魂：终结技伤害提高[qDmg]%',
  cons: 1,
  data: {
    qDmg: 60
  }
}, {
  title: 'Saber 2魂：本场战斗中每获得1点【炉心共鸣】，使Saber造成的伤害无视目标1%的防御力，该效果最多叠加15层',
  cons: 2,
  data: {
    ignore: 15
  }
}, {
  title: 'Saber 4魂：风属性抗性穿透提高8%。施放终结技后，风属性抗性穿透提高4%，该效果最多叠加3层，总计最多[kx]%',
  cons: 4,
  data: {
    kx: 8 + 4 * 3
  }
}, {
  check: ({ params }) => params.cons_6 === true,
  title: 'Saber 6魂：终结技伤害的风属性抗性穿透提高20%',
  cons: 6,
  data: {
    kx: 20
  }
}]

export const createdBy = '冰翼'
