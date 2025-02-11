export const details = [{
  title: 'E释放伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['黑曜星魔伤害'], 'e,nightsoul')
}, {
  title: 'E风暴伤害',
  params: { windstorm: true },
  dmg: ({ talent }, dmg) => dmg(talent.e['霜陨风暴伤害'], 'e,nightsoul')
}, {
  title: 'E护盾吸收量',
  dmg: ({ talent, calc, attr }, { shield }) => shield(talent.e['护盾吸收量2'][0] * calc(attr.mastery) / 100 + talent.e['护盾吸收量2'][1] * 1)
}, {
  title: 'Q释放伤害',
  params: { windstorm: true },
  dmg: ({ talent }, dmg) => dmg(talent.q['冰风暴伤害'], 'q,nightsoul')
}, {
  title: 'Q释放融化伤害',
  params: { windstorm: true },
  dmg: ({ talent }, dmg) => dmg(talent.q['冰风暴伤害'], 'q,nightsoul', 'melt')
}, {
  title: '双火班希Q融化伤害',
  params: { windstorm: true, team: true },
  dmg: ({ talent }, dmg) => dmg(talent.q['冰风暴伤害'], 'q,nightsoul', 'melt')
}, {
  check: ({ cons }) => cons >= 1,
  title: '「星刃」基础伤害提升值',
  dmg: ({ calc, attr }) => {
    return {
      avg: calc(attr.mastery) * 200 / 100
    }
  }
}]

export const defParams = { Nightsoul: true }
export const defDmgIdx = 2
export const mainAttr = 'atk,cpct,cdmg,mastery'

export const buffs = [{
  check: ({ params }) => params.windstorm === true,
  title: '茜特菈莉天赋：伊兹帕帕的霜陨风暴造成的伤害提升[ePlus],元素爆发冰风暴造成的伤害提升[qPlus]',
  sort: 9,
  data: {
    ePlus: ({ attr, calc }) => calc(attr.mastery) * 90 / 100,
    qPlus: ({ attr, calc }) => calc(attr.mastery) * 1200 / 100
  }
}, {
  title: '茜特菈莉2命：元素精通提升[mastery]',
  cons: 2,
  data: {
    mastery: 125
  }
}, {
  title: '茜特菈莉6命：施放元素战技时提供[dmg]%伤害加成',
  cons: 6,
  data: {
    dmg: 2.5 * 40
  }
}, {
  check: ({ params }) => params.team === true,
  title: '双火班希：班尼特6命风鹰剑宗室4，希诺宁0+0',
  data: {
    atkPlus: 1203,
    atkPct: 25 + 20,
    kx: 36,
  }
}]

export const createdBy = 'liangshi'
