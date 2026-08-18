import { Format } from '#miao'

// 气氛值：2命前为44点，2命后（含2命）为70点
const getAtmosphere = (cons) => cons >= 2 ? 70 : 44

export const details = [{
  title: '忆灵攻击伤害',
  dmg: ({ talent, cons, calc, attr }, { basic }) => basic(calc(attr.hp) * 0.7 * talent.me['技能伤害'] * (cons >= 6 ? 2 : 1), 'me')
}, {
  title: '攻击力提高',
  dmg: ({ cons, calc, attr }) => {
    return {
      // 最多保留一位小数
      avg: Math.round(calc(attr.hp) * (0.16 + getAtmosphere(cons) * 0.004) * 10) / 10,
      type: 'text'
    }
  }
}, {
  title: '爆伤提高',
  dmg: ({ cons }) => {
    return {
      avg: Format.percent(0.4 + getAtmosphere(cons) * 0.015),
      type: 'text'
    }
  }
}, {
  title: '无视防御力',
  dmg: ({ talent, cons }) => {
    return {
      avg: Format.percent(talent.t['无视防御'] + getAtmosphere(cons) * 0.005),
      type: 'text'
    }
  }
}]

export const defDmgIdx = 0
export const defParams = { Memosprite: true }
export const mainAttr = 'hp,speed,cpct,cdmg'

export const buffs = [{
  title: '行迹-重构谐乐：知更鸟•晴歌与「晴空乐手」的暴击率提高[cpct]%',
  tree: 3,
  data: {
    cpct: 50
  }
}, {
  title: '忆灵天赋-扑翅雀跃的和声：处于【Fever】状态时，知更鸟•晴歌与自身造成的伤害提高[dmg]%（气氛值[_atmosphere]点）',
  data: {
    _atmosphere: ({ cons }) => getAtmosphere(cons),
    dmg: ({ talent, cons }) => (talent.mt['伤害提高1'] + getAtmosphere(cons) * talent.mt['伤害提高2']) * 100
  }
}, {
  check: ({ params }) => params.Memosprite === true,
  title: '忆灵天赋-扑翅雀跃的和声：「晴空乐手」在场时，敌方全体受到的伤害提高[enemydmg]%（按3名成员计算）',
  data: {
    enemydmg: ({ talent }) => talent.mt['受到的伤害提高3'] * 100
  }
}, {
  title: '天赋-巡游在无界的天空：结界内我方目标造成伤害时无视敌方目标[ignore]%防御力（气氛值[_atmosphere]点）',
  data: {
    _atmosphere: ({ cons }) => getAtmosphere(cons),
    ignore: ({ talent, cons }) => (talent.t['无视防御'] + getAtmosphere(cons) * 0.005) * 100
  }
}, {
  title: '知更鸟•晴歌2魂：我方目标的全属性抗性穿透提高[kx]%',
  cons: 2,
  data: {
    kx: 18
  }
}]
