// punchline 是本次攻击实际计入的笑点/好活当赏，已包含光锥等来源。
const positive = value => Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0
const targets = params => Math.max(1, Math.min(5, Math.trunc(Number(params.enemyCount) || 1)))

export const defParams = {
  punchline: 100,
  ahaGlorious: true,
  ahaTalentBuff: true,
  elationCount: 1,
  ahaInTeam: true,
  teammateBanger: 0,
  enemyCount: 1,
  // 本次阿哈时刻中其他目标已造成的非真实伤害；不含阿哈自己的欢愉技。
  ahaMomentDamage: 0,
  ahaMomentAvgDamage: null
}

// 真实伤害不再过暴击、防御、抗性或增笑乘区。
export function momentDamage ({ talent, cons, params }, dmg) {
  const hit = dmg(talent.xe['欢愉伤害'], 'xe', 'elation')
  const count = targets(params)
  const ratio = talent.xe['真实伤害比例'] * (cons >= 4 ? 1.25 : 1)
  const other = positive(params.ahaMomentDamage)
  const otherAvg = positive(params.ahaMomentAvgDamage ?? params.ahaMomentDamage)
  return {
    dmg: hit.dmg + (hit.dmg * count + other) * ratio / count,
    avg: hit.avg + (hit.avg * count + otherAvg) * ratio / count
  }
}

// 欢愉负债占用生命上限，只有占用部分与当前生命重叠才立即流失生命。
// 输入均为同一个敌方目标的值，不能将全场伤害作为单体生命损失。
export function debtState ({ cons, params }) {
  const maxHp = positive(params.enemyMaxHp)
  const previous = Math.min(maxHp, positive(params.ahaPreviousDebt))
  const floor = cons >= 6 ? maxHp * 0.2 : 0
  const occupied = Math.min(maxHp, Math.max(previous, floor, Math.min(maxHp * 0.1, previous + positive(params.enemyHitHpLoss) * 0.25)))
  const remainingMaxHp = Math.max(0, maxHp - occupied)
  const hpAfterHit = Math.min(Math.max(0, maxHp - previous), positive(params.enemyHpAfterHit))
  return { occupied, remainingMaxHp, hpLoss: Math.max(0, hpAfterHit - remainingMaxHp) }
}

export const details = [{
  title: ({ params }) => `${params.punchline}好活普攻伤害`,
  dmg: ({ talent }, dmg) => dmg(talent.a['欢愉伤害'], 'a', 'elation')
}, {
  title: ({ params }) => `${params.punchline}好活战技追加攻击·单目标（不含令使）`,
  // 令使追加的20%伤害使用队友属性，不冒用阿哈的暴击和欢愉度。
  dmg: ({ talent }, dmg) => dmg(talent.e['追加攻击欢愉伤害'], 'e', 'elation')
}, {
  title: ({ params }) => `${params.punchline}好活终结技·对单全弹射`,
  params: { ahaGlorious: true },
  dmg: ({ talent }, dmg) => dmg(talent.q['全体欢愉伤害'] + talent.q['单次弹射欢愉伤害'] * talent.q['弹射次数'], 'q', 'elation')
}, {
  title: ({ params }) => `${params.punchline}笑点欢愉技·单目标直伤`,
  dmg: ({ talent }, dmg) => dmg(talent.xe['欢愉伤害'], 'xe', 'elation')
}, {
  title: ({ params }) => `${params.punchline}笑点欢愉技·${positive(params.ahaMomentDamage) ? '含队友记录' : '自身结算'}·单目标`,
  dmg: momentDamage
}, {
  title: '20笑点秘技额外回合·自身结算',
  params: { punchline: 20, ahaGlorious: false, ahaTalentBuff: false },
  dmg: momentDamage
}, {
  title: '欢愉负债·目标当前生命流失',
  check: ({ trees, params }) => trees['601'] && positive(params.enemyMaxHp) > 0 && Number.isFinite(params.enemyHpAfterHit),
  dmg: ds => ({ avg: debtState(ds).hpLoss })
}]

export const defDmgIdx = 4
export const mainAttr = 'speed,cpct,cdmg'

export const buffs = [{
  title: '本次攻击计入[punchline]笑点/好活当赏',
  data: { punchline: ({ params }) => positive(params.punchline) }
}, {
  title: '与祂共演：触发天赋后，全队暴击伤害提高[cdmg]%',
  check: ({ params }) => params.ahaTalentBuff === true,
  data: { cdmg: ({ talent }) => talent.t['全队暴击伤害提高'] * 100 }
}, {
  title: '欢愉万相：暴击率提高[cpct]%，无视[ignore]%防御力',
  check: ({ params }) => params.ahaGlorious === true,
  data: {
    cpct: ({ cons }) => cons >= 2 ? 20 : 12,
    ignore: ({ cons }) => cons >= 2 ? 60 : 30
  }
}, {
  title: '一魂：全队欢愉伤害增笑[merrymakes]%',
  cons: 1,
  data: { merrymakes: 15 }
}, {
  title: '四魂：额外计入队友共[punchline]点好活当赏',
  cons: 4,
  data: { punchline: ({ params }) => positive(params.teammateBanger) }
}, {
  title: '盒中蕴藏的世界：速度达到125/150时，欢愉度提高[joy]%',
  tree: 3,
  sort: 9,
  data: { joy: ({ attr, calc }) => calc(attr.speed) >= 150 ? 150 : calc(attr.speed) >= 125 ? 120 : 0 }
}]
