export const details = [{
  check: ({ cons }) => cons < 2,
  title: '叄阶杀生樱伤害',
  dmg: ({ talent, attr }, dmg) => dmg(talent.e['杀生樱伤害·叁阶'], 'e')
}, {
  check: ({ cons }) => cons >= 2,
  title: '肆阶杀生樱伤害',
  dmg: ({ talent, attr }, dmg) => dmg(talent.e['杀生樱伤害·肆阶'], 'e')
}, {
  title: 'Q天狐霆雷伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['天狐霆雷伤害'], 'q')
}, {
  title: '四段Q总伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'] + talent.q['天狐霆雷伤害'] * 3, 'q')
}]

export const mainAttr = 'atk,cpct,cdmg,mastery'

export const buffs = [{
  title: '被动天赋：基于元素精通提高杀生樱伤害[eDmg]%',
  data: {
    eDmg: ({ attr, calc }) => calc(attr.mastery) * 0.15
  }
}, {
  check: ({ cons }) => cons >= 4,
  title: '4命效果：杀生樱命中敌人后提高雷伤[dmg]%',
  data: {
    dmg: 20
  }
}, {
  cons: 6,
  title: '6命效果：杀生樱无视敌人[eDef]%防御',
  data: {
    eDef: 60
  }
}]
