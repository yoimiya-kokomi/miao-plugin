export const details = [{
  title: '触发特效后生命值',
  dmg: ({ attr, calc }) => {
    return {
      avg: Math.min(calc(attr.hp) * 1)
    }
  }
}, {
  title: '触发特效后攻击力',
  dmg: ({ attr, calc }) => {
    return {
      avg: Math.min(calc(attr.atk) * 1)
    }
  }
}, {
  title: '触发特效后防御力',
  dmg: ({ attr, calc }) => {
    return {
      avg: Math.min(calc(attr.def) * 1)
    }
  }
}, {
  title: '触发特效后暴击率',
  dmg: ({ attr, calc }) => {
    return {
      avg: Math.min(calc(attr.cpct) * 1)
    }
  }
}, {
  title: '触发特效后暴击伤害',
  dmg: ({ attr, calc }) => {
    return {
      avg: Math.min(calc(attr.cdmg) * 1)
    }
  }
}, {
  title: '触发特效后元素精通',
  dmg: ({ attr, calc }) => {
    return {
      avg: Math.min(calc(attr.mastery) * 1)
    }
  }
}, {
  title: '触发特效后充能效率',
  dmg: ({ attr, calc }) => {
    return {
      avg: Math.min(calc(attr.recharge) * 1)
    }
  }
}, {
  title: '触发特效后护盾强效',
  dmg: ({ attr, calc }) => {
    return {
      avg: Math.min(calc(attr.shield) * 1)
    }
  }
}, {
  title: '当前圣遗物套装',
  dmg: ({ artis , attr, calc, talent }) => {
    return {
      avg: artis ,
      type: 'text'
    }
  }
},{
  title: '[E]黑曜星魔伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['黑曜星魔伤害'], 'e')
},{
  title: '[E]黑曜星魔融化伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['黑曜星魔伤害'], 'e', 'melt')
},{
  title: '[E]霜陨风暴伤害',
  params: { team: false,QA: false, EA: true },
  dmg: ({ talent }, dmg) => dmg(talent.e['霜陨风暴伤害'], 'e')
},{
  title: '[E]霜陨风暴融化伤害',
  params: { team: false,QA: false, EA: true },
  dmg: ({ talent }, dmg) => dmg(talent.e['霜陨风暴伤害'], 'e', 'melt')
},{
  title: '[E]白曜护盾量',
  dmgKey: 'AE',
  dmg: ({ attr, calc, talent }, { shield }) => shield(talent.e['护盾吸收量2'][1] + calc(attr.mastery) * talent.e['护盾吸收量'] / 100, 'e')
},{
  title: '[Q]冰风暴伤害',
  params: { team: false,QA: true, EA: false },
  dmg: ({ talent }, dmg) => dmg(talent.q['冰风暴伤害'], 'q')
},{
  title: '[Q]冰风暴融化伤害',
  params: { team: false,QA: true, EA: false },
  dmg: ({ talent }, dmg) => dmg(talent.q['冰风暴伤害'], 'q', 'melt')
},{
  title: '[Q]宿灵之髑伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['宿灵之髑伤害'], 'q')
},{
  title: '[Q]宿灵之髑融化伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['宿灵之髑伤害'], 'q', 'melt')
}]

export const defDmgKey = 'AE'
export const mainAttr = 'atk,hp,cpct,cdmg'

export const buffs = [{
  title: '白燧蝶的星衣：霜陨风暴造成的伤害提升[ePlus]%',
  check: ({ params }) => params.EA === true,
  data: {
    ePlus: ({ calc, attr }) => Math.min(calc(attr.mastery) * 0.9)
  }
},{
  title: '白燧蝶的星衣：冰风暴造成的伤害提升[qPlus]%',
  check: ({ params }) => params.QA === true,
  data: {
    qPlus: ({ calc, attr }) => Math.min(calc(attr.mastery) * 12)
  }
},{
  title: '2命：元素精通提升125点',
  cons: 2,
  data: {
    mastery: 125
  }
},{
  title: '6命：造成的伤害提升100%',
  cons: 6,
  data: {
    dmg: 100
  }
}]
