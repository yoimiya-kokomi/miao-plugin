export const details = [{
  title: '战技伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['单体伤害'], 'e')
}, {
  title: '追加攻击伤害',
  dmg: ({ talent }, dmg) => dmg(talent.t['追加伤害'], 't')
}, {
  title: '战技+引爆dot伤害',
  params: { isDot: true },
  dmg: ({ talent, cons, weapon }, dmg) => {
    let plusDot = cons >= 6 ? 1.56 : 0
    let weaponDot = weapon.name === '只需等待' ? (weapon.affix * 10 + 50) / 100 : 0
    let eDmg = dmg(talent.e['单体伤害'], 'e')
    let dotDmg = dmg((talent.q['回合持续伤害'] + plusDot + weaponDot) * talent.e['额外持续伤害'], '', 'skillDot')
    return {
      dmg: eDmg.dmg + dotDmg.avg,
      avg: eDmg.avg + dotDmg.avg
    }
  }
}, {
  title: '终结技伤害',
  params: { isDot: true },
  dmg: ({ talent, cons, weapon }, dmg) => {
    let plusDot = cons >= 6 ? 1.56 : 0
    let weaponDot = weapon.name === '只需等待' ? (weapon.affix * 10 + 50) / 100 : 0
    let qDmg = dmg(talent.q['技能伤害'], 'q')
    let dotDmg = dmg((talent.q['回合持续伤害'] + plusDot + weaponDot) * talent.q['额外持续伤害'], '', 'skillDot')
    return {
      dmg: qDmg.dmg + dotDmg.avg,
      avg: qDmg.avg + dotDmg.avg
    }
  }
}]

export const defParams = { tArtisBuffCount: 6 }
export const mainAttr = 'atk,cpct,cdmg'
export const defDmgIdx = 3

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
}, {
  title: '只需等待-游丝：游丝状态下，敌方目标陷入触电状态，每回合开始受到等同于装备者攻击力[dotData]%的雷属性持续伤害',
  check: ({ weapon, params }) => (weapon.name === '只需等待' && params.isDot === true),
  data: {
    dotData: ({ weapon }) => weapon.affix * 10 + 50
  }
}]

export const createdBy = 'Aluxes'
