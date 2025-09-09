export const createdBy = "77惨惨77"
export const defDmgIdx = 3
export const mainAttr = "atk,speed,effPct"
export const details = [{
  title: "普攻伤害",
  dmg: ({ talent }, dmg) => dmg(talent.a["技能伤害"], "a"),
}, {
  title: "战技伤害",
  dmg: ({ talent }, dmg) => dmg(talent.e["技能伤害"], "e"),
}, {
  title: "终结技直伤",
  dmg: ({ talent }, dmg) => dmg(talent.q["技能伤害"], "q"),
}, {
  title: "常态dot(结界下保守)",
  params: { isDot: true },
  dmg: ({ talent, attr, cons, calc }, { basic }) => {
    let other = basic((cons>0 ? 6 : 3) * talent.t['持续伤害'] * calc(attr.atk),'dot','skillDot',{ dynamicDmg: -attr.staticAttr.dmg.plus })
    let phy = basic((cons>0 ? 2 : 1) * talent.t['持续伤害上限'] * calc(attr.atk),'dot','skillDot') 
    let td = talent.q['持续伤害'] + (cons===6 ? 0.2 : 0)
    let trig = basic((cons===6 ? 12 : (cons>0 ? 8 : 5)) * td * calc(attr.atk), 'dot', 'skillDot')
    logger.info(`\n单个非物理dot:${other.avg/3}\n物理dot:${phy.avg}\n`)
    return {avg: other.avg + phy.avg + trig.avg}
  },
}, {
  check: ({ trees }) => trees['102'] === true,
  title: "终结技引爆伤害(保守)",
  params: { isDot: true, Ultimate: true },
  dmg: ({ talent, attr, cons, calc }, { basic }) => {
    let other = basic((cons>0 ? 6 : 3) * talent.t['持续伤害'] * calc(attr.atk),'dot','skillDot',{ dynamicDmg: -attr.staticAttr.dmg.plus })
    let phy = basic((cons>0 ? 2 : 1) * talent.t['持续伤害上限'] * calc(attr.atk),'dot','skillDot') 
    let td = talent.q['持续伤害'] + (cons===6 ? 0.2 : 0)
    let trig = basic((cons===6 ? 12 : (cons>0 ? 8 : 5)) * td * calc(attr.atk), 'dot', 'skillDot')
    return {avg: 1.5*(other.avg + phy.avg + trig.avg)}
  },
},]
export const buffs = [{
  check: ({ attr, calc }) => calc(attr.effPct) > 75,
  title: "卡芙卡额外能力-折磨：效果命中大于75%时, 攻击力提高[atkPct]%",
  data: {
    atkPct: 100,
  },
}, {
  title: "战技：有100%的基础概率使敌方全体受到的伤害提高[Enemydmg]%，持续3回合",
  data: {
    Enemydmg: ({ talent }) => talent.e["受到的伤害提高"] * 100,
  },
}, {
  title: "结界：使敌方目标攻击力降低15%，防御力降低[enemyDef]%",
  data: {
    enemyDef: ({ talent }) => talent.q["防御力降低"] * 100,
  },
}, {
  check: ({ params }) => params.Ultimate === true,
  title: "额外能力-盛会的泡沫：海瑟音施放终结技时按照原伤害150%的比例引爆所有的持续伤害。",
  tree: 2,
}, {
  title: "额外能力-珍珠的琴弦：若海瑟音的效果命中高于60%，每超过10%可使自身造成的伤害提高15%，已提高[dmg]%。",
  tree: 3,
  data: {
    dmg: ({ attr, calc }) => Math.floor(Math.max(0, calc(attr.effPct)-60)/10) * 15,
  },
}, {
  title: "海瑟音1魂：在场时，我方目标造成的持续伤害为原伤害的116%, 天赋dot数量翻倍",
  cons: 1,
  data: {
    multi: 16,
  },
}, {
  title: "海瑟音4魂：结界持续期间，使敌方全体全属性抗性降低20%。",
  cons: 4,
  data: {
    kx: 20,
  },
}, {
  title: "海瑟音6魂：结界持续期间，每回合开始时或我方目标单次攻击后，触发海瑟音物理持续伤害效果的次数上限提高至12次，且造成的伤害倍率提高20%。",
  cons: 6,
},]
