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
  title: '10层神君单体伤害',
  dmg: ({ talent }, dmg) => dmg(talent.t['技能伤害'] * 10, 'a3')
}]

export const defDmgIdx = 3
export const mainAttr = 'atk,cpct,cdmg,speed'

export const buffs = [{
  title: '景元2命：神君行动后，普攻战技及终结技的伤害提高20%',
  cons: 2,
  data: {
    aDmg: 20,
    eDmg: 20,
    qDmg: 20
  }
}, {
  title: '景元6命：神君会使目标陷入易伤状态，使伤害提高12%，最多3层',
  cons: 6,
  data: {
    a3Dmg: (12 + 12 * 2 + 12 * 3 * 7) / 10
  }
}, {
  title: '行迹-破阵：攻击段数大于等于6段，则其下回合的暴击伤害提高25%',
  tree: 1,
  data: {
    a3Cdmg: 25
  }
}, {
  title: '行迹-遣将：施放战技后，暴击率提升10%',
  tree: 3,
  data: {
    cpct: 10
  }
}]
