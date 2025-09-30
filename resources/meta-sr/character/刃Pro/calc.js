export const details = [
  {
    title: "普攻伤害",
    dmg: ({ talent, attr, calc }, { basic }) => {
      return basic(talent.a["技能伤害"] * calc(attr.hp), "a")
    }
  }, {
    title: "【地狱变】强化普攻(扩散)",
    params: { ebuff: true },
    dmg: ({ talent, attr, calc }, { basic }) => {
      const hp = calc(attr.hp)
      const hpDmg = (talent.a2["技能伤害"] + talent.a2["相邻目标伤害"] * 2) * hp
      return basic(hpDmg, "a")
    }
  }, {
    title: ({ params }) => `天赋追加攻击(群伤, ${params.tTargetCount}目标)`,
    params: { ebuff: true },
    dmg: ({ talent, attr, calc, params }, { basic }) => {
      const hp = calc(attr.hp)
      const hpDmg = talent.t["追加攻击伤害"] * hp * params.tTargetCount
      return basic(hpDmg, "t")
    }
  }, {
    title: ({ params }) => `终结技(扩散, ${params.lostHp * 100}%已损失生命)`,
    params: { ebuff: true },
    dmg: ({ talent, attr, calc, params }, { basic }) => {
      const hp = calc(attr.hp)
      const hpDmg = (talent.q["生命上限伤害"] + talent.q["相邻目标•生命上限伤害"] * 2) * hp
      const lostHpDmg = (talent.q["累计已损生命伤害"] + talent.q["相邻目标•累计已损生命伤害"] * 2) * hp * params.lostHp
      return basic(hpDmg + lostHpDmg, "q")
    }
  }, {
    title: ({ params }) => `1命强化普攻(扩散, ${params.lostHp * 100}%已损失生命)`,
    cons: 1,
    params: { ebuff: true },
    dmg: ({ talent, attr, calc, params }, { basic }) => {
        const hp = calc(attr.hp)
        const hpDmg = (talent.a2["技能伤害"] + talent.a2["相邻目标伤害"] * 2) * hp
        const cons1Dmg = talent.q["累计已损生命伤害"] * 1.5 * hp * params.lostHp
        return basic(hpDmg + cons1Dmg, "a")
    }
  }
]

export const defParams = {
  ebuff: true,      // 处于【地狱变】状态
  lostHp: 0.9,      // 已损失生命值达到90%上限
  tTargetCount: 3,  // 追加攻击命中3个目标
  c4stacks: 2       // 4命吃到满层(2层)
}

export const defDmgIdx = 3
export const mainAttr = "hp,cpct,cdmg"

export const buffs = [
  {
    check: ({ params }) => params.ebuff === true,
    title: "战技-地狱变：造成伤害提高[dmg]%",
    data: {
      dmg: ({ talent }) => talent.e["造成的伤害提高"] * 100
    }
  }, {
    title: "行迹-坏劫隳亡：天赋追加攻击伤害提高[tDmg]%",
    tree: 3,
    data: {
      tDmg: 20
    }
  }, {
    title: ({ params }) => `1命额外伤害(基于${params.lostHp * 100}%已损失生命)`,
    cons: 1,
    data: {
      aPlus: ({ attr, calc, talent, params }) => talent.q["累计已损生命伤害"] * 1.5 * calc(attr.hp) * params.lostHp,
      qPlus: ({ attr, calc, talent, params }) => talent.q["累计已损生命伤害"] * 1.5 * calc(attr.hp) * params.lostHp
    }
  }, {
    check: ({ params }) => params.ebuff === true,
    title: "刃Pro2命：【地狱变】状态下，暴击率提高[cpct]%",
    cons: 2,
    data: {
      cpct: 15
    }
  }, {
    title: ({ params }) => `4命生命上限提高[hpPct]%(${params.c4stacks}层)`,
    cons: 4,
    data: {
      hpPct: ({ params }) => params.c4stacks * 20
    }
  }, {
    title: ({ params }) => `6命追加攻击伤害值提高[tPlus](${params.tTargetCount}目标)`,
    cons: 6,
    data: {
      tPlus: ({ attr, calc, params }) => calc(attr.hp) * 0.5 * params.tTargetCount
    }
  }
]
