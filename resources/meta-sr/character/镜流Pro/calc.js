export const details = [
  {
    title: "普攻伤害",
    dmg: ({ talent, attr, calc }, { basic }) => basic(talent.a["技能伤害"] * calc(attr.hp), "a")
  }, {
    title: "战技伤害",
    dmg: ({ talent, attr, calc }, { basic }) => basic(talent.e["技能伤害"] * calc(attr.hp), "e")
  }, {
    title: "终结技伤害(扩散)",
    params: { q: true },
    dmg: ({ talent, attr, calc }, { basic }) => basic((talent.q["技能伤害"] + talent.q["相邻目标伤害"] * 2) * calc(attr.hp), "q")
  }, {
    title: ({ params }) => `转魄·战技(${params.moonlight}层月色, 扩散)`,
    dmg: ({ talent, attr, calc }, { basic }) => basic((talent.e2["技能伤害"] + talent.e2["相邻目标伤害"] * 2) * calc(attr.hp), "e")
  }, {
    title: ({ params }) => `转魄·终结技(${params.moonlight}层月色, 扩散)`,
    dmgKey: "q_strength",
    dmg: ({ talent, attr, calc }, { basic }) => basic((talent.q["技能伤害"] + talent.q["相邻目标伤害"] * 2) * calc(attr.hp), "q")
  }, {
    title: "1命额外伤害",
    cons: 1,
    dmg: ({ attr, calc }, { basic }) => basic(0.8 * calc(attr.hp))
  }, {
    title: ({ params }) => `2命转魄·战技(${params.moonlight}层月色, 扩散)`,
    cons: 2,
    params: { afterQ: true },
    dmg: ({ talent, attr, calc }, { basic }) => basic((talent.e2["技能伤害"] + talent.e2["相邻目标伤害"] * 2) * calc(attr.hp), "e")
  }, {
    title: ({ params }) => `霜魄·转魄战技(${params.moonlight}层月色, 扩散)`,
    tree: 3,
    params: { ignoreDef: true },
    dmg: ({ talent, attr, calc }, { basic }) => basic((talent.e2["技能伤害"] + talent.e2["相邻目标伤害"] * 2) * calc(attr.hp), "e")
  }
]

export const defParams = {
  strength: true,  // 处于【转魄】状态
  moonlight: 5,    // 【月色】叠满5层
  q: true          // 计算终结技相关buff
}

export const defDmgKey = "q_strength"
export const mainAttr = "hp,cpct,cdmg"

export const buffs = [
  {
    title: "行迹-死境：【转魄】状态下，终结技伤害提高[qDmg]%",
    tree: 1,
    check: ({ params }) => params.strength === true,
    data: {
      qDmg: 20
    }
  }, {
    title: "行迹-霜魄：【朔望】溢出时，下次攻击无视目标[ignore]%防御",
    tree: 3,
    check: ({ params }) => params.ignoreDef === true,
    data: {
      ignore: 25
    }
  }, {
    title: "天赋-【转魄】状态：暴击率提高[cpct]%",
    check: ({ params }) => params.strength === true,
    data: {
      cpct: ({ talent }) => talent.t["暴击率提高"] * 100
    }
  }, {
    title: ({ params }) => `天赋-【月色】(${params.moonlight}层)：暴击伤害提高[cdmg]%`,
    check: ({ params }) => params.strength === true && params.moonlight > 0,
    data: {
      cdmg: ({ talent, params }) => params.moonlight * talent.t["暴伤提高"] * 100
    }
  }, {
    title: "1命：施放终结技或强化战技时，暴击伤害提高[cdmg]%",
    cons: 1,
    check: ({ params }) => params.q === true || params.strength === true,
    data: {
      cdmg: 36
    }
  }, {
    title: "2命：终结技后，下次强化战技伤害提高[eDmg]%",
    cons: 2,
    check: ({ params }) => params.strength === true && params.afterQ,
    data: {
      eDmg: 80
    }
  }, {
    title: ({ params }) => `4命：【转魄】状态下【月色】额外提高暴伤[cdmg]%(${params.moonlight}层)`,
    cons: 4,
    check: ({ params }) => params.strength === true && params.moonlight > 0,
    data: {
      cdmg: ({ params }) => params.moonlight * 20
    }
  }, {
    title: "6命：【转魄】状态下，冰属性抗性穿透提高[kx]%",
    cons: 6,
    check: ({ params }) => params.strength === true,
    data: {
      kx: 30
    }
  }
]
