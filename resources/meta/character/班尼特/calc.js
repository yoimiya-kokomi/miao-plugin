export const details = [{
  title: '点赞攻击力提升',
  dmg: ({ attr, talent, cons }) => {
    let baseAtk = attr.atk.base
    let pct = talent.q['攻击力加成比例']
    if (cons >= 1) {
      pct += 20
    }
    return {
      avg: baseAtk * pct / 100
    }
  }
}, {
  title: 'Q+点E总伤害',
  dmg: ({ attr, talent, cons }, dmg) => {
    let eDmg = dmg(talent.e['点按伤害'], 'e')
    let qDmg = dmg(talent.q['技能伤害'], 'q')
    return {
      avg: eDmg.avg + qDmg.avg,
      dmg: eDmg.dmg + qDmg.dmg
    }
  }
}, {
  title: '点赞每跳治疗',
  dmg: ({ attr, calc, talent }, { heal }) => heal(talent.q['持续治疗2'][0] * calc(attr.hp) / 100 + talent.q['持续治疗2'][1] * 1)
}]

export const defDmgIdx = 2
export const mainAttr = 'atk,hp,cpct,cdmg'

export const buffs = [{
  cons: 1,
  title: '班尼特1命：Q攻击力提升比例提高20%'
}, {
  cons: 6,
  title: '班尼特6命：获得15%火伤加成',
  data: {
    dmg: 15
  }
}]
