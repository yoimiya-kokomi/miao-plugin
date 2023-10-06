export const details = [{
  title: '满层E护盾量',
  dmg: ({ attr, calc, talent, cons }, { shield }) => {
    const sheildPlus = cons >= 1 ? 1.2 : 1
    return shield((calc(attr.hp) * talent.e['护盾基础吸收量2'][0] / 100 + talent.e['护盾基础吸收量2'][1]) * sheildPlus)
  }
}, {
  title: 'E飞星单伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['飞星伤害'], 'e')
}, {
  title: 'Q星光弹伤害',
  dmg: ({ attr, calc, talent }, { basic }) => basic(calc(attr.hp) * talent.q['星光弹伤害'] / 100)
}]

export const mainAttr = 'hp,atk,cpct,cdmg'

export const buffs = [{
  title: '莱依拉1命：安眠帷幕护盾的伤害吸收量提高20%',
  cons: 1,
  data: {
    _shield: 20
  }
}, {
  title: '莱依拉6命：飞星与星光弹造成的伤害提升40%',
  cons: 6,
  data: {
    eDmg: 40,
    qDmg: 40
  }
}, {
  title: '莱依拉被动：满层护盾强效提升24%',
  data: {
    shield: 24
  }
}, {
  title: '莱依拉被动：飞星造成的伤害值基于生命值提高[ePlus]',
  sort: 9,
  data: {
    ePlus: ({ attr, calc }) => calc(attr.hp) * 0.015
  }
}]
