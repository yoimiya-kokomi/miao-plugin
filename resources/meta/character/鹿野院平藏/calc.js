export const details = [{
  title: '勠心拳伤害',
  params: { e: 0 },
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: '满层勠心拳伤害',
  params: { e: 4 },
  dmg: ({ talent }, dmg) => {
    return dmg(talent.e['技能伤害'] * 1 + talent.e['变格伤害提升'] * 4 + talent.e['正论伤害提升'] * 1, 'e')
  }
}, {
  title: 'Q真空弹伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['不动流·真空弹伤害'], 'q')
}]

export const buffs = [{
  title: '平藏6命：每层「变格」提高E 4%暴击率,「正论」提高E 32%暴击伤害',
  cons: 6,
  data: {
    eCpct: ({ params }) => params.e === 4 ? 24 : 0,
    eCdmg: ({ params }) => params.e === 4 ? 32 : 0
  }
}]
