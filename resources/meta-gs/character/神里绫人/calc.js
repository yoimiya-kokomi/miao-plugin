export const details = [{
  title: 'E后瞬水剑三段伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['三段瞬水剑伤害'], 'a')
}, {
  title: 'E后瞬水剑三段蒸发',
  dmg: ({ talent }, dmg) => dmg(talent.e['三段瞬水剑伤害'], 'a', 'vaporize')
}, {
  title: '神里流·水囿每段伤害',
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
  cons: 1,
  title: '绫人1命：对于生命值低于或等于50%的敌人，瞬水剑造成的伤害提升40%',
  data: {
    aDmg: 40
  }
}, {
  check: ({ cons }) => cons < 2,
  sort: 9,
  title: '4层浪闪：提高瞬水剑伤害[aPlus]',
  data: {
    aPlus: ({ attr, calc, talent }) => calc(attr.hp) * talent.e['浪闪伤害值提高'] / 100 * 4
  }
}, {
  cons: 2,
  sort: 9,
  title: '绫人2命：5层浪闪提高瞬水剑伤害[aPlus]',
  data: {
    aPlus: ({ attr, calc, talent }) => calc(attr.hp) * talent.e['浪闪伤害值提高'] / 100 * 5
  }
}, 'vaporize']
