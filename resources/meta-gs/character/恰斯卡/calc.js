export const details = [{
  title: 'E追影弹伤害',
  params: { AllShadowhuntShell: true },
  dmg: ({ talent }, dmg) => dmg(talent.e['追影弹伤害'], 'a2,nightsoul')
},{
  title: 'E焕光追影弹伤害',
  dmgKey: 'z',
  params: { ShadowSpirit: true, AllShadowhuntShell: true },
  dmg: ({ talent }, dmg) => dmg(talent.e['焕光追影弹伤害'], 'a2,nightsoul', 'scene')
},{
  title: 'E焕光追影弹最低增幅伤害',
  dmgKey: 'z',
  params: { ShadowSpirit: true, AllShadowhuntShell: true },
  dmg: ({ talent }, dmg) => dmg(talent.e['焕光追影弹伤害'], 'a2,nightsoul', 'scene,vaporize')
},{
  title: 'E焕光追影弹最高增幅伤害',
  dmgKey: 'z',
  params: { ShadowSpirit: true, AllShadowhuntShell: true },
  dmg: ({ talent }, dmg) => {
    let ret = dmg(talent.e['焕光追影弹伤害'], 'a2,nightsoul', 'scene,vaporize')
    return {
      dmg: ret.dmg * 2 / 1.5,
      avg: ret.avg * 2 / 1.5
    }
  }
},{
  title: 'Q裂风索魂弹伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['裂风索魂弹伤害'], 'q,nightsoul')
},{
  title: 'Q索魂弹伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['索魂弹伤害'], 'q,nightsoul')
},{
  title: 'Q溢光索魂弹伤害',
  dmgKey: 'q',
  dmg: ({ talent }, dmg) => dmg(talent.q['溢光索魂弹伤害'], 'q,nightsoul', 'scene')
},{
  title: '2命基于焕光追影弹的追加伤害',
  cons: 2,
  dmgKey: 'z',
  dmg: ({ attr, calc }, { basic }) => basic(calc(attr.atk) * 400 / 100, 'a2,nightsoul', 'scene')
},{
  title: '4命基于溢光索魂弹的追加伤害',
  cons: 4,
  dmgKey: 'z',
  dmg: ({ attr, calc }, { basic }) => basic(calc(attr.atk) * 400 / 100, 'a2,nightsoul', 'scene')
}]

export const defParams = { Nightsoul: true }
export const defDmgIdx = 3
export const mainAttr = 'atk,cpct,cdmg,mastery'

export const buffs = [{
  check: ({ params }) => params.ShadowSpirit === true,
  title: '恰斯卡天赋：3层「焕影之灵」效果时，焕光追影弹造成的伤害提升[a2Dmg]%',
  data: {
    a2Dmg: 65
  }
},{
  check: ({ params }) => params.AllShadowhuntShell === true,
  title: '恰斯卡6命：触发固有天赋后，追影弹和焕光追影弹的暴击伤害提升[a2Cdmg]%',
  cons: 6,
  data: {
    a2Cdmg: 120
  }
}]

export const createdBy = '冰翼'
