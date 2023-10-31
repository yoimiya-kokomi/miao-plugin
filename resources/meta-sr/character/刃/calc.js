export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '强化普攻(单体)',
  params: { ebuff: true },
  dmg: ({ talent, attr, calc }, { basic }) => {
    const td1 = talent.a2['攻击倍率']
    const td2 = talent.a2['生命倍率']
    const atk = calc(attr.atk)
    const hp = calc(attr.hp)
    return basic(td1 * atk + td2 * hp, 'a')
  }
}, {
  title: '强化普攻(扩散)',
  params: { ebuff: true },
  dmg: ({ talent, attr, calc }, { basic }) => {
    const td1 = talent.a2['攻击倍率'] + talent.a2['攻击倍率·相邻目标'] * 2
    const td2 = talent.a2['生命倍率'] + talent.a2['生命倍率·相邻目标'] * 2
    const atk = calc(attr.atk)
    const hp = calc(attr.hp)
    return basic(td1 * atk + td2 * hp, 'a')
  }
}, {
  title: '追加攻击',
  params: { ebuff: true },
  dmg: ({ talent, attr, calc }, { basic }) => {
    const td1 = talent.t['攻击倍率']
    const td2 = talent.t['生命倍率']
    const atk = calc(attr.atk)
    const hp = calc(attr.hp)
    return basic(td1 * atk + td2 * hp, 't')
  }
}, {
  title: '终结技伤害(单体)',
  params: { ebuff: true },
  dmg: ({ talent, attr, calc }, { basic }) => {
    const td1 = talent.q['攻击倍率']
    const td2 = talent.q['生命倍率']
    const td3 = talent.q['已损失生命值倍率']
    const atk = calc(attr.atk)
    const hp = calc(attr.hp)
    return basic(td1 * atk + td2 * hp + td3 * hp * 0.9, 'q')
  }
}, {
  title: '终结技伤害(扩散)',
  params: { ebuff: true },
  dmg: ({ talent, attr, calc }, { basic }) => {
    const td1 = talent.q['攻击倍率'] + talent.q['攻击倍率·相邻目标'] * 2
    const td2 = talent.q['生命倍率'] + talent.q['生命倍率·相邻目标'] * 2
    const td3 = talent.q['已损失生命值倍率'] + talent.q['已损失生命值倍率·相邻目标'] * 2
    const atk = calc(attr.atk)
    const hp = calc(attr.hp)
    return basic(td1 * atk + td2 * hp + td3 * hp * 0.9, 'q')
  }
}]

export const defDmgIdx = 2
export const mainAttr = 'hp,atk,cpct,cdmg,speed'

export const buffs = [{
  check: ({ params }) => params.ebuff === true,
  title: '地狱变：造成伤害提高[dmg]%',
  data: {
    dmg: ({ talent }) => talent.e['伤害提高'] * 100
  }
}, {
  title: '行迹-坏劫隳亡：天赋释放的追加攻击伤害提高20%',
  tree: 2,
  data: {
    tDmg: 20
  }
}, {
  title: '刃1命：终结技对指定敌方单体造成伤害值提高[qPlus]',
  cons: 1,
  data: {
    qPlus: ({ attr, calc }) => 1.5 * calc(attr.hp) * 0.9
  }
}, {
  check: ({ params }) => params.ebuff === true,
  title: '刃2命：处于【地狱变】状态时，暴击率提高15%',
  cons: 2,
  data: {
    cpct: 15
  }
}, {
  title: '刃4命：生命值降低至小于等于50%时，提高生命值上限，满Buff下提高40%',
  cons: 4,
  data: {
    hpPct: 40
  }
}, {
  title: '刃6命：追加攻击造成的伤害值额外提高[tPlus]',
  cons: 6,
  data: {
    tPlus: ({ attr, calc }) => calc(attr.hp) * 0.5
  }
}]

export const createdBy = 'Aluxes'
