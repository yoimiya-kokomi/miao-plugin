export const details = [{
  title: '普攻伤害',
  dmg: ({ talent, attr, calc }, { basic }) => {
    const hp = calc(attr.hp)
    const hpDmg = (talent.a['技能伤害']) * hp
    return basic(hpDmg, 'a')
  }
}, {
  title: '战技伤害',
  params: { q: true },
  dmg: ({ talent, attr, calc }, { basic }) => {
    const hp = calc(attr.hp)
    const hpDmg = (talent.e['技能伤害'] + talent.e['弹射伤害'] * 4) * hp
    return basic(hpDmg, 'e')
  }
}, {
  title: '追击伤害',
  params: { q: true },
  dmg: ({ talent, attr, calc }, { basic }) => {
    const hp = calc(attr.hp)
    const hpDmg = (talent.e['技能伤害'] + talent.e['弹射伤害'] * 4) * hp
    return basic(hpDmg, 't')
  }
}, {
  title: '终结技伤害',
  params: { q: true },
  dmg: ({ talent, attr, calc }, { basic }) => {
    const hp = calc(attr.hp)
    const hpDmg = (talent.q2['技能伤害']) * hp
    return basic(hpDmg, 'q2')
  }
}]

export const buffs = [{
  title: '终结技：【煞火缠身】状态下的敌方目标防御力降低[enemyDef]%，受到的伤害提高[enemydmg]%，暴击率提高[cpct]%，暴击伤害提高[cdmg]%',
  data: {
    enemyDef: ({ talent }) => talent.q['防御力降低'] * 100,
    enemydmg: ({ talent }) => talent.q['易伤提高'] * 100,
    cdmg: ({ talent }) => talent.q['暴击伤害提高'] * 100,
    cpct: 20
  }
}, {
  check: ({ params }) => params.q === true,
  title: '行迹-万淬心：我方目标造成的伤害提高[dmg]%，我方队伍中存在除千冶•刃之外的「虚无」命途角色时，使我方目标造成的终结技伤害提高[q2Dmg]%',
  tree: 3,
  data: {
    dmg: ({ cons }) => { return cons >= 4 ? 100 : 50 },
    q2Dmg: ({ cons }) => { return cons >= 4 ? 125 : 75 }
  }
}, {
  check: ({ params }) => params.q === true,
  title: '千冶刃1命：使敌方全体全属性抗性降低[kx]%',
  cons: 2,
  data: {
    kx: 20
  }
}, {
  title: '千冶刃2命：我方目标造成的追加攻击伤害提高[tDmg]%',
  cons: 2,
  data: {
    q2Dmg: 75,
    tDmg: 75
  }
}, {
  check: ({ params }) => params.q === true,
  title: '千冶刃4命：【万淬心】使我方目标造成的伤害额外提高50%',
  cons: 4,
  data: {
    dmg: 50
  }
}, {
  check: ({ params }) => params.q === true,
  title: '千冶刃6命：【千冶铸一，万劫烬灭】的伤害倍率提高为原倍率的[qMulti]%',
  cons: 6,
  data: {
    qMulti: 150
  }
}]

export const defDmgIdx = 3
export const mainAttr = 'hp,cpct,cdmg,speed'
export const createdBy = '欧阳青瓜'
