export const details = [{
  title: 'E伤害',
  dmgKey: 'e',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: 'Q结束伤害',
  params: { cons1: true },
  dmgKey: 'q',
  dmg: ({ talent }, dmg) => dmg(talent.q['最后造成伤害'], 'q')
}, {
  title: 'Q最多造成伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['最多造成伤害'], 'q')
}, {
  title: '天赋追加伤害',
  dmg: ({ talent, cons }, dmg) => {
    let talentConfig = cons >= 6 ? 'q,t' : 't'
    let tdmg = dmg(talent.t['追加攻击伤害'], `${talentConfig}`)
    return tdmg
  }
}]

export const defDmgIdx = 1
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '雷狩：发动天赋攻击时使自身造成的伤害提高[dmg]%',
  data: {
    dmg: ({ talent }) => talent.t['造成伤害提高'] * 100
 }
}, {
  title: '解形：追加攻击的暴击伤害提高[tCdmg]%',
  tree: 2,
  data: {
    tCdmg: 36
  }
}, {
  title: '电举：施放战技时，攻击力提高[atkPct]%',
  tree: 3,
  data: {
    atkPct: 48
  }
}, {
  check: ({ params }) => params.cons1 === true,
  title: '飞霄1魂：5层buff，使终结技伤害额外提高[qPlus]',
  cons: 1,
  data: {
    qPlus: ({ talent, attr, calc }) => calc(attr.atk) * talent.q['最后造成伤害'] * 10 / 100 * 5
 }
}, {
  title: '飞霄4魂：发动天赋的追加攻击时速度提高[speedPct]%',
  cons: 4,
  data: {
    speedPct: 8
 }
}, {
  title: '飞霄6魂：终结技抗性穿透提高[qKx]%,天赋的追加攻击伤害同时视为终结技伤害，并且伤害提高[tPlus]',
  cons: 6,
  data: {
    qKx: 20,
    tPlus: ({ attr, calc }) => calc(attr.atk) * 140 / 100
 }
}]

export const createdBy = 'liangshi'
