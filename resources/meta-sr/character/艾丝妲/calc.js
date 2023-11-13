import { Format } from '#miao'

export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '战技伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'] * 5, 'e')
}, {
  title: '普攻灼烧持续伤害',
  tree: 3,
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'] * 0.5, '', 'skillDot')
}, {
  title: '蓄能5层全队加攻',
  dmg: ({ talent }) => {
    return {
      avg: Format.percent(talent.t['攻击力提高'] * 5),
      type: 'text'
    }
  }
}, {
  title: '终结技全队速度提高',
  dmg: ({ talent }) => {
    return {
      avg: talent.q['速度提高']
    }
  }
}]

export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '行迹-点燃：我方全体火属性伤害提高18%',
  tree: 3,
  data: {
    dmg: 18
  }
}, {
  title: '蓄能5层：攻击力提高[atkPct]%',
  data: {
    atkPct: ({ talent }) => talent.t['攻击力提高'] * 5 * 100
  }
}]

export const createdBy = 'Aluxes'
