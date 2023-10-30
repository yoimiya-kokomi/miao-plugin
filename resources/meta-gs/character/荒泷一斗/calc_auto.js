export const details = [{
  title: '开大后每段重击',
  params: { team: false },
  dmg: ({ talent }, dmg) => dmg(talent.a['荒泷逆袈裟连斩伤害'], 'a2')
}, {
  title: '开大后重击尾段',
  params: { team: false },
  dmg: ({ talent }, dmg) => dmg(talent.a['荒泷逆袈裟终结伤害'], 'a2')
}, {
  title: '开大后牛牛伤害',
  params: { team: false },
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: '一五钟开大重击',
  params: { team: true },
  dmg: ({ talent }, dmg) => dmg(talent.a['荒泷逆袈裟连斩伤害'], 'a2')
}, {
  title: '一五钟重击尾段',
  params: { team: true },
  dmg: ({ talent }, dmg) => dmg(talent.a['荒泷逆袈裟终结伤害'], 'a2')
}, {
  title: '一五钟Q后E伤害',
  params: { team: true },
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}]

export const mainAttr = 'atk,cpct,cdmg'
export const enemyName = '魔偶/女士/雷神'

export const defParams = {
  team: true
}

export const buffs = [{
  title: '天赋-赤鬼之血：荒泷逆袈裟造成的伤害基于防御值提高[a2Plus]',
  sort: 9,
  data: {
    a2Plus: ({ attr, calc }) => calc(attr.def) * 0.35
  }
}, {
  title: '一斗6命：重击的暴击伤害提高70%',
  cons: 6,
  data: {
    a2Cdmg: 70
  }
}, {
  title: '一斗大招：怒目鬼王状态提高攻击力[atkPlus]',
  sort: 9,
  data: {
    atkPlus: ({ attr, calc, talent }) => talent.q['攻击力提高'] * calc(attr.def) / 100
  }
}, {
  check: ({ params }) => params.team === true,
  title: '6命五郎：增加[defPlus]点防御力与[defPct]%防御力，增加[dmg]%岩伤与[cdmg]%暴击伤害',
  data: {
    cdmg: 40,
    defPct: 25,
    defPlus: 438,
    dmg: 15
  }
}, {
  check: ({ params }) => params.team === true,
  title: '钟离：降低敌人[kx]%全抗',
  data: {
    kx: 20
  }
}]
