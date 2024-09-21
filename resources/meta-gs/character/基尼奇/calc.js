export const details = [{
  title: '迴猎贯鳞炮伤害',
  params: { Scalespiker: true },
  dmg: ({ talent }, dmg) => dmg(talent.e['迴猎贯鳞炮伤害'], 'e,nightsoul')
}, {
  check: ({ cons }) => cons >= 2,
  title: '2命首次猎贯鳞炮',
  params: { Scalespiker: true, cons2: true },
  dmg: ({ talent }, dmg) => dmg(talent.e['迴猎贯鳞炮伤害'], 'e,nightsoul')
}, {
  title: 'Q释放伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q,nightsoul')
}, {
  title: 'Q龙息伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['龙息伤害'], 'q,nightsoul')
}, {
  title: 'Q龙息激化',
  dmg: ({ talent }, dmg) => dmg(talent.q['龙息伤害'], 'q,nightsoul', 'spread')
}]

export const defParams = { Nightsoul: true }
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  check: ({ params }) => params.Scalespiker === true,
  title: '焰灵的契约：2层buff使迴猎贯鳞炮造成的伤害提高[ePlus]',
  data: {
    ePlus: ({ calc , attr }) => calc(attr.atk) * 320 / 100 * 2
  }
}, {
  check: ({ params }) => params.Scalespiker === true,
  title: '基尼奇1命：迴猎贯鳞炮的暴击伤害提升[eCdmg]%',
  cons: 1,
  data: {
    eCdmg: 100
  }
}, {
  title: '基尼奇2命：元素战技命中敌人使其草元素抗性降低[kx]%,首次猎贯鳞炮的伤害提升[eDmg]%',
  cons: 2,
  data: {
    kx: 30,
    eDmg: ({ params }) => params.cons2 === true ? 100 : 0
  }
}, {
  title: '基尼奇4命：向伟大圣龙致意造成的伤害提升[qDmg]%',
  cons: 4,
  data: {
    qDmg: 70
  }
}]

export const createdBy = 'liangshi'
