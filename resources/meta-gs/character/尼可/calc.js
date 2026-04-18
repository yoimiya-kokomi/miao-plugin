export const details = [{
    title: 'E释放伤害',
    dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
  }, {
    title: 'E护盾吸收量',
    dmg: ({ talent, calc, attr }, { shield }) => shield(talent.e['护盾吸收量2'][0] * calc(attr.atk) / 100 + talent.e['护盾吸收量2'][1] * 1)
  }, {
    title: 'E攻击力提升',
    params: { "虚己之赐": false, "圣祝之引": false },
    dmg: ({ talent, calc, attr, cons }) => {
      return {
        avg: Math.min(talent.e['虚己之赐攻击力加成比例'] * calc(attr.atk) / 100, talent.e['虚己之赐攻击力加成上限']) + 300 + (cons >= 2 ? 240 : 0)
      }
    }
  }, {
    title: 'Q释放伤害',
    dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
  }, {
    title: 'Q协同伤害（自身）',
    dmg: ({ talent }, dmg) => dmg(talent.q['奥迹造影伤害'] + 150, '')
  }, {
    check: ({ cons }) => cons > 0,
    title: '1命协同伤害（自身）',
    dmg: ({ talent }, dmg) => dmg(600, '')
}]

export const defParams = { "虚己之赐": true, "圣祝之引": true, Hexenzirkel: true }
export const defDmgIdx = 2
export const mainAttr = 'atk,cpct,cdmg,mastery,dmg'

export const buffs = [{
  check: ({ params }) => params["圣祝之引"] === true,
  title: '尼可技能：获得虚己之赐效果，提升[atkPlus]点攻击力',
  data: {
    atkPlus: ({ talent, calc, attr }) => Math.min(talent.e['虚己之赐攻击力加成比例'] * calc(attr.atk) / 100, talent.e['虚己之赐攻击力加成上限'])
  }
}, {
  check: ({ params }) => params["圣祝之引"] === true,
  title: '尼可天赋：施放元素战技后拥有圣祝之引，额外提升[atkPlus]点攻击力',
  data: {
    atkPlus: 300
  }
}, {
  title: '尼可2命：虚己之赐还会额外提升[atkPlus]攻击力,拥有圣祝之引使附近敌人的对应元素抗性降低[kx]%',
  cons: 2,
  data: {
    atkPlus: ({ params }) => params["虚己之赐"] === true ? 240 : 0,
    kx: ({ params }) => params["圣祝之引"] === true ? 20 : 0
  }
}, {
  title: '尼可4命：拥有圣祝之引时赋予「先导之佑」, 普通攻击、重击、下落攻击、元素战技与元素爆发造成的伤害提升[aPlus]',
  cons: 4,
  data: {
    aPlus: ({ calc, attr }) => calc(attr.atk) / 100 * 70,
    a2Plus: ({ calc, attr }) => calc(attr.atk) / 100 * 70,
    a3Plus: ({ calc, attr }) => calc(attr.atk) / 100 * 70,
    ePlus: ({ calc, attr }) => calc(attr.atk) / 100 * 70,
    qPlus: ({ calc, attr }) => calc(attr.atk) / 100 * 70
  }
}, {
  title: '尼可6命：拥有圣祝之引,造成的伤害无视敌人[ignore]%防御力',
  cons: 6,
  data: {
    ignore: 40
  }
}]
