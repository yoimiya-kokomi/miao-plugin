export const details = [
  {
    title: "战技直伤(扩散)",
    dmg: ({ talent }, dmg) => dmg(talent.e["技能伤害"] + talent.e["相邻目标伤害"] * 2, "e")
  }, {
    title: "追加攻击直伤",
    dmg: ({ talent }, dmg) => dmg(talent.t["技能伤害"], "t")
  }, {
    title: "终结技直伤",
    dmg: ({ talent }, dmg) => dmg(talent.q["技能伤害"], "q")
  }, {
    title: "纯DOT伤害",
    params: { isDot: true },
    dmg: ({ talent, cons }, dmg) => {
      const plusDot = cons >= 6 ? 1.56 : 0
      return dmg(talent.q["持续伤害"] + plusDot, "dot", "skillDot")
    }
  }, {
    title: "行迹·荆棘-追击引爆DOT",
    tree: 3,
    params: { isDot: true },
    dmg: ({ talent, cons }, dmg) => {
      const tDmg = dmg(talent.t["技能伤害"], "t")
      const plusDot = cons >= 6 ? 1.56 : 0
      // 荆棘行迹使追击能引爆80%的DOT伤害
      const dotDmg = dmg((talent.q["持续伤害"] + plusDot) * 0.8, "dot", "skillDot")

      return {
        dmg: tDmg.dmg + dotDmg.avg,
        avg: tDmg.avg + dotDmg.avg
      }
    }
  }, {
    title: "战技引爆DOT(全)",
    params: { isDot: true },
    dmg: ({ talent, cons }, dmg) => {
      const eDmg = dmg(talent.e["技能伤害"] + talent.e["相邻目标伤害"] * 2, "e")
      const plusDot = cons >= 6 ? 1.56 : 0
      const dotBase = talent.q["持续伤害"] + plusDot

      // 主目标引爆
      const mainDetonate = dmg(dotBase * talent.e["单体持续伤害比例"], "dot", "skillDot")
      // 相邻目标引爆
      const adjDetonate = dmg(dotBase * talent.e["相邻目标持续伤害比例"], "dot", "skillDot")

      return {
        dmg: eDmg.dmg + mainDetonate.avg + adjDetonate.avg * 2,
        avg: eDmg.avg + mainDetonate.avg + adjDetonate.avg * 2
      }
    }
  }, {
    title: "终结技引爆DOT",
    params: { isDot: true },
    dmg: ({ talent, cons }, dmg) => {
      const qDmg = dmg(talent.q["技能伤害"], "q")
      const plusDot = cons >= 6 ? 1.56 : 0
      const dotDmg = dmg((talent.q["持续伤害"] + plusDot) * talent.q["持续伤害比例"], "dot", "skillDot")

      return {
        dmg: qDmg.dmg + dotDmg.avg,
        avg: qDmg.avg + dotDmg.avg
      }
    }
  }
]

export const mainAttr = "atk,cpct,cdmg,effPct"
export const defDmgIdx = 6

export const buffs = [
  {
    title: "行迹-荆棘：天赋追加攻击额外造成80%引爆伤害",
    tree: 3
  }, {
    title: "卡芙卡Pro1命：施放攻击时，使目标受到的持续伤害提高[dotEnemydmg]%",
    cons: 1,
    check: ({ params }) => params.isDot === true,
    data: {
      dotEnemydmg: 30
    }
  }, {
    title: "卡芙卡Pro2命：在场时，我方全体造成的持续伤害提高[dotDmg]%",
    cons: 2,
    check: ({ params }) => params.isDot === true,
    data: {
      dotDmg: 33
    }
  }, {
    title: "卡芙卡Pro6命：触电伤害倍率提高156%",
    cons: 6
  }
]
