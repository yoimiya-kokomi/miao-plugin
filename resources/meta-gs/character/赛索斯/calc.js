export const details = [{
    title: '贯影箭伤害',
    dmg: ({ talent, attr }, { basic }) => basic(talent.a['贯影箭伤害'][0] * attr.atk / 100 + talent.a['贯影箭伤害'][1] * attr.mastery / 100, 'a2')
}, {
    title: '贯影箭激化',
    dmg: ({ talent, attr }, { basic }) => basic(talent.a['贯影箭伤害'][0] * attr.atk / 100 + talent.a['贯影箭伤害'][1] * attr.mastery / 100, 'a2', 'aggravate')
}, {
    title: 'E伤害',
    dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
    title: 'E激化伤害',
    dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e', 'aggravate')
}, {
    title: 'Q后普攻一段',
    params: { q: true },
    dmg: ({ talent }, dmg) => dmg(talent.a['一段伤害'], 'a2')
}, {
    title: 'Q后普攻一段激化',
    params: { q: true },
    dmg: ({ talent }, dmg) => dmg(talent.a['一段伤害'], 'a2', 'aggravate')
}, {
    title: 'Q后普攻三段',
    params: { q: true },
    dmg: ({ talent }, dmg) => dmg(talent.a['三段伤害'], 'a2')
}, {
    title: 'Q后普攻三段激化',
    params: { q: true },
    dmg: ({ talent }, dmg) => dmg(talent.a['三段伤害'], 'a2', 'aggravate')
}]

export const defDmgIdx = 1
export const mainAttr = 'atk,cpct,cdmg,mastery'

export const buffs = [{
    check: ({ params }) => params.q === true,
    title: '赛索斯技能：暝弦矢造成的伤害提升[a2Plus]',
    data: {
      a2Plus: ({ talent, attr }) => attr.mastery / 100 * talent.q['瞑弦矢伤害提升']
    }
}, {
    check: ({ params }) => params.q !== true,
    title: '赛索斯天赋：贯影箭造成的伤害值提升[a2Plus]',
    data: {
      a2Plus: ({ attr, calc }) => calc(attr.mastery) * 600 / 100
    }
}, {
    check: ({ params }) => params.q !== true,
    title: '赛索斯1命：贯影箭的暴击率提升[a2Cpct]%',
    cons: 1,
    data: {
      a2Cpct: 15
    }
}, {
    title: '赛索斯2命：释放EQ获得[dmg]%雷伤加成',
    cons: 2,
    data: {
      dmg: 15 * 2
    }
}, {
    title: '赛索斯4命：贯影箭与暝弦矢命中2名及以上的敌人元素精通提升[mastery]',
    cons: 4,
    data: {
      mastery: 80
    }
}, 'aggravate']

export const createdBy = 'liangshi'