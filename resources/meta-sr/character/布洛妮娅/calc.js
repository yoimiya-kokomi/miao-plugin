import { Format } from '#miao'

export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '战技Buff加伤',
  dmg: ({ talent }) => {
    return {
      avg: Format.percent(talent.e['伤害提高']),
      type: 'text'
    }
  }
}, {
  title: '终结技Buff攻击力提高',
  dmg: ({ talent }) => {
    return {
      avg: Format.percent(talent.q['攻击力提高']),
      type: 'text'
    }
  }
}, {
  title: '终结技Buff爆伤提高',
  dmg: ({ attr, calc, talent }) => {
    return {
      avg: Format.percent(calc(attr.cdmg) * talent.q['百分比暴伤'] / 100 + talent.q['固定暴伤']),
      type: 'text'
    }
  }
}]

export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '行迹-军势：布洛妮娅在场时，我方全体造成的伤害提高10%',
  tree: 3,
  data: {
    dmg: 10
  }
}, {
  title: '行迹-号令：普攻的暴击率提高至[aCpct]%',
  tree: 1,
  data: {
    aCpct: 100
  }
}]
