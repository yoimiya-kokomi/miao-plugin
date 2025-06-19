import { Format } from '#miao'

export const details = [{
  title: '战技提高目标伤害（无召唤物）',
  dmg: ({ talent, attr, cons }) => {
    return {
      avg: Format.percent(talent.e['造成的伤害提高']),
      type: 'text'
    }
  }
}, {
  title: '战技提高目标伤害（有召唤物）',
  dmg: ({ talent, attr, cons }) => {
    return {
      avg: Format.percent(talent.e['造成的伤害提高'] * (1 + talent.e['增伤额外提高'])),
      type: 'text'
    }
  }
}, {
  title: '战技提高目标暴击率',
  dmg: ({ talent, attr, cons }) => {
    return {
      avg: Format.percent(talent.t['暴击率提高'] * (cons >= 6 ? 3 : 1)),
      type: 'text'
    }
  }
}, {
  title: '终结技提高暴击伤害',
  dmg: ({ talent, attr, cons }) => {
    return {
      avg: Format.percent(talent.q['爆伤提高·百分比'] * attr.cdmg / 100 + talent.q['爆伤提高·固定值']),
      type: 'text'
    }
  }
}]

export const defDmgIdx = 3
export const mainAttr = 'atk,cpct,cdmg'

export const createdBy = '五里徘徊'