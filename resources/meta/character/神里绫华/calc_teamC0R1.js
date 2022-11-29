export const details = [{
  title: '神鹤万莫重击总伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['重击伤害'], 'a2')
}, {
  title: '神鹤万莫E伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: '神鹤万莫Q单段伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['切割伤害'], 'q')
}]

export const mainAttr = 'atk,cpct,cdmg'
export const defDmgIdx = 2

export const buffs = [{
  passive: 1,
  title: '神里被动：释放E后普攻与重击伤害提高30%',
  data: {
    aDmg: 30,
    a2Dmg: 30
  }
}, {
  passive: 2,
  title: '神里被动：霰步命中敌人获得18%冰伤加成',
  data: {
    dmg: 18
  }
}, {
  cons: 4,
  title: '神里4命：元素爆发后敌人防御力降低30%',
  data: {
    qDef: 30
  }
}, {
  cons: 6,
  title: '神里6命：每10秒重击伤害提高[a2Dmg]%',
  data: {
    a2Dmg: 298
  }
}, {
    title: '精1苍古0命万叶：获得[dmg]%增伤(苍古普攻16增伤)，增加[atkPct]%攻击,减抗[kx]%',
    data: {
      aDmg:16,
      a2Dmg:16,
      a3Dmg:16,
      dmg: 40,
      atkPct:20,
      kx:40
   }
  }, {
    title: '精1息灾申鹤：获得[dmg]%增伤,减抗[kx]%,提升冰伤害4100',
    data: {
      dmg: 30,
      kx:15,
      a2Plus:4100*3,
      ePlus:4100,
      qPlus:4100
   }
  }, {
    title: '千岩讨龙莫娜：获得[dmg]%增伤，增加[atkPct]%攻击',
    data: {
      dmg: 60,
      atkPct:68,
   }
  }]
