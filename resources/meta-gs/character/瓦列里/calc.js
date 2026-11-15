export const details = [
  {
    title: '特殊重击 臼炮直射·抵近轰击',
    params: { cons_6: true },
    dmg: ({ talent }, dmg) => dmg(talent.a['臼炮直射·抵近轰击伤害'], 'a2')
  },
  {
    title: 'E护盾量',
    dmg: ({ attr, calc, talent }, { shield }) => shield(calc(attr.atk) * talent.e['护盾吸收量2'][0] / 100 + talent.e['护盾吸收量2'][1])
  },
  {
    title: '雷元素伤害增加',
    dmg: ({ attr, calc, talent }) => {
      return {
        avg: talent.a["雷元素伤害增加"] * calc(attr.atk) / 100
      }
    }
  },
  {
    title: '星超导反应伤害增加',
    dmg: ({ attr, calc, talent }) => {
      return {
        avg: talent.a["星超导反应伤害增加"] * calc(attr.atk) / 100
      }
    }
  }
]

export const defDmgIdx = 1
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [
  {
    cons: 6,
    check: ({ params }) => params.cons_6 === true,
    title: '瓦列里6命：特殊重击 臼炮直射·抵近轰击造成的伤害提升[dmg]%',
    data: {
      dmg: 100
    }
  }
]

export const createdBy = '冰翼'
