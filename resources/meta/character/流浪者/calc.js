export const details = [{
  title: '开E后首段普攻',
  params: { pyro: false, cryo: false },
  dmg: ({ talent }, dmg) => dmg(talent.a['一段伤害'], 'a')
}, {
  title: '开E后重击',
  params: { pyro: false, cryo: false },
  dmg: ({ talent }, dmg) => dmg(talent.a['重击伤害'], 'a2')
}, {
  title: '开E满染火冰首段普攻',
  params: { pyro: true, cryo: true },
  dmg: ({ talent }, dmg) => dmg(talent.a['一段伤害'], 'a')
}, {
  title: 'Q伤害',
  params: { pyro: true, cryo: true },
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}]

export const defDmgIdx = 2
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '羽画·风姿华歌：开启E后额外提升普通[aMulti]%伤害,重击[a2Multi]%伤害',
  data: {
    aMulti: ({ talent }) => talent.e['空居·不生断伤害'] - 100,
    a2Multi: ({ talent }) => talent.e['空居·刀风界伤害'] - 100
  }
}, {
  title: '天赋拾玉得花：火元素攻击力提升30%,冰元素暴击率提升20%',
  data: {
    atkPct: ({ params }) => params.pyro ? 30 : 0,
    cpct: ({ params }) => params.cryo ? 20 : 0
  }
}, {
  title: '二番·箙岛月白浪：至多使狂言·式乐五番造成的伤害提升200%',
  cons: 2,
  data: {
    qDmg: 200
  }
}]
