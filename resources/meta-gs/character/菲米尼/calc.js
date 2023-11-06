export const details = [{
  title: '普攻首段伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['一段伤害'], 'a', 'phy')
}, {
  title: 'E伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['上挑攻击伤害'], 'e')
}, {
  title: '0阶E伤害',
  dmg: ({ talent }, { dynamic }) => dynamic(talent.e['零阶高压粉碎伤害'], 'e', { dynamicDmg: 40, dynamicCpct: 15 })
}, {
  title: '4阶E伤害',
  dmg: ({ talent }, { dynamic }) => dynamic(talent.e['四阶高压粉碎伤害'], 'e', { dynamicPhy: 40, dynamicCpct: 15 }, 'phy')
}, {
  title: 'Q伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}, {
  title: 'Q状态·冰伤流4轮EEA',
  check: ({ calc, attr }) => calc(attr.phy) < 58,
  dmgKey: 'q',
  dmg: ({ talent }, dmg) => {
    let normalEDmg = dmg(talent.e['上挑攻击伤害'], 'e')
    let e2Dmg = dmg.dynamic(talent.e['零阶高压粉碎伤害'], 'e', { dynamicDmg: 40, dynamicCpct: 15 })
    let a1Dmg = dmg(talent.a['一段伤害'], 'a', 'phy')
    return {
      dmg: (normalEDmg.dmg + e2Dmg.dmg + a1Dmg.dmg) * 4,
      avg: (normalEDmg.avg + e2Dmg.avg + a1Dmg.avg) * 4
    }
  }
}, {
  title: 'Q状态·物理流3轮EAAAA',
  check: ({ calc, attr }) => calc(attr.phy) >= 58,
  dmgKey: 'q',
  dmg: ({ talent }, dmg) => {
    let normalEDmg = dmg(talent.e['上挑攻击伤害'], 'e')
    let a1Dmg = dmg(talent.a['一段伤害'], 'a', 'phy')
    let a2Dmg = dmg(talent.a['二段伤害'], 'a', 'phy')
    let e2Dmg = dmg.dynamic(talent.e['四阶高压粉碎伤害'], 'e', { dynamicPhy: 40, dynamicCpct: 15 }, 'phy')
    return {
      dmg: (normalEDmg.dmg + a1Dmg.dmg * 2 + a2Dmg.dmg + e2Dmg.dmg) * 3,
      avg: (normalEDmg.avg + a1Dmg.avg * 2 + a2Dmg.avg + e2Dmg.avg) * 3
    }
  }
}]

export const defDmgKey = 'q'
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '天赋-并流式冷凝机关：触发碎冰反应后，使浮冰增压·高压粉碎造成的伤害提高40%'
}, {
  title: '菲米尼1命：浮冰增压·高压粉碎的暴击率提高15%',
  cons: 1
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

export const createdBy = 'Aluxes'
