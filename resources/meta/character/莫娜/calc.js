export const details = [{
  title: '重击伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['重击伤害'], 'a2')
}, {
  title: '重击蒸发',
  dmg: ({ talent }, dmg) => dmg(talent.a['重击伤害'], 'a2', 'vaporize')
}, {
  title: 'Q泡影破裂伤害',
  params: { q: true },
  dmg: ({ talent }, dmg) => dmg(talent.q['泡影破裂伤害'], 'q')
}, {
  title: 'Q泡影破裂蒸发',
  params: { q: true },
  dmg: ({ talent }, dmg) => dmg(talent.q['泡影破裂伤害'], 'q', 'vaporize')
}]

export const defDmgIdx = 3
export const mainAttr = 'atk,cpct,cdmg,recharge'

export const buffs = [{
  title: '莫娜被动：基于元素充能效率获得水元素伤害[dmg]%',
  sort: 4,
  data: {
    dmg: ({ calc, attr }) => calc(attr.recharge) * 0.2
  }
}, {
  title: '莫娜1命：命中星异状态下的敌人水元素相关反应效果提升15%',
  cons: 1,
  data: {
    vaporize: ({ params }) => params.q ? 15 : 0
  }
}, {
  title: '莫娜4命：攻击处于星异状态下的敌人时暴击率提升15%',
  cons: 4,
  data: {
    cpct: ({ params }) => params.q ? 15 : 0
  }
}, {
  title: '莫娜6命：虚实流动状态后满Buff提升重击180%伤害',
  cons: 6,
  data: {
    a2Dmg: 180
  }
}, {
  title: '莫娜天赋：开Q获得[dmg]%伤害加成',
  data: {
    dmg: ({ talent }) => talent.q['伤害加成']
  }
}, 'vaporize']
