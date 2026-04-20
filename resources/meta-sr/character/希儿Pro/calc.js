export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '战技伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: '终结技伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}, {
  check: ({ cons }) => cons === 6,
  title: '6命乱蝶真实伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'] * 0.3, 'q')
}]

export const defDmgIdx = 2
export const mainAttr = 'atk,cpct,cdmg,speed'
export const createdBy = '欧阳青瓜'

export const buffs = [{
  title: '希儿天赋：击杀敌人增幅状态提高伤害[dmg]%',
  data: {
    dmg: ({ talent }) => talent.t['伤害提高'] * 100
  }
}, {
  title: '希儿战技：释放战技后，速度提高25%',
  maxCons: 1,
  data: {
    speedPct: 25
  }
}, {
  title: '行迹-夜行：消灭敌方目标时，使自身造成的伤害提高50%，该效果最多叠加3层',
  tree: 1,
  data: {
    dmg: 50 * 3
  }
}, {
  title: '行迹-割裂：抗性穿透提高[kx]%',
  tree: 2,
  data: {
    kx: 25
  }
}, {
  title: '希儿1命：对生命小于80%的敌人造成伤害时，暴击率提高15%',
  cons: 1,
  data: {
    cpct: 15
  }
}, {
  title: '希儿2命：释放战技后，2层Buff速度提高50%',
  cons: 2,
  data: {
    speedPct: 25
  }
}]
