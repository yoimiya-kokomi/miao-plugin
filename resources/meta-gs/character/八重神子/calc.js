export const details = [{
  check: ({ cons }) => cons < 2,
  dmgKey: 'e',
  title: '叄阶杀生樱伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['杀生樱伤害·叁阶'], 'e')
}, {
  check: ({ cons }) => cons < 2,
  dmgKey: 'e',
  title: '强化叄阶杀生樱伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['杀生樱伤害·叁阶'] + 80, 'e')
}, {
  check: ({ cons }) => cons >= 2,
  dmgKey: 'e',
  title: '肆阶杀生樱伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['杀生樱伤害·肆阶'], 'e')
}, {
  check: ({ cons }) => cons >= 2,
  dmgKey: 'e',
  title: '强化肆阶杀生樱伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['杀生樱伤害·肆阶'] + 80, 'e')
}, {
  check: ({ cons }) => cons < 2,
  title: '叄阶杀生樱激化伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['杀生樱伤害·叁阶'], 'e', 'aggravate')
}, {
  check: ({ cons }) => cons >= 2,
  title: '肆阶杀生樱激化伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['杀生樱伤害·肆阶'], 'e', 'aggravate')
}, {
  title: '【辉映·星超导】强化落雷命中后额外星超导伤害',
  params: { Stellar: true },
  dmg: ({ attr, calc }, { basic }) => basic(calc(attr.atk) * 200 / 100, '', 'stellarConduct')
}, {
  title: 'E施放后额外雷击伤害',
  dmg: ({ talent }, dmg) => dmg(40, '')
}, {
  title: '【辉映·星超导】E施放后额外星超导伤害',
  params: { Stellar: true },
  dmg: ({ attr, calc }, { basic }) => basic(calc(attr.atk) * 50 / 100, '', 'stellarConduct')
}, {
  title: '四段Q总伤害',
  params: { Q: true },
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'] + talent.q['天狐霆雷伤害'] * 3, 'q')
}, {
  title: '四段Q总激化伤害',
  params: { Q: true },
  dmg: ({ talent }, dmg) => {
    let q1j = dmg(talent.q['技能伤害'], 'q', 'aggravate')
    let q2j = dmg(talent.q['天狐霆雷伤害'], 'q', 'aggravate')
    return {
      dmg: q1j.dmg + q2j.dmg * 3,
      avg: q1j.avg + q2j.avg * 3
    }
  }
}]

export const mainAttr = 'atk,cpct,cdmg,mastery,dmg'
export const defDmgKey = 'e'

export const buffs = [{
  title: '被动天赋：基于元素精通提高杀生樱伤害[eDmg]%',
  sort: 9,
  data: {
    eDmg: ({ attr, calc }) => calc(attr.mastery) * 0.15
  }
}, {
  cons: 1,
  title: '1命效果：触发超导/星超导反应或造成星超导反应伤害后，获得[dmg]%雷元素伤害加成和星超导伤害加成',
  data: {
    dmg: 50,
    stellarConduct: 50,
  }
}, {
  cons: 2,
  title: '2命效果：肆阶杀生樱在场时，元素精通提高[mastery]',
  data: {
    mastery: 200
  }
}, {
  cons: 4,
  title: '4命效果：杀生樱命中敌人后提高雷伤[dmg]%',
  data: {
    dmg: 20
  }
}, {
  check: ({ params }) => params.Q === true,
  cons: 4,
  title: '4命效果：元素爆发伤害提升[dmg]%',
  data: {
    dmg: 100
  }
}, {
  cons: 6,
  title: '6命效果：杀生樱无视敌人[eDef]%防御',
  data: {
    eDef: 60
  }
}, {
  check: ({ params }) => params.Stellar === true,
  cons: 6,
  title: '6命效果：星超导反应伤害的暴击伤害提升[cdmg]%',
  data: {
    cdmg: 200
  }
}]
