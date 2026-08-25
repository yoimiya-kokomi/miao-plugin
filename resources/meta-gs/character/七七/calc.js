export const details = [
  {
    title: 'E每跳治疗',
    dmg: ({ talent, attr, calc }, { heal }) =>
      heal(talent.e['持续治疗量2'][0] * calc(attr.atk) / 100 + talent.e['持续治疗量2'][1] * 1)
  },
  {
    title: '度厄真符每次治疗',
    dmg: ({ talent, attr, calc }, { heal }) =>
      heal(talent.q['治疗量2'][0] * calc(attr.atk) / 100 + talent.q['治疗量2'][1] * 1)
  },
  {
    title: '【辉映·星超导】Q星超导伤害',
    dmg: ({ attr, calc, talent }, { basic }) => basic(calc(attr.atk) * talent.q['星超导伤害'] / 100, '', 'stellarConduct')
  },
  {
    cons: 4,
    title: '4命追加每跳治疗',
    dmg: ({ talent, attr, calc }, { heal }) => heal(180 * calc(attr.atk) / 100)
  }
]

export const mainAttr = 'atk,cpct,cdmg,mastery,heal'

export const buffs = [
  {
    title: '双冰共鸣：攻击冰元素附着或冻结状态下的敌人时，暴击率提高[cpct]%',
    data: {
      cpct: 15
    }
  },
  {
    title: '七七天赋：【辉映·星超导】寒病鬼差持续期间，星超导反应伤害提升[stellarConduct]%',
    data: {
      stellarConduct: 50
    }
  },
  {
    title: '七七2命：【辉映·星烁】七七的攻击力提升[atkPct]%。',
    cons: 2,
    data: {
      atkPct: 50
    }
  }
]
