export const details = [{
  title: 'E长按伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['长按技能伤害'], 'e')
}, {
  title: 'Q斩击伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['斩击伤害'], 'q')
}, {
  title: 'Q无转化每段伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['持续伤害'], 'q')
}, {
  title: '扩散反应伤害',
  dmg: ({ }, { reaction }) => reaction('swirl')
}, {
  title: '万班闲芙·下落攻击蒸发伤害',
  check: ({ cons }) => cons >= 6,
  params: { team: true },
  dmg: ({ talent }, dmg) => dmg(talent.a['低空/高空坠地冲击伤害'][1], 'a3', 'vaporize')
}]

export const mainAttr = 'atk,cpct,cdmg,mastery'

export const buffs = [{
  title: '万叶2命：开Q后精通提高200',
  cons: 2,
  data: {
    mastery: 200
  }
}, {
  check: ({ params }) => params.team === true,
  title: '风鹰宗室班：增加[atkPlus]点攻击力',
  data: {
    atkPlus: 1202.35
  }
}, {
  check: ({ params }) => params.team === true,
  title: '2命精5鹤鸣闲云：获得[a3Dmg]%下落攻击增伤，[a3Plus]下落攻击伤害值加成，[a3Cpct]%下落攻击暴击率提高',
  data: {
    a3Dmg: 80,
    a3Plus: 18000,
    a3Cpct: 10
  }
}, {
  check: ({ params }) => params.team === true,
  title: '2命芙宁娜：获得[dmg]%增伤',
  data: {
    dmg: 100
  }
}, {
  check: ({ params }) => params.team === true,
  title: '万叶6命：基于元素精通，提高下落攻击造成的伤害[a3Dmg]%',
  cons: 6,
  sort: 9,
  data: {
    a3Dmg: ({ attr }) => attr.mastery * 0.2
  }
}, {
  check: ({ params }) => params.team === true,
  title: '天赋-风物之诗咏：基于元素精通，获得[dmg]%增伤',
  sort: 9,
  data: {
    dmg: ({ attr }) => attr.mastery * 0.04
  }
}, 'swirl']

export const createdBy = 'Aluxes'
