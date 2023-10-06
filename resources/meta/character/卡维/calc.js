export const details = [{
  title: '画则巧施伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: 'Q后绽放伤害',
  params: { bloom: true },
  dmg: ({ calc, attr }, { reaction }) => {
    return reaction('bloom')
  }
}]

export const mainAttr = 'atk,cpct,cdmg,mastery'

export const buffs = [{
  title: '繁绘隅穹：草原核迸发伤害提升[bloom]%',
  data: {
    bloom: ({ talent }) => talent.q['草原核迸发伤害加成']
  }
}, {
  title: '卡维4命：卡维触发绽放反应产生的草原核在迸发时造成的伤害提升60%',
  cons: 4,
  data: {
    bloom: ({ params }) => params.bloom ? 60 : 0
  }
}]
