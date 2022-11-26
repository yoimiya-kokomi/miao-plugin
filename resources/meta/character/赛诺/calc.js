/*
* q: 1 - Q状态，a伤害
* q: 2 - Q状态，E伤害
* q: 3 - Q状态，冥祭
* q: 4 - Q状态，炮弹
* */

export const details = [{
  title: 'Q状态普攻首段',
  params: { q: 1 },
  dmg: ({ talent }, dmg) => dmg(talent.q['一段伤害'], 'a')
}, {
  title: 'Q状态 E伤害',
  params: { q: 2 },
  dmg: ({ talent }, dmg) => dmg(talent.e['冥祭伤害'], 'e')
}, {
  title: 'Q+末途真眼 E伤害',
  params: { q: 3 },
  dmg: ({ talent }, dmg) => dmg(talent.e['冥祭伤害'], 'e')
}, {
  title: 'Q后强化E·超激化',
  params: { q: 3 },
  dmg: ({ talent }, dmg) => dmg(talent.e['冥祭伤害'], 'e', '超激化')
}/*, {

  title: 'Q+末途真眼 渡荒之雷',
  params: { q: 4 },
  dmg: ({ talent }, dmg) => dmg(100, 'e')
}*/]

export const defDmgIdx = 3
export const mainAttr = 'atk,cpct,cdmg,mastery'
export const defParams = { q: 3 }

export const buffs = [{
  title: '赛诺Q：Q状态下提升元素精通100点',
  data: {
    mastery: ({ params }) => params.q ? 100 : 0
  }
}, {
  // 普攻提升雷伤
  title: '赛诺2命：普攻提高雷伤，5层增加50%',
  cons: 2,
  data: {
    dmg: 50
  }
}, {
  title: '赛诺被动：末途真眼状态提升E 35%伤害，发射渡荒之雷造成100%攻击力伤害',
  data: {
    eDmg: ({ params }) => [3, 4].includes(params.q) ? 35 : 0
  }
}, {
  title: '赛诺被动：基于元素精通提升普攻[_aPlus]点伤害值，渡荒之雷提升[_ePlus]伤害值',
  data: {
    aPlus: ({ attr, calc, params }) => params.q === 1 ? calc(attr.mastery) * 1.5 : 0,
    _aPlus: ({ attr, calc, params }) => calc(attr.mastery) * 1.5,
    ePlus: ({ attr, calc, params }) => params.q === 4 ? calc(attr.mastery) / 2.5 : 0,
    _ePlus: ({ attr, calc, params }) => calc(attr.mastery) / 2.5
  }
}/*, 'aggravate'*/]
