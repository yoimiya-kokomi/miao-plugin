export const mainAttr = 'hp,cpct,cdmg,dmg'
export const defParams = {
  Memosprite: true,
  enemyCount: 1,
  memoryCount: 1
}

export const buffs = [
  {
    title: '天赋-今夜与我同行：生命降低时，暴击伤害提高[cdmg]%',
    data: {
      cdmg: ({ talent }) => talent.t['暴伤提高'] * 100
    }
  },
  {
    title: '忆灵天赋-孤独，浮游，漆黑：在场时，长夜月与忆灵造成的伤害提高[dmg]%',
    data: {
      dmg: ({ talent }) => talent.mt['造成的伤害提高'] * 100
    }
  },
  {
    check: ({ params }) => params.isZhiAn,
    title: '终结技-【至暗之谜】：敌方受到伤害提高[enemydmg]%，自身与忆灵伤害提高[dmg]%',
    data: {
      enemydmg: ({ talent }) => talent.q['受到的伤害提高'] * 100,
      dmg: ({ talent }) => talent.q['造成的伤害提高'] * 100
    }
  },
  {
    check: ({ params }) => params.skillActive,
    title: '战技-白昼悄然离去：我方忆灵暴击伤害提高[meCdmg]%',
    data: {
      meCdmg: ({ calc, attr, talent }) => calc(attr.cdmg) * talent.e['忆灵暴伤提高']
    }
  },
  {
    tree: 1,
    title: '行迹-天黑黑，月寂寂：暴击率提高[cpct]%，施放技能时暴击伤害提高[cdmg]%',
    data: {
      cpct: 35,
      cdmg: 15
    }
  },
  {
    tree: 3,
    check: ({ params }) => params.skillActive,
    title: '行迹-天亮了，雨落了([_memoryCount]记忆)：战技额外使忆灵暴击伤害提高[meCdmg]%',
    data: {
      _memoryCount: ({ params }) => params.memoryCount || 1,
      meCdmg: ({ params }) => {
        const count = Math.min(params.memoryCount || 1, 4);
        if (count >= 4) return 65; if (count === 3) return 50; if (count === 2) return 15; return 5
      }
    }
  },
  {
    cons: 1,
    title: '1魂-睡吧，长夜有所梦([_enemyCount]敌人)：我方忆灵造成的伤害提高[meDmg]%',
    data: {
      _enemyCount: ({ params }) => params.enemyCount || 1,
      meDmg: ({ params }) => {
        const count = Math.max(params.enemyCount || 1, 1);
        if (count === 1) return 50; if (count === 2) return 30; if (count === 3) return 25; return 20
      }
    }
  },
  {
    cons: 2,
    title: '2魂-听，沉眠中的呓语：暴击伤害提高[cdmg]%',
    data: {
      cdmg: 40
    }
  },
  {
    cons: 6,
    title: '6魂-就这样，一直：我方全体全属性抗性穿透提高[kx]%',
    data: {
      kx: 20
    }
  }
]

export const details = [
  {
    title: '普攻伤害',
    dmg: ({ calc, attr, talent }, dmg) => {
      const basicDmg = calc(attr.hp) * talent.a['技能伤害']
      return dmg.basic(basicDmg, 'a')
    }
  },
  {
    title: ({ params }) => `忆灵技-追忆蹁跹如雨(${params.yizhi}层忆质)`,
    params: { yizhi: 16 },
    dmg: ({ calc, attr, talent, params }, dmg) => {
      const yilingHP = calc(attr.hp) * 0.5
      const yizhiCount = Math.floor(params.yizhi / 4)
      const pct = talent.me['长夜伤害'] + talent.me['长夜额外伤害'] * yizhiCount
      const basicDmg = yilingHP * pct
      return dmg.basic(basicDmg, 'me')
    }
  },
  {
    title: '终结技-忆灵伤害',
    params: { isZhiAn: true, skillActive: true },
    dmg: ({ calc, attr, talent }, dmg) => {
      const yilingHP = calc(attr.hp) * 0.5
      const basicDmg = yilingHP * talent.q['长夜伤害']
      return dmg.basic(basicDmg, 'me')
    }
  },
  {
    title: ({ params }) => `忆灵技-迷梦流失如露(${params.yizhi}层忆质)-主目标`,
    dmgKey: 'me',
    params: { yizhi: 16, isZhiAn: true, skillActive: true },
    dmg: ({ calc, attr, talent, params }, dmg) => {
      const yilingHP = calc(attr.hp) * 0.5
      const pct = talent.me2['主目标伤害'] * params.yizhi
      const basicDmg = yilingHP * pct
      return dmg.basic(basicDmg, 'me')
    }
  },
  {
    title: ({ params }) => `忆灵技-迷梦流失如露(${params.yizhi}层忆质)-其他目标`,
    params: { yizhi: 16, isZhiAn: true, skillActive: true },
    dmg: ({ calc, attr, talent, params }, dmg) => {
      const yilingHP = calc(attr.hp) * 0.5
      const pct = talent.me2['其他目标伤害'] * params.yizhi
      const basicDmg = yilingHP * pct
      return dmg.basic(basicDmg, 'me')
    }
  }
]

export const defDmgKey = 'me'