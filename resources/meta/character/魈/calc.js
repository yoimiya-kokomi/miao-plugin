export const details = [{
  title: "裸E",
  dmg: ({ talent }, dmg) => dmg(talent.e["技能伤害"], "e")
}, {
  title: "满层被动E",
  params: { e: 1 },
  dmg: ({ talent }, dmg) => dmg(talent.e["技能伤害"], "e")
}, {
  title: "开Q后首插",
  params: {
    layer: 1
  },
  dmg: ({ talent }, dmg) => dmg(talent.a["低空/高空坠地冲击伤害"][1], "a3")
}, {
  title: "开Q后尾插",
  params: {
    layer: 5
  },
  dmg: ({ talent }, dmg) => dmg(talent.a["低空/高空坠地冲击伤害"][1], "a3")
}];


export const defParams = {
  layer: 0
}

export const buffs = [{
  title: `魈天赋：开Q后每3秒伤害提升5%，满层提高25%`,
  data: {
    dmg: ({ params }) => params.layer * 5
  }
}, {
  title: "魈大招：下落攻击伤害提升[a3Dmg]%",
  data: {
    a3Dmg: ({ talent }) => talent.q['普通攻击/重击/下落攻击伤害提升']
  }
}, {
  title: "魈被动：3层E使E的伤害提高45%",
  data: {
    eDmg: ({ params }) => params.e ? 45 : 0
  }
}];