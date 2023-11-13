export const details = [{
  title: '重击伤害',
  dmg: ({ talent, attr, calc, cons }, { basic }) => {
    const a2Multi = cons >= 1 ? 1.6 : 1.25
    return basic(a2Multi * talent.a['重击·衡平推裁持续伤害'] * calc(attr.hp) / 100, 'a2')
  }
}, {
  title: 'E伤害',
  dmg: ({ talent, attr, calc }, { basic }) => basic(talent.e['技能伤害'] * calc(attr.hp) / 100, 'e')
}, {
  title: 'Q释放伤害',
  dmg: ({ talent, attr, calc }, { basic }) => basic(talent.q['技能伤害'] * calc(attr.hp) / 100, 'q')
}, {
  title: 'Q总伤害',
  dmg: ({ talent, attr, calc }, { basic }) => {
    const td = talent.q['技能伤害'] + talent.q['水瀑伤害'] * 2
    return basic(td * calc(attr.hp) / 100, 'q')
  }
}, {
  title: '满水滴一轮重击总伤害',
  dmg: ({ talent, attr, calc, cons }, { basic }) => {
    const count = cons >= 6 ? 30 : 8
    const td = talent.a['重击·衡平推裁持续伤害'] * count
    const extraTd = cons >= 6 ? 20 * 6 : 0
    const a2Multi = cons >= 1 ? 1.6 : 1.25
    return basic(a2Multi * (td + extraTd) * calc(attr.hp) / 100, 'a2')
  }
}]

export const defDmgIdx = 4
export const mainAttr = 'hp,dmg,cpct,cdmg'

export const buffs = [{
  title: '天赋-古海孑遗：按两层计算，重击·衡平推裁造成原本125%的伤害',
  check: ({ cons }) => cons < 1
}, {
  title: '天赋-古海孑遗：按三层计算，重击·衡平推裁造成原本160%的伤害',
  cons: 1
}, {
  title: '天赋-至高仲裁：基于当前生命值超出生命值上限30%的部分，提升[dmg]%水元素伤害',
  data: {
    dmg: 30
  }
}, {
  title: '那维2命：重击·衡平推裁的暴击伤害提升[a2Cdmg]%',
  cons: 2,
  data: {
    a2Cdmg: 42
  }
}, {
  title: '那维6命：延长重击持续时间至12s，同时每2s，额外造成20%生命倍率的视为重击·衡平推裁的伤害',
  cons: 6
}, {
  title: '双水Buff：生命值提高[hpPct]%',
  data: {
    hpPct: 25
  }
}]

export const createdBy = 'Aluxes'
