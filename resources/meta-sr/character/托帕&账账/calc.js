export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 't')
}, {
  title: '战技伤害(负债标记)',
  params: { debt: true },
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 't')
}, {
  title: '战技伤害(负债+强化)',
  params: { debt: true, qBuff: true },
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'] + talent.q['伤害倍率提高'], 't')
}, {
  title: '账账伤害(负债标记)',
  params: { debt: true },
  dmg: ({ talent }, dmg) => dmg(talent.t['技能伤害'], 't')
}, {
  title: '账账伤害(负债+强化)',
  params: { debt: true, qBuff: true },
  dmg: ({ talent }, dmg) => dmg(talent.t['技能伤害'] + talent.q['伤害倍率提高'], 't')
}]

export const defParams = { tArtisBuffCount: 4 }
export const defDmgIdx = 4
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '负债证明：处于该状态的敌人受到的追加攻击伤害提高[tDmg]%',
  check: ({ params }) => params.debt === true,
  data: {
    tDmg: ({ talent }) => talent.e['追加攻击伤害提高'] * 100
  }
}, {
  title: '涨幅惊人：账账的伤害倍率提高[_pct]%,暴击伤害提高[cdmg]%',
  check: ({ params }) => params.qBuff === true,
  data: {
    _pct: ({ talent }) => talent.q['伤害倍率提高'] * 100,
    cdmg: ({ talent }) => talent.q['暴击伤害提高'] * 100
  }
}, {
  title: '行迹-金融动荡：托帕和账账对拥有火属性弱点的敌人造成的伤害提高[dmg]%',
  tree: 2,
  data: {
    dmg: 15
  }
}, {
  title: '行迹-透支：托帕的普攻视为追加攻击',
  tree: 1
}, {
  title: '托帕1命：【被执行】状态的目标受到的追加攻击的暴击伤害提高[cdmg]%',
  cons: 1,
  data: {
    cdmg: 25
  }
}, {
  title: '托帕6命：账账攻击时火属性抗性穿透提高[kx]%',
  cons: 6,
  data: {
    kx: 10
  }
}]

export const createdBy = 'Aluxes'
