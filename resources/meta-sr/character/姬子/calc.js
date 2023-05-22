export const details = [{
  title: 'A普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: 'E战技主目标伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['主目标伤害'], 'e')
}, {
  title: 'Q终结技伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}, {
  title: '天赋追击伤害',
  dmg: ({ talent }, dmg) => dmg(talent.t['技能伤害'], 't')
}]

export const mainAttr = 'atk,cpct,cdmg,speed'

export const buffs = [{
  title: '姬子秘技：释放领域使敌方受到伤害提高10%',
  data: {
    dmg: 10
  }
}, {
  title: '姬子1命：对生命小于50%的敌人伤害提高15%',
  cons: 1,
  data: {
    dmg: 15
  }
}, {
  title: '希儿2命：释放战技后，2层Buff速度提高50%',
  cons: 2,
  data: {
    speedPct: 50
  }
}, {
  title: '行迹-灼热：战技对灼烧状态下的敌方目标造成的伤害提高20%',
  tree: 2,
  data: {
    eDmg: 20
  }
}, {
  title: '行迹-道标：生命值大于80%时提高暴击率15%',
  tree: 3,
  data: {
    cpct: 15
  }
}]
