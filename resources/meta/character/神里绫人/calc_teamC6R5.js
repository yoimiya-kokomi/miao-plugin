export const details = [{
  title: '绫夜万班瞬水剑三段伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['三段瞬水剑伤害'], 'a')
}, {
  title: '绫夜万班瞬水剑三段蒸发',
  dmg: ({ talent }, dmg) => dmg(talent.e['三段瞬水剑伤害'], 'a', 'vaporize')
}, {
  title: '绫夜万班Q每段伤害',
  params: { q: 1 },
  dmg: ({ talent }, dmg) => dmg(talent.q['水花剑伤害'], 'q')
}]

export const defDmgIdx = 1
export const mainAttr = 'hp,atk,cpct,cdmg,mastery'

export const buffs = [{
  cons: 2,
  title: '绫人2命：3层浪闪以上时提高50%生命值',
  data: {
    hpPct: ({ params }) => params.q ? 0 : 50
  }
}, {
  check: ({ cons }) => cons < 2,
  title: '4层浪闪：提高瞬水剑伤害[aPlus]',
  data: {
    aPlus: ({ attr, calc, talent }) => calc(attr.hp) * talent.e['浪闪伤害值提高'] / 100 * 4
  }
}, {
  cons: 2,
  title: '绫人2命：5层浪闪提高瞬水剑伤害[aPlus]',
  data: {
    aPlus: ({ attr, calc, talent }) => calc(attr.hp) * talent.e['浪闪伤害值提高'] / 100 * 5
  }
}, {
    title: '风鹰宗室班：增加[atkPlus]点攻击力与[atkPct]%攻击力',
    data: {
      atkPct: 20,
      atkPlus: 1202.35
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
    title: '夜兰：获得[dmg]%增伤,[hpPct]%生命值,双水25%生命值',
    data: {
      dmg: 35,
      hpPct:65
   }
  }, 'vaporize']
