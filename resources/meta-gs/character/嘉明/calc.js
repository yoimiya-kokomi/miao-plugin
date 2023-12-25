export const details = [{
  title: '下落攻击·踏云献瑞伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['下落攻击·踏云献瑞伤害'], 'a3')
},{
  title: '下落攻击·踏云献瑞蒸发',
  dmg: ({ talent }, dmg) => dmg(talent.e['下落攻击·踏云献瑞伤害'], 'a3', 'vaporize')
},{
  title: '猊兽·文仔砸击伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['猊兽·文仔砸击伤害'], 'q')
},{
  title: '猊兽·文仔砸击蒸发',
  dmg: ({ talent }, dmg) => dmg(talent.q['猊兽·文仔砸击伤害'], 'q', 'vaporize')
}]

export const defDmgIdx = 1
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '嘉明天赋：生命值低于50%时,获得[healInc]%受治疗加成。生命值高于或等于50%时,下落攻击·踏云献瑞造成的伤害提升[a3Dmg]%。',
  data: {
    healInc: 20,
    a3Dmg: 20
  }
},{
  title: '嘉明2命：受到治疗溢出,攻击力提升[atkPct]%',
  sort: 1,
  cons: 2,
  data: {
    atkPct: 20
  }
},{
  title: '嘉明6命：下落攻击·踏云献瑞的暴击率提升[a3Cpct]%，暴击伤害提升[a3Cdmg]%',
  cons: 6,
  data: {
    a3Cpct: 20,
    a3Cdmg: 40
  }
}]

export const createdBy = 'liangshi'