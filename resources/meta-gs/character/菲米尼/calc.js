let normalEDmg = false

export const details = [{
  title: '普攻首段伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['一段伤害'], 'a', 'phy')
}, {
  title: 'E伤害',
  dmg: ({ talent }, dmg) => {
    normalEDmg = dmg(talent.e['上挑攻击伤害'], 'e')
    return normalEDmg
  }
}, {
  title: '0阶E伤害',
  params: { e: true },
  dmg: ({ talent }, dmg) => dmg(talent.e['零阶高压粉碎伤害'], 'e')
}, {
  title: '4阶E伤害',
  params: { e: true },
  dmg: ({ talent }, dmg) => dmg(talent.e['四阶高压粉碎伤害'], 'e', 'phy')
}, {
  title: 'Q伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}, {
  title: 'Q状态·冰伤流4轮EEA总伤害',
  check: ({ calc, attr }) => calc(attr.dmg) >= 46,
  dmgKey: 'q',
  params: { e: true },
  dmg: ({ talent }, dmg) => {
    let e2Dmg = dmg(talent.e['零阶高压粉碎伤害'], 'e')
    let a1Dmg = dmg(talent.a['一段伤害'], 'a', 'phy')
    return {
      dmg: (normalEDmg.dmg + e2Dmg.dmg + a1Dmg.dmg) * 4,
      avg: (normalEDmg.avg + e2Dmg.avg + a1Dmg.avg) * 4
    }
  }
}, {
  title: 'Q状态·物理流3轮EAAAA总伤害',
  check: ({ calc, attr }) => calc(attr.dmg) < 46,
  dmgKey: 'q',
  params: { e: true },
  dmg: ({ talent }, dmg) => {
    let a1Dmg = dmg(talent.a['一段伤害'], 'a', 'phy')
    let a2Dmg = dmg(talent.a['二段伤害'], 'a', 'phy')
    let e2Dmg = dmg(talent.e['四阶高压粉碎伤害'], 'e', 'phy')
    return {
      dmg: (normalEDmg.dmg + a1Dmg.dmg * 2 + a2Dmg.dmg + e2Dmg.dmg) * 3,
      avg: (normalEDmg.avg + a1Dmg.avg * 2 + a2Dmg.avg + e2Dmg.avg) * 3
    }
  }
}]

export const defDmgKey = 'q'
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '天赋-并流式冷凝机关：触发碎冰反应后，使浮冰增压·高压粉碎造成的伤害提高[eDmg]%',
  check: ({ params }) => params.e === true,
  data: {
    eDmg: 40
  }
}, {
  title: '菲米尼1命：浮冰增压·高压粉碎的暴击率提高15%',
  check: ({ params }) => params.e === true,
  cons: 1,
  data: {
    eCpct: 15
  }
}, {
  title: '菲米尼4命：触发冰冻、碎冰、超导反应后，满层Buff提升攻击力[atkPct]%',
  cons: 4,
  data: {
    atkPct: 18
  }
}, {
  title: '菲米尼6命：触发冰冻、碎冰、超导反应后，满层Buff提升暴击伤害[cdmg]%',
  cons: 6,
  data: {
    cdmg: 36
  }
}]
