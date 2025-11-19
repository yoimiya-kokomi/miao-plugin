export const details = [{
  title: '七相一闪普攻首段伤害',
  params: { cons_2 : true },
  dmg: ({ talent, attr }, dmg) => dmg(talent.e['一段伤害'], 'a')
}, {
  title: '七相一闪普攻尾段伤害',
  params: { cons_2 : true },
  dmg: ({ talent, attr }, dmg) => dmg(talent.e['五段伤害'], 'a')
}, {
  title: '七相一闪重击伤害',
  params: { cons_2 : true },
  dmg: ({ talent, attr }, dmg) => dmg(talent.e['重击伤害'], 'a')
}, {
  title: 'Q极恶技·灭6段总伤害',
  params: { Havoc_Ruin: true },
  dmg: ({ talent, attr }, dmg) => dmg(talent.q['斩击伤害'] + talent.q['斩击最终段伤害'], 'q')
}, {
  title: '七相一闪1命晶刃单次伤害',
  params: { cons_2 : true },
  cons: 1,
  dmg: ({}, dmg) => dmg(500, 'a2')
}, {
  title: '6命1层极恶技·斩协同攻击伤害',
  cons: 6,
  dmg: ({}, dmg) => dmg(600, 'q')
}, {
  title: '6命七相一闪3次协同攻击总伤害',
  params: { cons_2 : true },
  cons: 6,
  dmg: ({}, dmg) => dmg(150 * 3, 'a')
}, {
  title: '受到伤害时6命七相一闪3次协同攻击总伤害',
  params: { cons_2 : true },
  cons: 6,
  dmg: ({}, dmg) => dmg(150 * 3, 'a2')
}]

export const defDmgIdx = 1
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '双冰共鸣：攻击冰元素附着或冻结状态下的敌人时，暴击率提高[cpct]%',
  data: {
    cpct: 15
  }
}, {
  check: ({ params }) => params.Havoc_Ruin === true,
  title: '丝柯克元素爆发：依据施放时丝柯克拥有的蛇之狡谋超过50点的部分，Q极恶技·灭最多可获得[qPct]%的倍率提升',
  data: {
    qPct: ({ talent, cons }) => {
      let num = cons > 1 ? 22 : 12
      return num * talent.q['蛇之狡谋加成'] * 6
    }
  }
}, {
  title: '丝柯克元素爆发：汲取3枚虚境裂隙时，普通攻击造成的伤害提高[aDmg]%',
  data: {
    aDmg: ({ talent }) => talent.q['汲取0/1/2/3枚虚境裂隙伤害提升'][3]
  }
}, {
  title: '丝柯克天赋：3层死河渡断时，普通攻击造成原本170%的伤害，且元素爆发极恶技·灭造成原本160%的伤害',
  data: {
    aMulti: 70,
    qMulti: 60
  }
}, {
  check: ({ params }) => params.cons_2 === true,
  title: '丝柯克2命：施放七相一闪模式下的特殊元素爆发极恶技·尽后的12.5秒内，攻击力提升[atkPct]%',
  cons: 2,
  data: {
    atkPct: 70
  }
}, {
  title: '丝柯克4命：3层死河渡断效果使丝柯克的攻击力提升[atkPct]%',
  cons: 4,
    data: {
    atkPct: 40
  }
}]

export const createdBy = '冰翼'
