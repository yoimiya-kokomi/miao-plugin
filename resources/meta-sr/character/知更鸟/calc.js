import { Format } from '#miao'

export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '战技提升全体伤害',
  dmg: ({ talent }, dmg) => {
    return {
      avg: Format.percent(talent.e['伤害提高']),
      type: 'text'
    }
  }
}, {
  title: '终结技提升全体攻击力',
  dmg: ({ talent, attr }, dmg) => {
    return {
      avg: talent.q['攻击力提高百分比'] * attr.atk + talent.q['攻击力提高固定值']
    }
  }
}, {
  title: '终结技附加伤害',
  params: { q: true },
  dmg: ({ talent, cons }, dmg) => {
    // 暴击伤害固定为150%（6命时为600%），且伤害必定暴击
    let cdmgNum = cons < 6 ? 1.5 : 6
    let { avg } = dmg(talent.q['附加伤害'], '', 'skillDot') // 无双爆区近似
    return {
      avg: avg * (1 + cdmgNum)
    }
  }
}]

export const mainAttr = 'atk,cpct,cdmg'
export const defDmgIdx = 3

export const buffs = [{
  title: '天赋-调性合颂：我方全体暴击伤害提高[cdmg]%',
  data: {
    cdmg: ({ talent }) => talent.t['暴伤提高'] * 100
  }
}, {
  title: '战技Buff：我方全体伤害提高[dmg]%',
  data: {
    dmg: ({ talent }) => talent.e['伤害提高'] * 100
  }
}, {
  title: '终结技Buff：我方全体攻击力提高[atkPlus]',
  check: ({ params }) => params.q === true,
  sort: 9,
  data: {
    atkPlus: ({ talent, attr }) => talent.q['攻击力提高百分比'] * attr.atk + talent.q['攻击力提高固定值']
  }
}, {
  title: '知更鸟1命：我方全体全属性抗性穿透提高[kx]%',
  check: ({ params }) => params.q === true,
  cons: 1,
  data: {
    kx: 24
  }
}, {
  title: '知更鸟2命：我方全体速度提高[speedPct]%',
  check: ({ params }) => params.q === true,
  cons: 2,
  data: {
    speedPct: 16
  }
}, {
  title: '知更鸟4命：我方全体效果抵抗提高[effDef]%',
  cons: 4,
  data: {
    effDef: 50
  }
}, {
  title: '知更鸟6命：终结技造成的附加伤害的暴击伤害额外提高450%',
  check: ({ params }) => params.q === true,
  cons: 6
}]

export const createdBy = 'Aluxes'
