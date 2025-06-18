import { Format } from '#miao'

export const details = [{
  title: 'E技能伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: 'Q技能伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}, {
  title: 'Q护盾吸收量',
  dmg: ({ attr, calc, talent }, { shield }) => shield(talent.q['圣眷护盾吸收量2'][0] * calc(attr.hp) / 100 + talent.q['圣眷护盾吸收量2'][1])
}, {
  title: '场上角色攻击速度提升',
  dmg: ({ cons, attr, calc }) => {
    let num = cons == 6 ? 0.1 : 0
    return {
      avg: Format.percent(Math.min(Math.floor(calc(attr.hp) / 1000) * 0.005, 0.2) + num),
      type: 'text'
    }
  }
}]

export const mainAttr = 'atk,hp,cpct,cdmg'

export const buffs = [{
  title: '塔利雅2命：处于「祝颂」效果唤出的圣眷护盾庇佑下时，场上角色的护盾强效提升[shield]%',
  cons: 2,
  data: {
    shield: 25,
  }
}]

export const createdBy = '冰翼'
