export const mainAttr = 'atk,cpct,cdmg'
export const defParams = { comradeAtk: 3000 }

export const buffs = [
  {
    cons: 1,
    check: ({ params }) => params.isQ_Enhanced && params.isComradeDmg,
    title: '1魂-蜕却旧鳞的荒龙：【同袍】全属性抗性穿透提高[kx]%',
    data: {
      kx: 18
    }
  },
  {
    cons: 6,
    title: '6魂-草木微尘皆入梦中：场上存在【同袍】时，敌方全体受到的伤害提高[enemydmg]%',
    data: {
      enemydmg: 20
    }
  },
  {
    cons: 6,
    check: ({ params }) => params.isComradeDmg,
    title: '6魂-草木微尘皆入梦中：【同袍】造成伤害时，无视敌方目标[ignore]%的防御力',
    data: {
      ignore: 12
    }
  }
]

export const details = [
  {
    title: '普攻伤害',
    dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
  },
  {
    title: '战技护盾量',
    dmg: ({ calc, attr, talent }, dmg) => dmg.shield(calc(attr.atk) * talent.e['护盾•百分比攻击'] + talent.e['护盾•固定值'])
  },
  {
    title: '终结技伤害',
    dmgKey: 'q',
    dmg: ({ talent }, dmg) => dmg(talent.q['全体伤害'], 'q')
  },
  {
    title: '终结技护盾量',
    dmg: ({ calc, attr, talent }, dmg) => dmg.shield(calc(attr.atk) * talent.q['护盾•百分比攻击'] + talent.q['护盾•固定值'])
  },
  {
    title: '天赋龙灵护盾量',
    params: { isQ_Enhanced: true },
    dmg: ({ calc, attr, talent, cons, params }, dmg) => {
      let shieldVal = calc(attr.atk) * talent.t['护盾•百分比攻击'] + talent.t['护盾•固定值']
      if (cons >= 2 && params.isQ_Enhanced) {
        shieldVal *= 2
      }
      return dmg.shield(shieldVal)
    }
  },
  {
    title: ({ cons, trees, params }) => `终结技强化龙灵追击(同袍攻击:${params.comradeAtk})${cons >= 2 ? '(2魂+)' : ''}${trees['103'] ? '(峥嵘)' : ''}`,
    params: { isQ_Enhanced: true, isComradeDmg: true },
    dmg: (ds, dmg) => {
      const { talent, calc, attr, params, cons, trees } = ds
      const comradeAtk = params.comradeAtk || 0
      const selfDmgValue = calc(attr.atk) * talent.q['追加攻击伤害']
      let comradePct = talent.q['附加伤害']
      if (cons >= 2) comradePct *= 2
      const comradeDmgValue = comradeAtk * comradePct
      const zhengrongDmgValue = trees['103'] ? comradeAtk * 0.40 : 0
      const finalSelfDmg = dmg.basic(selfDmgValue, 't')
      const finalComradeDmg = dmg.basic(comradeDmgValue + zhengrongDmgValue, 't') 
      return {
        dmg: finalSelfDmg.dmg + finalComradeDmg.dmg,
        avg: finalSelfDmg.avg + finalComradeDmg.avg,
      }
    }
  },
  {
    title: ({ params }) => `6命终结技【同袍】附加伤害(同袍攻击:${params.comradeAtk})`,
    cons: 6,
    params: { isQ_Enhanced: true, isComradeDmg: true },
    dmg: (ds, dmg) => {
      const comradeAtk = ds.params.comradeAtk || 0
      const totalValue = comradeAtk * 3.30
      return dmg.basic(totalValue, 't')
    }
  }
]

export const defDmgKey = 'q'