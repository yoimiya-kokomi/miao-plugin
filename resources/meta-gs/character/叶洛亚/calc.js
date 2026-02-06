export const details = [
  {
    title: 'E点按伤害',
    dmg: ({ attr, calc, talent }, { basic }) => basic((calc(attr.mastery) * talent.e['点按伤害2'][0] + calc(attr.def) * talent.e['点按伤害2'][1]) / 100, 'e')
  },
  {
    title: 'E长按伤害',
    dmg: ({ attr, calc, talent }, { basic }) => basic((calc(attr.mastery) * talent.e['长按伤害2'][0] + calc(attr.def) * talent.e['长按伤害2'][1]) / 100, 'e')
  },
  {
    title: 'Q技能伤害',
    dmg: ({ attr, calc, talent }, { basic }) => basic((calc(attr.mastery) * talent.q['技能伤害2'][0] + calc(attr.def) * talent.q['技能伤害2'][1]) / 100, 'q')
  },
  {
    title: '(3名水/岩角色)岩元素伤害增加',
    dmg: ({ attr, calc, talent }) => {
      return {
        avg: calc(attr.mastery) * (talent.q['岩元素伤害增加'] + 24) / 100
       }
    }
  },
  {
    title: '(3名水/岩角色)月结晶反应伤害增加',
    dmg: ({ attr, calc, talent }) => {
      return {
        avg: calc(attr.mastery) * (talent.q['月结晶反应伤害增加'] + 160) / 100
      }
    }
  },
  {
    title: '2命阿咚额外伤害',
    cons: 2,
    dmg: ({ attr, calc }, { basic }) => basic((calc(attr.mastery) * 400 + calc(attr.def) * 200) / 100, 'q')
  }
]

export const defDmgIdx = 4
export const mainAttr = 'def,cpct,cdmg,mastery'
export const defParams = { Moonsign: 2 }

export const buffs = []

export const createdBy = '冰翼'
