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
  title: '3负面·追加攻击',
  dmg: ({ talent, cons }, dmg) => {
    const extraPct = cons >= 2 ? 60 : 0
    return {
      dmg: dmg(talent.t['追加攻击伤害'], 't').dmg + dmg(extraPct / 100).dmg,
      avg: dmg(talent.t['追加攻击伤害'], 't').avg + dmg(extraPct / 100).avg
    }
  }
}, {
  title: '5负面·追加攻击',
  params: { debuffCount: 5 },
  dmg: ({ talent, cons }, dmg) => {
    const extraPct = cons >= 2 ? 80 : 0
    return {
      dmg: dmg(talent.t['追加攻击伤害'], 't').dmg + dmg(extraPct / 100).dmg,
      avg: dmg(talent.t['追加攻击伤害'], 't').avg + dmg(extraPct / 100).avg
    }
  }
}]

export const defParams = { debuffCount: 3 }
export const defDmgIdx = 4
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '天赋-归纳：叠满[_count]层时，真理医生暴击率提高[cpct]%，暴击伤害提高[cdmg]%',
  tree: 2,
  data: {
    _count: ({ cons }) => cons < 1 ? 6 : 10,
    cpct: ({ cons }) => cons < 1 ? 15 : 25,
    cdmg: ({ cons }) => cons < 1 ? 30 : 50
  }
}, {
  title: '天赋-推理：目标持有[_count]个负面状态，真理医生造成伤害提高[dmg]%',
  tree: 3,
  data: {
    _count: ({ params }) => params.debuffCount,
    dmg: ({ params }) => params.debuffCount * 10
  }
}, {
  title: '真理2命：天赋的追加攻击额外造成[_atkPct]%的附加伤害',
  cons: 2,
  data: {
    _atkPct: ({ params }) => Math.min(params.debuffCount * 20, 80)
  }
}, {
  title: '真理6命：天赋的追加攻击造成伤害提高[tDmg]%',
  cons: 6,
  data: {
    tDmg: 50
  }
}]

export const createdBy = 'Aluxes'
