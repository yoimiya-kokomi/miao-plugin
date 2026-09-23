export const details = [
  {
    title: 'E后普攻首段伤害',
    dmg: ({ attr, talent }, dmg) => dmg(talent.a['一段伤害'], 'a')
  },
  {
    title: 'E后普攻尾段伤害',
    dmg: ({ attr, talent }, dmg) => dmg(talent.a['六段伤害'], 'a')
  },
  {
    title: '翔风剑一阶伤害',
    dmg: ({ attr, talent }, dmg) => dmg(talent.e['翔风剑一阶伤害'], 'e')
  },
  {
    title: '翔风剑二阶伤害',
    dmg: ({ attr, talent }, dmg) => dmg(talent.e['翔风剑二阶伤害'], 'e')
  },
  {
    title: '满「整肃」翔风剑二阶灵剑星扩散伤害',
    params: { Stellar: true },
    dmg: ({ attr, calc, talent }, { basic }) => basic(1.6 * calc(attr.atk) * talent.e['翔风剑二阶灵剑星扩散伤害'] / 100, '', 'stellarSwirl')
  },
  {
    title: '满「整肃」翔风剑三阶灵剑星扩散总伤害',
    params: { Stellar: true },
    dmg: ({ attr, calc, talent }, { basic }) => basic(1.6 * calc(attr.atk) * (talent.e['翔风剑三阶灵剑星扩散伤害'] + talent.e['翔风剑三阶灵剑最终段星扩散伤害'])/ 100, '', 'stellarSwirl')
  },
  {
    title: '满「整肃」Q灵剑星扩散伤害',
    params: { Stellar: true },
    dmg: ({ attr, calc, talent }, { basic }) => basic(1.6 * calc(attr.atk) * talent.q['灵剑星扩散伤害'] / 100, '', 'stellarSwirl')
  },
  {
    cons: 6,
    title: '6命翔风剑·变移风元素伤害',
    dmg: ({}, dmg) => dmg(150)
  },
  {
    cons: 6,
    title: '满「整肃」6命翔风剑·变移灵剑星扩散伤害',
    params: { Stellar: true },
    dmg: ({ attr, calc }, { basic }) => basic(1.6 * calc(attr.atk) * 200 / 100, '', 'stellarSwirl')
  }
]

export const defDmgIdx = 5
export const mainAttr = 'atk,cpct,cdmg,mastery'

export const buffs = [
  {
    title: '薇斯纳天赋：每有一位元素类型为冰元素或风元素的角色：薇斯纳的攻击力提升6%（默认3位）；' +
      '每有一位不为上述元素类型的角色：薇斯纳的元素精通提升25点。（默认1位）',
    data: {
      atkPct: ({ cons, params }) => (params.num1 || 3) * (cons >= 4 ? 6 * 3 : 6),
      mastery: ({ cons, params }) => (params.num2 || 1) * (cons >= 4 ? 25 * 3 : 25)
    }
  },
  {
    check: ({ params }) => params.Stellar === true,
    title: '薇斯纳天赋：基于薇斯纳的攻击力，对队伍中角色造成的星扩散反应提升[fypct]%的基础伤害',
    sort: 9,
    data: {
      fypct: ({ attr, calc }) => Math.min(calc(attr.atk) / 100 * 0.7, 14)
    }
  },
  {
    title: '薇斯纳1命：薇斯纳在巡风列装模式下造成的星扩散反应伤害提升[stellarSwirl]%。',
    cons: 1,
    data: {
      stellarSwirl: 20,
      stellarVortex: 20
    }
  },
  {
    title: '薇斯纳2命：拥有最大层数的整肃时，薇斯纳的攻击力提升[atkPct]%',
    cons: 2,
    data: {
      atkPct: 40
    }
  },
  {
    title: '薇斯纳6命：星扩散反应伤害擢升[elevated]%',
    cons: 6,
    data: {
      elevated: 20
    }
  }
]

export const createdBy = '冰翼'
