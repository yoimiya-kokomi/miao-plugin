export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '强化战技伤害·主目标',
  params: { Enhanced_Skill: true },
  dmg: ({ talent, cons }, dmg) => {
    let num = cons < 1 ? 42 : 63
    let primaryDmg = dmg(talent.e2['技能伤害'] * 3 + talent.e2['所有目标伤害'] + talent.t['主目标每层倍率'] * 2 * num, 'e')
    return {
      dmg: primaryDmg.dmg,
      avg: primaryDmg.avg
    }
  }
}, {
  title: '终结技伤害',
  params: { Ultimate: true },
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}, {
  title: '6命终结技伤害·1名敌人',
  params: { Ultimate: true },
  cons: 6,
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'] + 400 / 100, 'q')
}, {
  title: '6命终结技伤害·3名敌人',
  params: { Ultimate: true },
  cons: 6,
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'] + 140 / 100, 'q')
}]

export const defDmgIdx = 1
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [ {
  check: ({ params }) => params.Enhanced_Skill === true,
  title: '行迹-冷漠的诚实：施放强化战技时，若主目标的【解读】层数达到42，使大黑塔造成的伤害提高[dmg]%',
  tree: 1,
  data: {
    dmg: 50
  }
}, {
  title: '行迹-视界外来信：若队伍中的「智识」命途角色大于等于2名，使我方全体暴击伤害提高[cdmg]%',
  tree: 2,
  data: {
    cdmg: 80
  }
}, {
  check: ({ params }) => params.Ultimate === true,
  title: '行迹-饥饿的地景：施放终结技时，持有99层【谜底】，使本次终结技的伤害倍率提高99%',
  tree: 3,
  data: {
    qPct: 99
  }
}, {
  title: '终结技：终结技施放时，使大黑塔攻击力提高[atkPct]%',
  data: {
    atkPct: ({ talent }) => talent.q['攻击力提高'] * 100
  }
}, {
  title: '大黑塔6命：冰属性抗性穿透提高[kx]%',
  cons: 6,
  data: {
    kx: 20
  }
}]

export const createdBy = '冰翼'
