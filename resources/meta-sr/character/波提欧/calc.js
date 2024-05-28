export const details = [{
  title: '强化普攻伤害',
  params: { eBuff: true },
  dmg: ({ talent }, dmg) => dmg(talent.a2['技能伤害'], 'a')
}, {
  title: '终结技伤害',
  params: { eBuff: true },
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}, {
  title: '两层口袋·击破伤害(10韧性怪)',
  dmg: ({ talent, cons }, { reaction }) => {
    let extraTd = cons < 6 ? 0 : 0.4
    return {
      avg: reaction('physicalBreak').avg / 0.9 * (10 + 2) / 4 * (talent.t['2层伤害'] + extraTd)
    }
  }
}, {
  title: '两层口袋·最大击破伤害',
  dmg: ({ talent, cons }, { reaction }) => {
    let extraTd = cons < 6 ? 0 : 0.4
    return {
      avg: reaction('physicalBreak').avg / 0.9 * (16 + 2) / 4 * (talent.t['2层伤害'] + extraTd)
    }
  }
}, {
  title: '三层口袋·击破伤害(10韧性怪)',
  dmg: ({ talent, cons }, { reaction }) => {
    let extraTd = cons < 6 ? 0 : 0.4
    return {
      avg: reaction('physicalBreak').avg / 0.9 * (10 + 2) / 4 * (talent.t['3层伤害'] + extraTd)
    }
  }
}, {
  title: '三层口袋·最大击破伤害',
  dmg: ({ talent, cons }, { reaction }) => {
    let extraTd = cons < 6 ? 0 : 0.4
    return {
      avg: reaction('physicalBreak').avg / 0.9 * (16 + 2) / 4 * (talent.t['3层伤害'] + extraTd)
    }
  }
}]

export const defDmgIdx = 5
export const mainAttr = 'atk,stance,cpct,cdmg,dmg'

export const buffs = [{
  title: '战技Buff：处于【绝命对峙】的敌方受到的伤害提高[enemydmg]%',
  check: ({ params }) => params.eBuff === true,
  data: {
    enemydmg: ({ talent }) => talent.e['伤害提高'] * 100
  }
}, {
  title: '行迹-幽灵装填：基于击破特攻，提高自身暴击率[cpct]%、暴击伤害[cdmg]%',
  tree: 1,
  sort: 9,
  data: {
    cpct: ({ attr }) => Math.min(attr.stance * 0.1, 30),
    cdmg: ({ attr }) => Math.min(attr.stance * 0.5, 150)
  }
}, {
  title: '波提欧1命：造成伤害时无视地方目标[ignore]%的防御力',
  cons: 1,
  data: {
    ignore: 16
  }
}, {
  title: '波提欧2命：处于【绝命对峙】并获得口袋时，击破特攻提高[stance]%',
  check: ({ params }) => params.eBuff === true,
  cons: 2,
  data: {
    stance: 30
  }
}, {
  title: '波提欧4命：处于【绝命对峙】的目标受到的伤害额外提高[enemydmg]%',
  check: ({ params }) => params.eBuff === true,
  cons: 4,
  data: {
    enemydmg: 12
  }
}, {
  title: '波提欧6命：造成击破伤害时，对目标额外造成等同于原伤害倍率的40%的击破伤害',
  cons: 6
}]

export const createdBy = 'Aluxes'
