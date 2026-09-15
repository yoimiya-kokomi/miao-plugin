export const details = [{
  title: '战技治疗',
  dmg: ({ talent, attr }, { heal }) => heal(attr.def * talent.e['目标治疗·百分比生命'] + talent.e['目标治疗·固定值'])
}, {
  title: '强普治疗',
  dmg: ({ talent, attr }, { heal }) => heal(attr.def * talent.a2['目标治疗·百分比生命'] + talent.a2['目标治疗·固定值'])
}]

export const defDmgIdx = 1
export const defParams = { certifiedBanger: 50 }
export const mainAttr = 'def,cpct,cdmg'

export const buffs = [{
  title: '行迹-洞察万物：自身欢愉度提高[joy]%。治疗量加成[heal]%。',
  tree: 1,
  data: {
    joy: ({ attr }) => attr.def >= 2400 ? 32 + Math.floor(Math.min(attr.def - 2400, 3600)) / 10 * 3 : 0,
    heal: ({ attr }) => attr.joy * 0.2
  }
}, {
  title: '笑点计算：计算笑点用',
  data: {
    punchline: ({ params }) => params.punchline
  }
}, {
  title: '真珠1魂：队伍中「欢愉」命途角色数量等于2/3/4或以上时，使我方全体欢愉度提高10%/20%/60%',
  cons: 1,
  data: {
    joy: 60
  }
}, {
  title: '真珠2魂：我方全体目标的欢愉伤害增笑[merrymakes]%',
  cons: 2,
  data: {
    merrymakes: 15
  }
}, {
  title: '真珠6魂：我方全体目标的全属性抗性穿透提高[kx]%',
  cons: 6,
  data: {
    kx: 20
  }
}]
