export const details = [{
  title: '甘鹤万班蓄力总伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['霜华矢·霜华绽发伤害'] + talent.a['霜华矢命中伤害'], 'a2')
}, {
  title: '甘鹤万班蓄力融化',
  dmg: ({ talent }, dmg) => dmg(talent.a['霜华矢·霜华绽发伤害'] + talent.a['霜华矢命中伤害'], 'a2', 'melt')
}, {
  title: 'Q单个冰凌伤害',
  params: {
    q: 1
  },
  dmg: ({ talent }, dmg) => dmg(talent.q['冰棱伤害'], 'q')
}]

export const defDmgIdx = 1
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
}, {
    title: '精5苍古万叶：获得[dmg]%增伤(苍古普攻32增伤)，增加[atkPct]%攻击,减抗[kx]%,精通[mastery]',
    data: {
      aDmg:32,
      a2Dmg:32,
      a3Dmg:32,
      dmg: 48,
      atkPct:40,
      kx:40,
      mastery:200
   }
  }, {
    title: '精5息灾申鹤：获得[dmg]%增伤,减抗[kx]%,爆伤15%,提升冰伤害5700',
    data: {
      dmg: 30,
      kx:15,
      cdmg:15,
      a2Plus:5700*2,
      ePlus:5700,
      qPlus:5700
   }
  },{
    title: '风鹰宗室班：增加[atkPlus]点攻击力与[atkPct]%攻击力',
    data: {
      atkPct: 20,
      atkPlus: 1202.35
  }
  }, 'melt']
