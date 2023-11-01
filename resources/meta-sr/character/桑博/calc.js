export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '战技伤害',
  dmg: ({ talent, cons }, dmg) => {
    let count = cons >= 1 ? 6 : 5
    return dmg(talent.e['技能伤害'] * count, 'e')
  }
}, {
  title: '战技+引爆Dot伤害',
  check: ({ cons }) => cons >= 4,
  dmg: ({ talent, cons }, dmg) => {
    let eDmg = dmg(talent.e['技能伤害'] * 6, 'e')
    let plusDot = cons >= 6 ? 0.15 : 0
    let dotDmg = dmg((talent.t['回合开始受到伤害'] + plusDot) * 5, '', 'skillDot')
    return {
      dmg: eDmg.dmg + dotDmg.avg * 0.08,
      avg: eDmg.avg + dotDmg.avg * 0.08
    }
  }
}, {
  title: '终结技伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}, {
  title: '天赋5层风化持续伤害',
  dmg: ({ talent, cons }, dmg) => {
    let plusDot = cons >= 6 ? 0.15 : 0
    return dmg((talent.t['回合开始受到伤害'] + plusDot) * 5, '', 'skillDot')
  }
}]

export const defDmgIdx = 4
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '桑博1命：施放战技时，对敌方随机单体额外造成一次伤害',
  cons: 1
}, {
  title: '桑博4命：战技击中风化层数大于等于5层的目标时，立即产生相当于原风化伤害8%的伤害',
  cons: 4
}, {
  title: '桑博6命：天赋施加的风化状态伤害倍率提高15%',
  cons: 6
}, {
  title: '惊喜礼盒：Q后使敌方目标受到的持续伤害提高[dotEnemyDmg]%',
  data: {
    dotEnemyDmg: 30
  }
}]

export const createdBy = 'Aluxes'
