export const details = [{
  title: '霜华绽发伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['霜华矢·霜华绽发伤害'], 'a2')
}, {
  title: '霜华矢两段总伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['霜华矢·霜华绽发伤害'] + talent.a['霜华矢命中伤害'], 'a2')
}, {
  title: '霜华矢两段+融化',
  dmg: ({ talent }, dmg) => dmg(talent.a['霜华矢·霜华绽发伤害'] + talent.a['霜华矢命中伤害'], 'a2', 'melt')
}, {
  title: 'Q单个冰凌伤害',
  params: {
    q: 1
  },
  dmg: ({ talent }, dmg) => dmg(talent.q['冰棱伤害'], 'q')
}]

export const defDmgIdx = 2
export const mainAttr = 'atk,cpct,cdmg,mastery'

export const buffs = [{
  cons: 0,
  title: '甘雨被动：霜华矢发射后的5秒内霜华矢暴击率提高20%',
  data: {
    a2Cpct: 20
  }
}, {
  cons: 1,
  title: '甘雨1命：霜华失命中减少敌人15%冰抗',
  data: {
    kx: ({ params }) => params.q ? 0 : 15
  }
}, {
  cons: 4,
  title: '甘雨4命：大招领域内敌人受到的伤害提升25%',
  data: {
    dmg: ({ params }) => params.q ? 25 : 0
  }
}, 'melt']
