export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '战技伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: '终结技伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}, {
  title: '10层神君单体伤害',
  check: ({ cons }) => cons < 6,
  dmgKey: 't',
  dmg: ({ talent }, dmg) => dmg(talent.t['技能伤害'] * 10, 't')
}, {
  title: '10层神君单体伤害',
  check: ({ cons }) => cons >= 6,
  dmgKey: 't',
  dmg: ({ talent }, { dynamic }) => {
    const dynamicEnemyDmg = 12
    let t1dmg = dynamic(talent.t['技能伤害'], 't')
    let t2dmg = dynamic(talent.t['技能伤害'], 't', { dynamicEnemyDmg })
    let t3dmg = dynamic(talent.t['技能伤害'], 't', { dynamicEnemyDmg: dynamicEnemyDmg * 2 })
    let t4dmg = dynamic(talent.t['技能伤害'], 't', { dynamicEnemyDmg: dynamicEnemyDmg * 3 })
    return {
      dmg: t1dmg.dmg + t2dmg.dmg + t3dmg.dmg + t4dmg.dmg * 7,
      avg: t1dmg.avg + t2dmg.avg + t3dmg.avg + t4dmg.avg * 7
    }
  }
}]

export const defParams = { tArtisBuffCount: 8 }
export const defDmgKey = 't'
export const mainAttr = 'atk,cpct,cdmg,speed'

export const buffs = [{
  title: '景元2命：神君行动后，普攻战技及终结技的伤害提高20%',
  cons: 2,
  data: {
    aDmg: 20,
    eDmg: 20,
    qDmg: 20
  }
}, {
  title: '景元6命：神君会使目标陷入易伤状态，使伤害提高12%，最多3层',
  cons: 6
}, {
  title: '行迹-破阵：攻击段数大于等于6段，则其下回合的暴击伤害提高25%',
  tree: 1,
  data: {
    tCdmg: 25
  }
}, {
  title: '行迹-遣将：施放战技后，暴击率提升10%',
  tree: 3,
  data: {
    cpct: 10
  }
}]
