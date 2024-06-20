import { Format } from '#miao'

export const details = [{
  title: '战技伤害',
  dmg: ({ talent, cons }, dmg) => {
    let count = cons < 6 ? 5 : 7
    return dmg(talent.e['技能伤害'] * count, 'e')
  }
}, {
  title: '终结技提高全队击破特攻',
  dmg: ({ talent }) => {
    return {
      avg: Format.percent(talent.q['击破特攻提高']),
      type: 'text'
    }
  }
}, {
  title: '4魂提高队友击破特攻',
  params: { q: true },
  cons: 4,
  dmg: ({ attr }) => {
    return {
      avg: Format.percent(attr.stance / 100 * 0.15),
      type: 'text'
    }
  }
}, {
  title: '普攻超击破伤害',
  params: { q: true },
  dmg: ({ trees }, { reaction }) => {
    let extraDmg = trees['101'] ? 1.6 : 1
    return {
      avg: reaction('superBreak').avg / 0.9 * extraDmg
    }
  }
}, {
  title: '战技超击破伤害',
  params: { q: true },
  dmg: ({ cons, trees }, { reaction }) => {
    let cost = (cons < 6 ? 3 : 4) + (trees['102'] ? 1 : 0)
    let extraDmg = trees['101'] ? 1.6 : 1
    return {
      avg: reaction('superBreak').avg / 0.9 * cost * extraDmg
    }
  }
}, {
  title: '开阮加·普攻超击破伤害',
  params: { q: true, team: true },
  dmg: ({ trees }, { reaction }) => {
    // 阮梅提高弱点击破效率50%
    let cost = 1 * 1.5
    let extraDmg = trees['101'] ? 1.6 : 1
    return {
      avg: reaction('superBreak').avg / 0.9 * cost * extraDmg
    }
  }
}, {
  title: '开阮加·战技超击破伤害',
  dmgKey: 'e',
  params: { q: true, team: true },
  dmg: ({ cons, trees }, { reaction }) => {
    // 阮梅提高弱点击破效率50%
    let cost = ((cons < 6 ? 3 : 4) + (trees['102'] ? 1 : 0)) * 1.5
    let extraDmg = trees['101'] ? 1.6 : 1
    return {
      avg: reaction('superBreak').avg / 0.9 * cost * extraDmg
    }
  }
}]

export const mainAttr = 'atk,stance'
export const defDmgKey = 'e'

export const buffs = [{
  title: '终结技Buff：我方全体击破特攻提高[stance]%',
  data: {
    stance: ({ talent }) => talent.q['击破特攻提高'] * 100
  }
}, {
  title: '行迹-卫我起舞：场上敌方数量为1时，超击破伤害提高60%',
  tree: 1
}, {
  title: '开拓者6命：战技的额外伤害次数增加2次',
  cons: 6
}, {
  title: '0魂阮梅：弱点击破效率提高50%，击破特攻提高20%，抗性穿透提高25%，速度提高10%',
  check: ({ params }) => params.team === true,
  data: {
    stance: 20,
    kx: 25,
    speedPct: 10
  }
}, {
  title: '加拉赫：敌方受到的击破伤害提高13.2%',
  check: ({ params }) => params.team === true,
  data: {
    breakEnemydmg: 13.2
  }
}]

export const createdBy = 'Aluxes'
