import { Format } from "#miao"

export const details = [
  {
    title: "战技伤害(直伤)",
    dmg: ({ talent }, dmg) => dmg(talent.e["技能伤害"], "e")
  }, {
    title: "战技超击破(未击破转化)",
    dmg: ({ talent }, dmg) => {
      let sb = dmg.reaction("superBreak")
      return {
        avg: Format.comma(sb.avg * 9.0, 0),
        type: "text"
      }
    }
  }, {
    title: "终结技伤害",
    dmg: ({ talent }, dmg) => dmg(talent.q["技能伤害"], "q")
  }, {
    title: "天赋追击伤害(5段)",
    dmg: ({ talent }, dmg) => dmg(talent.t["追加攻击伤害"] * 5, "t")
  }, {
    title: "天赋追击超击破(5段)",
    dmg: ({ talent, cons }, dmg) => {
      let sb = dmg.reaction("superBreak")
      let mult = talent.t["弱点状态超击破伤害"] + (cons >= 1 ? 0.4 : 0)
      return {
        avg: Format.comma(sb.avg * 11.25 * mult, 0),
        type: "text"
      }
    }
  }, {
    title: "战技完整伤害(含超击破)",
    dmg: ({ talent }, dmg) => {
      let eDmg = dmg(talent.e["技能伤害"], "e")
      let sb = dmg.reaction("superBreak")
      let sbDmg = sb.avg * 9.0
      return {
        dmg: eDmg.dmg + sbDmg,
        avg: eDmg.avg + sbDmg
      }
    }
  }, {
    title: "天赋完整伤害(含超击破)",
    dmg: ({ talent, cons }, dmg) => {
      let tDmg = dmg(talent.t["追加攻击伤害"] * 5, "t")
      let sb = dmg.reaction("superBreak")
      let mult = talent.t["弱点状态超击破伤害"] + (cons >= 1 ? 0.4 : 0)
      let sbDmg = sb.avg * 11.25 * mult
      return {
        dmg: tDmg.dmg + sbDmg,
        avg: tDmg.avg + sbDmg
      }
    }
  }
]

export const defDmgIdx = 6
export const mainAttr = "atk,cpct,cdmg,stance"

export const buffs = [
  {
    title: "终结技：敌方防御力降低[enemyDef]%",
    data: {
      enemyDef: ({ talent }) => talent.q["防御力降低"] * 100
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

export const createdBy = '白咩'
