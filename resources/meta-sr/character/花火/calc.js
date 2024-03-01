import { Format } from '#miao'

export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '战技提高暴击伤害',
  dmg: ({ talent, attr, cons }) => {
    let extraCdmg = cons >= 6 ? 0.3 * attr.cdmg / 100 : 0
    return {
      avg: Format.percent(talent.e['百分比爆伤'] * attr.cdmg / 100 + talent.e['额外爆伤'] + extraCdmg),
      type: 'text'
    }
  }
}, {
  title: '天赋满层Buff无视目标防御力',
  check: ({ cons }) => cons >= 2,
  dmg: ({ talent }) => {
    return {
      avg: Format.percent(0.24),
      type: 'text'
    }
  }
}, {
  title: '终结技满层Buff提高伤害',
  dmg: ({ talent }) => {
    let dmgNum = (talent.q['天赋增伤每层额外提高'] + talent.t['伤害提高']) * 3
    return {
      avg: Format.percent(dmgNum),
      type: 'text'
    }
  }
}]

export const defDmgIdx = 1
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '行迹-夜想曲：攻击力提高[atkPct]%',
  data: {
    atkPct: 20
  }
}, {
  title: '花火6命：战技的暴击伤害提高效果额外提高[_cdmg]%',
  sort: 9,
  cons: 6,
  data: {
    _cdmg: ({ attr }) => attr.cdmg * 0.3
  }
}]

export const createdBy = 'Aluxes'