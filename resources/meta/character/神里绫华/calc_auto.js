export const details = [{
  title: '重击总伤害',
  params: { team: false },
  dmg: ({ talent }, dmg) => dmg(talent.a['重击伤害'], 'a2')
}, {
  title: '神鹤万莫重击总伤害',
  params: { team: true },
  dmg: ({ talent }, dmg) => dmg(talent.a['重击伤害'], 'a2')
}, {
  title: 'E伤害',
  params: { team: false },
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: 'Q单段伤害',
  params: { team: false },
  dmg: ({ talent }, dmg) => dmg(talent.q['切割伤害'], 'q')
}, {
  title: '神鹤万莫Q单段伤害',
  params: { team: true },
  dmg: ({ talent }, dmg) => dmg(talent.q['切割伤害'], 'q')
}]

export const mainAttr = 'atk,cpct,cdmg'
export const defDmgIdx = 4

export const defParams = {
  team: true
}

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
  check: ({ cons, params }) => cons <= 1 && params.team === true,
  title: '精1苍古0命万叶：获得[dmg]%增伤(苍古普攻16增伤)，增加[atkPct]%攻击,减抗[kx]%',
  data: {
    aDmg: 16,
    a2Dmg: 16,
    a3Dmg: 16,
    dmg: 40,
    atkPct: 20,
    kx: 40
  }
}, {
  check: ({ cons, params }) => ((cons < 6 && cons > 1) && params.team === true),
  title: '精1苍古2命万叶：获得[dmg]%增伤(苍古普攻16增伤)，增加[atkPct]%攻击,减抗[kx]%,精通[mastery]',
  data: {
    aDmg: 16,
    a2Dmg: 16,
    a3Dmg: 16,
    dmg: 48,
    atkPct: 20,
    kx: 40,
    mastery: 200
  }
}, {
  check: ({ cons, params }) => (cons >= 6 && params.team === true),
  title: '精5苍古6命万叶：获得[dmg]%增伤(苍古普攻32增伤)，增加[atkPct]%攻击,减抗[kx]%,精通[mastery]',
  data: {
    aDmg: 32,
    a2Dmg: 32,
    a3Dmg: 32,
    dmg: 48,
    atkPct: 40,
    kx: 40,
    mastery: 200
  }
}, {
  check: ({ cons, params }) => (cons >= 6 && params.team === true),
  title: '精5息灾申鹤：获得[dmg]%增伤,减抗[kx]%,爆伤15%,双冰暴击15%，提升冰伤害5700',
  data: {
    dmg: 30,
    kx: 15,
    cdmg: 15,
    cpct: 15,
    a2Plus: 5700 * 3,
    ePlus: 5700,
    qPlus: 5700
  }
}, {
  check: ({ cons, params }) => (cons < 6 && params.team === true),
  title: '精1息灾申鹤：获得[dmg]%增伤,减抗[kx]%,双冰暴击15%，提升冰伤害4300',
  data: {
    dmg: 30,
    kx: 15,
    cpct: 15,
    a2Plus: 4300 * 3,
    ePlus: 4300,
    qPlus: 4300
  }
}, {
  check: ({ cons, params }) => (cons >= 2 && params.team === true),
  title: '千岩讨龙4命莫娜：获得[dmg]%增伤，增加[atkPct]%攻击,暴击15%',
  data: {
    dmg: 60,
    cpct: 15,
    atkPct: 68
  }
}, {
  check: ({ cons, params }) => (cons < 2 && params.team === true),
  title: '千岩讨龙0命莫娜：获得[dmg]%增伤，增加[atkPct]%攻击',
  data: {
    dmg: 60,
    atkPct: 68
  }
}]
