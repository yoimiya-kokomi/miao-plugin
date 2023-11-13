import { Format } from '#miao'

export const details = [{
  title: '普攻伤害',
  dmg: ({ talent, attr, calc }, { basic }) => {
    const hp = calc(attr.hp)
    return basic(talent.a['技能伤害'] * hp, 'a')
  }
}, {
  title: '战技提高生命上限值',
  dmg: ({ talent, attr, calc }) => {
    return {
      avg: calc(attr.hp) * talent.e['生命上限提高']
    }
  }
}, {
  title: '战技提高暴击率',
  dmg: ({ talent }) => {
    return {
      avg: Format.percent(talent.e['暴击率提高']),
      type: 'text'
    }
  }
}, {
  title: '终结技伤害',
  dmg: ({ talent, attr, calc }, { basic }) => {
    const hp = calc(attr.hp)
    return basic(talent.q['技能伤害'] * hp, 'q')
  }
}, {
  title: '终结技生命回复量',
  tree: 2,
  dmg: ({ attr, calc }, { heal }) => heal(calc(attr.hp) * 0.05 + 133)
}]

export const mainAttr = 'cpct,cdmg,hp'
export const defDmgIdx = 4

export const buffs = [{
  title: '战技Buff：生命上限提高[hpPlus]，暴击率提高[cpct]%',
  sort: 0,
  data: {
    hpPlus: ({ talent, attr, calc }) => calc(attr.hp) * talent.e['生命上限提高'],
    cpct: ({ talent }) => talent.e['暴击率提高'] * 100
  }
}, {
  title: '符玄1命：暴击伤害提高[cdmg]%',
  cons: 1,
  data: {
    cdmg: 30
  }
}, {
  title: '符玄6命：终结技伤害提高[qPlus]',
  cons: 6,
  data: {
    qPlus: ({ attr, calc }) => calc(attr.hp) * 1.2
  }
}]

export const createdBy = 'Aluxes'
