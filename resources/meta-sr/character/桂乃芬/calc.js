export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '战技伤害(扩散)',
  dmg: ({ talent }, dmg) => dmg(talent.e['目标伤害'] + talent.e['相邻目标伤害'] * 2, 'e')
}, {
  title: '灼烧持续伤害',
  dmg: ({ talent, cons }, dmg) => {
    const dotPlus = cons >= 2 ? 0.4 : 0
    return dmg(talent.e['持续伤害'] + dotPlus, '', 'skillDot')
  }
}, {
  title: '终结技伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}, {
  title: '终结技+引爆dot伤害',
  dmg: ({ talent, cons }, dmg) => {
    let qDmg = dmg(talent.q['技能伤害'], 'q')
    const dotPlus = cons >= 2 ? 0.4 : 0
    let dotDmg = dmg((talent.e['持续伤害'] + dotPlus) * talent.q['灼烧伤害比例'], '', 'skillDot')
    return {
      dmg: qDmg.dmg + dotDmg.avg,
      avg: qDmg.avg + dotDmg.avg
    }
  }
}]

export const defDmgIdx = 2
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '天赋-古来君子养艺人：3层【吞火】状态下目标受到的伤害提高[enemyDmg]%',
  check: ({ cons }) => cons < 6,
  data: {
    enemyDmg: ({ talent }) => talent.t['伤害提高'] * 100 * 3
  }
}, {
  title: '天赋-古来君子养艺人：4层【吞火】状态下目标受到的伤害提高[enemyDmg]%',
  cons: 6,
  data: {
    enemyDmg: ({ talent }) => talent.t['伤害提高'] * 100 * 4
  }
}, {
  title: '行迹-逾锋：对陷入灼烧状态的地方目标造成的伤害提高[dmg]%',
  tree: 3,
  data: {
    dmg: 20
  }
}, {
  title: '桂乃芬2命：目标处于灼烧状态时，持续伤害倍率提升40%',
  cons: 2
}]

export const createdBy = 'Aluxes'
