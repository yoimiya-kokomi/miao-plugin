import { Format } from '#miao'

export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '赐福提高攻击力上限',
  dmg: ({ attr, calc, talent }) => {
    return {
      avg: calc(attr.atk) * talent.e['攻击力上限']
    }
  }
}, {
  title: '终结技伤害提高',
  dmg: ({ talent }) => {
    return {
      avg: Format.percent(talent.q['伤害提高']),
      type: 'text'
    }
  }
}]

export const defDmgIdx = 1
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '行迹-止厄：普攻造成的伤害提高40%',
  tree: 2,
  data: {
    aDmg: 40
  }
}]
