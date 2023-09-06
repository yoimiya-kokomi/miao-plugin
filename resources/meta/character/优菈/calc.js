let tmpDmg = false

export const details = [{
  title: '普攻尾段2次伤害',
  params: { e: false },
  dmg: ({ talent }, dmg) => dmg(talent.a['五段伤害'], 'a', 'phy')
}, {
  title: 'E0层长按伤害',
  params: { gj: false },
  dmg: ({ talent }, dmg) => {
    tmpDmg = dmg(talent.e['长按伤害'], 'e')
    return tmpDmg
  }
}, {
  title: 'E2层长按伤害',
  params: { gj: true },
  dmg: ({ talent }, dmg) => {
    let e = tmpDmg
    let g = dmg(talent.e['冰涡之剑伤害'], 'e')
    let j = dmg(talent.q['光降之剑基础伤害'], 'e', 'phy')
    return {
      dmg: e.dmg * 1 + g.dmg * 2 + j.dmg * 0.5,
      avg: e.avg * 1 + g.avg * 2 + j.avg * 0.5
    }
  }
}, ({ cons, weapon }) => {
  let buffCount = 12
  if (weapon.name === '松籁响起之时') {
    buffCount = 13
    if (weapon.affix >= 4) {
      buffCount = 14
    }
  }
  if (cons === 6) {
    buffCount = buffCount + 11
  }
  return {
    title: `光降之剑${buffCount}层伤害`,
    params: { gj: true },
    dmg: ({ talent }, dmg) => dmg(talent.q['光降之剑基础伤害'] + talent.q['每层能量伤害'] * buffCount, 'q', 'phy')
  }
}]

export const defDmgIdx = 3
export const mainAttr = 'atk,cpct,cdmg'
export const enemyName = '魔偶/女士/雷神'

export const buffs = [{
  title: '优菈天赋：E消耗冰涡之剑后降低抗性[kx]%',
  check: ({ params }) => params.gj !== false,
  data: {
    kx: ({ talent }) => talent.e['冰元素抗性降低']
  }
}, {
  title: '优菈一命：消耗冷酷之心后物理伤害提高30%',
  cons: 1,
  data: {
    phy: ({ params }) => params.gj ? 30 : 0
  }
}, {
  title: '优菈四命：对生命值低于50%的敌人，光降之剑造成的伤害提高25%',
  cons: 4,
  data: {
    qDmg: 25
  }
}, {
  title: '优菈6命：光降之剑额外获得5层Buff，普攻/E有50%概率额外获得1层',
  cons: 6
}]
