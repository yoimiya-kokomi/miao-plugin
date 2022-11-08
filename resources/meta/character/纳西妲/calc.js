export const details = [{
  title: 'E长按伤害',
  params: { e: true, q: false },
  dmg: ({ talent }, dmg) => dmg(talent.e['长按伤害'], 'e')
}, {
  title: '灭净三业伤害',
  params: { e2: true, q: false },
  dmg: ({ talent, calc, attr }, { basic }) => {
    const td = talent.e['灭净三业伤害2']
    const em = calc(attr.mastery)
    const atk = calc(attr.atk)
    return basic(td[0] * atk / 100 + td[1] * em / 100, 'e')
  }
}, {
  title: '开Q灭净三业伤害',
  params: { e2: true },
  dmg: ({ talent, calc, attr, cons }, { basic }) => {
    const td = talent.e['灭净三业伤害2']
    const em = calc(attr.mastery)
    const atk = calc(attr.atk)
    return basic(td[0] * atk / 100 + td[1] * em / 100, 'e')
  }
}, {
  title: '灭净三业·蔓激化',
  params: { e2: true, q: false },
  dmg: ({ talent, calc, attr }, { basic }) => {
    const td = talent.e['灭净三业伤害2']
    const em = calc(attr.mastery)
    const atk = calc(attr.atk)
    return basic(td[0] * atk / 100 + td[1] * em / 100, 'e', 'spread')
  }
}, {
  title: '开Q灭净三业·蔓激化',
  params: { e2: true },
  dmg: ({ talent, calc, attr, cons }, { basic }) => {
    const td = talent.e['灭净三业伤害2']
    const em = calc(attr.mastery)
    const atk = calc(attr.atk)
    return basic(td[0] * atk / 100 + td[1] * em / 100, 'e', 'spread')
  }
}]

export const defDmgIdx = 4
export const mainAttr = 'atk,mastery,cpct,cdmg'

export const buffs = [{
  title: '草神1命：火元素队友额外计入1位',
  cons: 1
}, {
  title: '草神2命：激化相关反应降低敌人防御力30%',
  cons: 2,
  data: {
    enemyDef: 30
  }
}, {
  title: '草神4命：E4个敌人提升精通160',
  cons: 4,
  data: {
    mastery: 160
  }
}, {
  title: '草神被动：开Q元素精通提升[mastery]',
  data: {
    mastery: ({ calc, attr, params }) => (params.q === false ? 0 : 1) * Math.min(250, calc(attr.mastery) * 0.25)
  }
}, {
  title: '草神被动：基于元素精通提升灭净三业伤害[eDmg]%，暴击率[eCpct]%',
  data: {
    eDmg: ({ calc, attr, params }) => (params.e ? 0 : 1) * Math.min(80, (calc(attr.mastery) - 200) * 0.1),
    eCpct: ({ calc, attr, params }) => (params.e ? 0 : 1) * Math.min(24, (calc(attr.mastery) - 200) * 0.03)
  }
}, {
  title: '草神Q：开Q提升灭净三业伤害[eDmg]%',
  data: {
    eDmg: ({ cons, talent, params }) => (params.q === false ? 0 : 1) *
      (cons >= 1 ? talent.q['火2伤害提升'] : talent.q['火1伤害提升'])
  }
}]
