import { Format } from "#miao"

export const details = [
  {
    title: "战技伤害(直伤)",
    dmg: ({ talent }, dmg) => dmg(talent.e["技能伤害"], "e")
  }, {
    title: "战技超击破伤害(主目标)",
    dmg: ({ talent, cons }, { reaction }) => {
      const bro = talent.t["超击破伤害"] + (cons >= 1 ? 0.4 : 0)
      return {
        avg: reaction("superBreak").avg / 0.9 * 1.5 * bro
      }
    }
  }, {
    title: "终结技伤害",
    dmg: ({ talent }, dmg) => dmg(talent.q["技能伤害"], "q")
  }, {
    title: "天赋追击伤害",
    dmg: ({ talent }, dmg) => dmg(talent.t["追加攻击伤害"] * 5, "t")
  }, {
    title: "天赋追击超击破伤害",
    dmg: ({ talent }, { reaction }) => {
      const bro = talent.t["弱点状态超击破伤害"]
      return {
        avg: reaction("superBreak").avg / 0.9 * 1.5 * bro
      }
    }
  }, {
    title: "行迹提高队友击破特攻",
    dmg: ({ attr, calc }) => {
      return {
        avg: Format.comma(calc(attr.stance) * 0.24 + 50) + "%",
        type: "text"
      }
    }
  }
]

export const defDmgIdx = 5
export const mainAttr = "atk,stance"

export const buffs = [
  {
    title: "终结技：敌方防御力降低[enemyDef]%",
    data: {
      enemyDef: ({ talent }) => talent.q["防御力降低"] * 100
    }
  }, {
    title: "行迹-弃旧，恋新：我方目标为敌方目标添加弱点时，速度提高[speedPct]%",
    tree: 3,
    data: {
      speedPct: 30
    }
  }, {
    title: "1命：天赋超击破伤害倍率额外提高40%",
    cons: 1
  }, {
    title: "2命：敌方全体全属性抗性降低20%",
    cons: 2,
    data: {
      kx: 20
    }
  }, {
    title: "4命：天赋追击使敌方受到的伤害提高12%",
    cons: 4,
    data: {
      enemydmg: 12
    }
  }, {
    title: "6命：【共舞者】(自身)击破特攻提高150%",
    cons: 6,
    data: {
      stance: 150
    }
  }
]

export const createdBy = "白咩"