export const details = [
  {
    title: "EQ后普攻首段伤害",
    dmg: ({ talent }, dmg ) => dmg(talent.e['一段伤害'], 'a')
  },
  {
    title: "EQ后普攻尾段伤害",
    dmg: ({ talent }, dmg ) => {
      let a = dmg(talent.a['五段伤害2'][0], 'a')
      let a2 = dmg(talent.a['五段伤害2'][1], 'a')
      return {
        dmg: a.dmg + a2.dmg,
        avg: a.avg + a2.avg
      }
    }
  },
  {
    title: "EQ后重击伤害",
    dmg: ({ talent }, dmg ) => {
      let a = dmg(talent.a['重击伤害2'][0], 'a2')
      return {
        dmg: a.dmg * 2,
        avg: a.avg * 2
      }
    }
  },
  {
    title: '零层强化E伤害',
    params: { "争胜": 0 },
    dmg: ({ talent, params }, dmg) => {
      let e = dmg(talent.e['镂骨彻心伤害2'][0] * (1 + talent.e['每点争胜提升原本伤害'] * params["争胜"] / 100), 'e')
      return {
        dmg: e.dmg * 4,
        avg: e.avg * 4
      }
    }
  }, {
    title: '满层强化E伤害',
    params: ({ cons }) => ({ "争胜": cons >= 1 ? 250 : 100 }),
    dmg: ({ talent, params }, dmg) => {
      let e = dmg(talent.e['镂骨彻心伤害2'][0] * (1 + talent.e['每点争胜提升原本伤害'] * params["争胜"] / 100), 'e')
      return {
        dmg: e.dmg * 4,
        avg: e.avg * 4
      }
    }
  },
  {
    title: '零层Q伤害',
    params: { "争胜": 0 },
    dmg: ({ talent, params }, dmg) => {
      let q = dmg(talent.q['技能伤害2'][0] * (1 + talent.q['每点争胜提升原本伤害'] * params["争胜"] / 100), 'e')
      return {
        dmg: q.dmg * 4,
        avg: q.avg * 4
      }
    }
  }, {
    title: '满层Q伤害',
    params: ({ cons }) => ({ "争胜": cons >= 1 ? 250 : 100 }),
    dmg: ({ talent, params }, dmg) => {
      let q = dmg(talent.q['技能伤害2'][0] * (1 + talent.q['每点争胜提升原本伤害'] * params["争胜"] / 100), 'e')
      return {
        dmg: q.dmg * 4,
        avg: q.avg * 4
      }
    }
  },
]

export const defParams = { "奇谋": true, Hexenzirkel: true }
export const mainAttr = 'atk,cpct,cdmg,mastery,dmg'
export const defDmgIdx = 6

export const buffs = [
  {
    title: '洛恩技能：当前拥有[buff]层争胜，元素战技镂骨彻心造成原本[_eDmg]%的伤害,元素爆发造成原本[_qDmg]%的伤害',
    data: {
      buff: ({ params }) => params["争胜"] || 0,
      _eDmg: ({ talent, params }) => 100 + talent.e['每点争胜提升原本伤害'] * params["争胜"] / 100,
      _qDmg: ({ talent, params }) => 100 + talent.q['每点争胜提升原本伤害'] * params["争胜"] / 100
    }
  }, {
    check: ({ params }) => params["奇谋"] === true,
    title: '洛恩天赋：在奇谋状态下，其他角色触发冰元素反应后攻击力提升[atkPct]%',
    data: {
      atkPct: 15
    }
  }, {
    check: ({ params, cons }) => (params["奇谋"] === true) && ((params["争胜"] || 0) > (cons >= 1 ? 125 : 50)),
    title: '洛恩天赋：施放强化战技或元素爆发后普通攻击与重击造成的伤害提升[aDmg]%',
    data: {
      aDmg: 40,
      a2Dmg: 40
    }
  }, {
    check: ({ params }) => params["奇谋"] === true,
    title: '洛恩6命：施放特殊元素战技或在奇谋状态下释放元素爆发暴击伤害都将提升[eCpct]%',
    data: {
      eCpct: 80,
      qCpct: 80
    }
  }
]
