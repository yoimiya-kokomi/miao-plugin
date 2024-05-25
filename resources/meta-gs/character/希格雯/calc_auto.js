export const details = [{
    title: '后台队友E伤害提升值',
	dmg: ({ attr, cons }) => {
	  let cons1 = cons >= 1 ? 100 : 80
	  let count = cons >= 1 ? 3500 : 2800
	  return {
		avg: Math.max(0, Math.min(((attr.hp - 30000) / 1000 * cons1), count))
	  }
	}
}, {
	title: '长按E弹跳伤害',
	dmg: ({ talent, attr }, { basic }) => basic(attr.hp * talent.e['激愈水球伤害'] / 100, 'e')
}, {
	title: '长按E弹跳治疗',
	dmg: ({ talent, attr }, { heal }) => heal((attr.hp * talent.e['激愈水球治疗量2'][0] / 100 + talent.e['激愈水球治疗量2'][1]) * 1.4)
}, {
	title: 'Q单段伤害',
	dmg: ({ talent, attr }, { basic }) => basic(attr.hp * talent.q['技能伤害'] / 100, 'q')
}, {
	title: 'Q完整伤害',
	dmg: ({ talent, attr , cons }, { basic }) => {
	  let q1 = basic(attr.hp * talent.q['技能伤害'] / 100, 'q')
	  let cons4 = cons >= 4 ? 13 : 6
	  return {
		avg: q1.avg * cons4,
		dmg: q1.dmg * cons4
	  }
	}
}, {
	title: '希芙双水 完整Q',
	params: { team: true },
	dmg: ({ talent, attr , cons }, { basic }) => {
	  let q1 = basic(attr.hp * talent.q['技能伤害'] / 100, 'q')
	  let cons4 = cons >= 4 ? 13 : 6
	  return {
		avg: q1.avg * cons4,
		dmg: q1.dmg * cons4
	  }
	}
}]

export const defDmgIdx = 0
export const mainAttr = 'hp,cpct,cdmg,mastery,dmg'

export const buffs = [{
    title: '希格雯天赋：长按E使弹跳伤害提升[eDmg]%,治疗量提升10%',
    data: {
      eDmg: 5 * 2
    }
}, {
    title: '希格雯天赋：施放弹跳水疗法获得[dmg]%水元素伤害加成',
    data: {
      dmg: 8
    }
}, {
    title: '希格雯天赋：基于队伍中所有角色当前生命之契的总和,提升30%治疗量'
}, {
    title: '希格雯2命：EQ中敌人的敌人水元素抗性降低[kx]%',
    cons: 2,
    data: {
      kx: 35
    }
}, {
    title: '希格雯6命：Q的暴击率提高[qCpct]%,暴击伤害提高[qCdmg]%',
    sort: 9,
    cons: 6,
    data: {
      qCpct: ({ attr }) => Math.min(20, attr.hp / 1000 * 0.4),
      qCdmg: ({ attr }) => Math.min(110, attr.hp / 1000 * 2.2)
    }
}, {
  check: ({ params, cons }) => params.team === true,
  title: '双水Buff：生命值提高[hpPct]%',
  data: {
    hpPct: 25
  }
}, {
  check: ({ params, cons }) => params.team === true && cons <= 1,
  title: '0命芙宁娜：获得[dmg]%增伤',
  data: {
    dmg: 75
  }
}, {
  check: ({ params, cons }) => params.team === true && cons > 1,
  title: '2命芙宁娜：获得[dmg]%增伤',
  data: {
    dmg: 100
  }
}, 'vaporize']

export const createdBy = 'liangshi'