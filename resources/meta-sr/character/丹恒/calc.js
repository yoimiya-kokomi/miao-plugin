export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '战技主目标伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: '终结技伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}, {
  title: '减速目标终结技伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'] + talent.q['减速目标q伤害倍率提高'], 'q')
}]

export const defDmgIdx = 2
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '丹恒天赋：丹恒成为我方技能的目标时提高抗性穿透[kx]%',
  data: {
    kx: ({ talent }) => talent.t['风抗性穿透']
  }
}, {
  title: '丹恒秘技：使用秘技提高40%攻击力',
  data: {
    atkPct: 40
  }
}, {
  title: '丹恒1命：击中目标生命值大于50%，暴击率提高12%',
  cons: 1,
  data: {
    cpct: 12
  }
}, {
  title: '行迹-罡风：普攻对减速状态下的敌方目标造成的伤害提高40%',
  tree: 3,
  data: {
    aDmg: 40
  }
}]
