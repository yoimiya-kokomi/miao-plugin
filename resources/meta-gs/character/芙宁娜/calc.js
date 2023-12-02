export const details = [{
  title: 'E众水歌者治疗',
  dmg: ({ talent, attr }, { heal }) =>
    heal(talent.e['众水的歌者治疗量2'][0] * attr.hp / 100 + talent.e['众水的歌者治疗量2'][1] * 1)
}, {
  title: 'E海薇玛夫人(海马)·伤害',
  dmg: ({ talent, attr }, { basic }) => basic(attr.hp * talent.e['海薇玛夫人伤害'] / 100 * 1.4, 'e')
}, {
  title: 'E乌瑟勋爵(章鱼)·伤害',
  dmg: ({ talent, attr }, { basic }) => basic(attr.hp * talent.e['乌瑟勋爵伤害'] / 100 * 1.4, 'e')
}, {
  title: 'E谢贝蕾妲小姐(螃蟹)·伤害',
  dmgKey: 'e',
  dmg: ({ talent, attr }, { basic }) => basic(attr.hp * talent.e['谢贝蕾妲小姐伤害'] / 100 * 1.4, 'e')
}, {
  title: 'E谢贝蕾妲小姐(螃蟹)·蒸发',
  dmgKey: 'e',
  dmg: ({ talent, attr }, { basic }) => basic(attr.hp * talent.e['谢贝蕾妲小姐伤害'] / 100 * 1.4, 'e', '蒸发')
}, {
  title: 'Q万众狂欢·伤害',
  params: { talentQ: true },
  dmg: ({ talent, attr }, { basic }) => basic(attr.hp * (talent.q['技能伤害'] / 100), 'q')
}, {
  title: 'Q万众狂欢伤害·蒸发',
  params: { talentQ: true },
  dmg: ({ talent, attr }, { basic }) => basic(attr.hp * (talent.q['技能伤害'] / 100), 'q', '蒸发')
}, {
  title: '六命荒刀每秒治疗',
  cons: 6,
  params: { talentQ: true },
  dmg: ({ attr }, { heal }) => heal(attr.hp * 0.04)
}, {
  title: '六命荒刀普攻伤害',
  cons: 6,
  params: { talentQ: true },
  dmg: ({ talent, attr }, { basic }) => basic(attr.atk * talent.a['一段伤害'] / 100 + attr.hp * 0.18, 'a')
}, {
  title: '六命芒刀普攻伤害',
  cons: 6,
  params: { talentQ: true },
  dmg: ({ talent, attr }, { basic }) => basic(attr.atk * talent.a['一段伤害'] / 100 + attr.hp * 0.43, 'a')
}]

export const mainAttr = 'hp,mastery,cpct,cdmg,dmg'
export const defDmgIdx = 3

export const buffs = [{
  title: '芙宁娜天赋：消耗4队友生命值，E伤害提升140%'
}, {
  title: '天赋Q·万众狂欢：300层气氛值提升[dmg]%伤害，[healInc]%受治疗加成',
  data: {
    dmg: ({ talent }) => talent.q['气氛值转化提升伤害比例'] * 300,
    healInc: ({ talent }) => talent.q['气氛值转化受治疗加成比例'] * 300
  }
}, {
  title: '芙宁娜被动：基于生命值，提升召唤物伤害[eDmg]%',
  sort: 9,
  data: {
    eDmg: ({ attr }) => Math.min(28, attr.hp / 1000 * 0.7)
  }
}, {
  title: '芙宁娜1命：气氛值层数上限提升100',
  cons: 1,
  data: {
    dmg: ({ talent }) => talent.q['气氛值转化提升伤害比例'] * 100,
    healInc: ({ talent }) => talent.q['气氛值转化受治疗加成比例'] * 100
  }
}, {
  title: '芙宁娜2命：万众狂欢持续期间，满气氛值提升芙宁娜140%生命值',
  cons: 2,
  check: ({ params }) => params.talentQ === true,
  data: {
    hpPct: 140
  }
}, 'vaporize']
