export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '战技伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: '天赋追加攻击',
  dmg: ({ talent }, dmg) => dmg(talent.t['追加攻击'], 't')
}, {
  title: '天赋附加伤害',
  dmg: ({ talent }, dmg) => dmg(talent.t['回合附加伤害'], 't')
}, {
  title: '终结技伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}]

export const defDmgIdx = 4
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '彦卿天赋：智剑连心提高[cpct]%暴击率和[cdmg]%爆伤',
  data: {
    cpct: ({ talent }) => talent.t['暴击率提高'] * 100,
    cdmg: ({ talent }) => talent.t['爆伤提高'] * 100
  }
}, {
  title: '终结技：释放终结技提高60%暴击率，智剑连心提高爆伤[qCdmg]%',
  data: {
    qCpct: 60,
    qCdmg: ({ talent }) => talent.q['暴伤提高'] * 100
  }
}, {
  title: '彦卿4命：生命值大于80%时提高12%的冰抗穿透',
  cons: 4,
  data: {
    kx: 12
  }
}, {
  title: '行迹-轻吕：触发暴击时，速度提高10%',
  tree: 3,
  data: {
    speedPct: 10
  }
}, {
  title: '行迹-颂冰：攻击对冰属性弱点敌人额外造成等同于彦卿30%攻击力的冰属性附加伤害',
  tree: 1,
  data: {
    aPlus: ({ calc, attr }) => calc(attr.atk) * 0.3,
    ePlus: ({ calc, attr }) => calc(attr.atk) * 0.3,
    qPlus: ({ calc, attr }) => calc(attr.atk) * 0.3,
    tPlus: ({ calc, attr }) => calc(attr.atk) * 0.3
  }
}]
