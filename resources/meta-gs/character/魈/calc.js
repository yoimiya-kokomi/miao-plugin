export const details = [{
  title: '风轮两立',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: '开Q满被动E',
  params: { e: 1, layer: 5 },
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: '靖妖傩舞·首插',
  params: {
    layer: 1
  },
  dmg: ({ talent }, dmg) => dmg(talent.a['低空/高空坠地冲击伤害'][1], 'a3')
}, {
  title: '靖妖傩舞·尾插',
  params: {
    layer: 5
  },
  dmg: ({ talent }, dmg) => dmg(talent.a['低空/高空坠地冲击伤害'][1], 'a3')
}]

export const defDmgIdx = 3
export const mainAttr = 'atk,cpct,cdmg'

export const defParams = {
  layer: 0
}

export const buffs = [{
  title: '靖妖傩舞：下落攻击伤害提升[a3Dmg]%',
  data: {
    a3Dmg: ({ talent }) => talent.q['普通攻击/重击/下落攻击伤害提升']
  }
}, {
  title: '魈天赋：开Q后每3秒伤害提升5%，满层提高25%',
  data: {
    dmg: ({ params }) => params.layer * 5
  }
}, {
  title: '魈被动：3层E使E的伤害提高45%',
  data: {
    eDmg: ({ params }) => params.e ? 45 : 0
  }
}]
