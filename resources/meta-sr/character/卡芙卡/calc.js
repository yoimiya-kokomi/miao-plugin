export const details = [{
  title: '战技伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['单体伤害'], 'e')
}, {
  title: '追加攻击伤害',
  dmg: ({ talent }, dmg) => dmg(talent.t['追加伤害'], 't')
}, {
  title: '战技+引爆dot伤害',
  dmg: ({ talent, cons }, dmg) => {
    let plusDot = cons >= 6 ? 1.56 : 0
    let eDmg = dmg(talent.e['单体伤害'], 'e')
    let dotDmg = dmg((talent.q['回合持续伤害'] + plusDot) * talent.e['额外持续伤害'], '', 'skillDot')
    return {
      dmg: eDmg.dmg + dotDmg.avg,
      avg: eDmg.avg + dotDmg.avg
    }
  }
}, {
  title: '终结技伤害',
  dmg: ({ talent, cons }, dmg) => {
    let plusDot = cons >= 6 ? 1.56 : 0
    let qDmg = dmg(talent.q['技能伤害'], 'q')
    let dotDmg = dmg((talent.q['回合持续伤害'] + plusDot) * talent.q['额外持续伤害'], '', 'skillDot')
    return {
      dmg: qDmg.dmg + dotDmg.avg,
      avg: qDmg.avg + dotDmg.avg
    }
  }
}]

export const mainAttr = 'atk,cpct,cdmg,speed'

export const buffs = [{
  title: '卡芙卡1命：目标受到的持续伤害提高30%',
  cons: 1,
  data: {
    dotEnemyDmg: 30
  }
}, {
  title: '卡芙卡2命：我方全体造成的持续伤害提高25%',
  cons: 2,
  data: {
    dotDmg: 25
  }
}, {
  title: '卡芙卡六命：持续伤害倍率提高156%',
  cons: 6
}]
