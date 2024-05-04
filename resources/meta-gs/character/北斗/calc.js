import { Format } from '#miao'

export const details = [{
  title: 'E伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['基础伤害'], 'e')
}, {
  title: '2层E伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['基础伤害'] + talent.e['受击时伤害提升'] * 2, 'e')
}, {
  title: 'Q每跳伤害',
  params: { q: true },
  dmg: ({ talent }, dmg) => dmg(talent.q['闪雷伤害'], 'q')
}, {
  title: 'E弹反护盾量',
  dmg: ({ talent, attr }, { shield }) => shield(talent.e['护盾吸收量2'][0] / 100 * attr.hp + talent.e['护盾吸收量2'][1])
}, {
  title: 'Q护盾量',
  check: ({ cons }) => cons >= 1,
  dmg: ({ attr }, { shield }) => shield(0.16 * attr.hp)
}, {
  title: 'Q伤害减免',
  dmg: ({ talent }) => {
    return {
      avg: Format.percent(talent.q['伤害减免'] / 100),
      type: 'text'
    }
  }
}]

export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '北斗6命：Q持续期间，周围敌人的雷元素抗性降低15%',
  cons: 6,
  data: {
    kx: ({ params }) => params.q ? 15 : 0
  }
}]
