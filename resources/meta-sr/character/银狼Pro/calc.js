export const details = [
  {
    title: "普攻伤害",
    dmg: ({ talent }, dmg) => dmg(talent.a["技能伤害"], "a")
  }, {
    title: "战技伤害",
    dmg: ({ talent }, dmg) => dmg(talent.e["技能伤害"], "e")
  }, {
    title: ({ params }) => `终结技伤害(${params.qTargetCount}目标)`,
    dmg: ({ talent, params }, dmg) => dmg(talent.q["技能伤害"] * params.qTargetCount, "q")
  }, {
    title: ({ params }) => `终结技+4命(${params.qTargetCount}目标, ${params.debuffCount}层Buff)`,
    cons: 4,
    dmg: ({ talent, params }, dmg) => {
      const qMultiplier = talent.q["技能伤害"];
      const c4Multiplier = Math.min(params.debuffCount, 5) * 0.2;
      const totalMultiplier = qMultiplier + c4Multiplier;
      return dmg(totalMultiplier * params.qTargetCount, "q");
    }
  }, {
    title: "击破纠缠伤害(10韧性怪)",
    dmg: ({ }, { reaction }) => {
      return {
        avg: reaction("entanglement").avg * 5 * (10 + 2) / 4
      }
    }
  }
]

export const defParams = {
  debuffCount: 5, // 敌人有5个负面buff
  qTargetCount: 3 // 终结技命中3个目标
}

export const defDmgIdx = 3
export const mainAttr = "atk,cpct,cdmg,effPct"

export const buffs = [
  {
    title: "天赋-缺陷：防御力降低[enemyDef]%",
    data: {
      enemyDef: ({ talent }) => talent.t["防御力降低"] * 100
    }
  }, {
    title: "战技：添加弱点降低单属性抗性20%，并降低全属性抗性[kx]%",
    data: {
      kx: ({ talent }) => 20 + talent.e["抗性降低"] * 100
    }
  }, {
    title: "终结技：群体防御力降低[enemyDef]%",
    data: {
      enemyDef: ({ talent }) => talent.q["防御力降低"] * 100
    }
  }, {
    title: "行迹-旁注：效果命中转化为攻击力[atkPct]%",
    tree: 3,
    data: {
      atkPct: ({ attr, calc }) => Math.min(Math.floor(calc(attr.effPct) / 10) * 10, 50)
    }
  }, {
    title: "银狼Pro2命：敌人受到的伤害提高[enemydmg]%",
    cons: 2,
    data: {
      enemydmg: 20
    }
  }, {
    title: ({ params }) => `银狼Pro6命：造成伤害提高[dmg]%(${params.debuffCount}层)`,
    cons: 6,
    data: {
      dmg: ({ params }) => Math.min(params.debuffCount * 20, 100)
    }
  }
]
