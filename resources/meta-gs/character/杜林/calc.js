export const details = [{
  title: 'Q白化法·如光流变总伤害',
  params: { LightShifts : true },
  dmg: ({ talent, attr }, dmg) => dmg(talent.q['白化法·如光流变伤害'], 'q')
}, {
  title: 'Q黑度法·如星阴燃总伤害',
  params: { StarsSmolder: true },
  dmg: ({ talent, attr }, dmg) => dmg(talent.q['黑度法·如星阴燃伤害'], 'q')
}, {
  title: 'Q「白焰之龙」伤害',
  params: { LightShifts : true },
  dmg: ({ talent, attr }, dmg) => dmg(talent.q['白焰之龙伤害'], 'q')
}, {
  title: 'Q「黑蚀之龙」伤害',
  params: { StarsSmolder: true },
  dmg: ({ talent, attr }, dmg) => dmg(talent.q['黑蚀之龙伤害'], 'q')
}, {
  title: 'Q「黑蚀之龙」蒸发伤害',
  params: { StarsSmolder: true },
  dmg: ({ talent, attr }, dmg) => dmg(talent.q['黑蚀之龙伤害'], 'q', 'vaporize')
}, {
  title: 'Q「黑蚀之龙」融化伤害',
  params: { StarsSmolder: true },
  dmg: ({ talent, attr }, dmg) => dmg(talent.q['黑蚀之龙伤害'], 'q', 'melt')
}]

export const defParams = { Hexenzirkel: true } // 魔女会成员
export const defDmgIdx = 5
export const mainAttr = 'atk,cpct,cdmg,mastery'

export const buffs = [{
  check: ({ params }) => params.LightShifts === true,
  title: '杜林天赋：获得【魔导·秘仪】效果时，队伍中附近的角色对敌人触发燃烧、超载、火元素扩散、火元素结晶反应后，或对处于燃烧状态下的敌人造成火元素伤害或草元素伤害时，' +
    '该敌人的火元素抗性与参与反应的对应元素抗性降低[kx]%',
  data: {
    kx: 20 * 1.75,
  }
}, {
  check: ({ params }) => params.StarsSmolder === true,
  title: '杜林天赋：获得【魔导·秘仪】效果时，蒸发反应造成的伤害提升[vaporize]%，融化反应造成的伤害提升[melt]%。',
  data: {
    vaporize: 40 * 1.75,
    melt: 40 * 1.75
  }
}, {
  title: '杜林天赋：施放元素爆发后，白焰之龙与黑蚀之龙的间歇性攻击造成伤害时，每100点攻击力都将额外造成相当于原本3%的伤害，至多通过这种方式额外造成相当于原本75%的伤害。',
  sort: 9,
  data: {
    multi: ({ calc, attr }) => Math.min(calc(attr.atk) / 100 * 3, 75)
  }
}, {
  check: ({ params }) => params.StarsSmolder === true,
  title: '杜林1命：施放元素爆发黑度法·如星阴燃后，将消耗2层「轮变启迪」，提升造成的伤害，提升值相当于杜林攻击力的[qPct]%。',
  cons: 1,
  data: {
    qPct: 150
  }
}, {
  title: '杜林2命：施放元素爆发后，放队伍中附近的角色对敌人触发蒸发、融化、燃烧、超载、火元素扩散或火元素结晶反应后，或对处于燃烧状态下的敌人造成火元素伤害或草元素伤害时，' +
    '队伍中附近的角色造成的火元素伤害与参与反应的对应元素伤害提升[dmg]%',
  cons: 2,
  data: {
    dmg: 50
  }
}, {
  title: '杜林4命：元素爆发伤害提升[qDmg]%',
  cons: 4,
  data: {
    qDmg: 40
  }
}, {
  title: '杜林6命：元素爆发伤害将无视敌人[qIgnore]%的防御力',
  cons: 6,
  data: {
    qIgnore: 30
  }
}, {
  check: ({ params }) => params.LightShifts === true,
  title: '杜林6命：元素爆发白化法·如光流变与「白焰之龙」命中敌人时，该敌人的防御力降低[enemyDef]%',
  cons: 6,
  data: {
    enemyDef: 30
  }
}, {
  check: ({ params }) => params.StarsSmolder === true,
  title: '杜林6命：元素爆发黑度法·如星阴燃与「黑蚀之龙」造成的伤害将额外无视敌人[qIgnore]%的防御力',
  cons: 6,
  data: {
    qIgnore: 40
  }
}]

export const createdBy = '冰翼'
