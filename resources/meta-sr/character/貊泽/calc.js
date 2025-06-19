export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '战技伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: '天赋附加伤害',
  dmg: ({ talent }, dmg) => dmg(talent.t['附加伤害'], 't')
}, {
  title: '天赋追加攻击伤害',
  params: { FollowUpAttack: true },
  dmg: ({ talent, cons }, dmg) => {
    let num = cons === 6 ? 0.25 : 0
    return dmg(talent.t['追加攻击伤害'] + num, 't')
  }
}, {
  title: '终结技伤害',
  params: { FollowUpAttack: true },
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}]

export const defDmgIdx = 3
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  check: ({ params }) => params.FollowUpAttack === true,
  title: '貊泽天赋：施放终结技造成伤害时，被视为发动了追加攻击。【猎物】受到的追加攻击伤害提高[enemydmg]%',
  tree: 3,
  data: {
    enemydmg: 25
  }
}, {
  title: '貊泽2魂：我方全体目标对成为【猎物】的敌方目标造成伤害时，暴击伤害提高[cdmg]%',
  cons: 1,
  data: {
    cdmg: 40
  }
}, {
  title: '貊泽4魂：施放终结技时，貊泽造成的伤害提高[dmg]%',
  cons: 4,
  data: {
    dmg: 20
  }
}]

export const createdBy = '冰翼'
