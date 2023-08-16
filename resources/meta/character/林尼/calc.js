export const details = [{
  title: '满蓄力重击伤害',
  dmgKey: 'a2',
  dmg: ({ talent }, dmg) => dmg(talent.a['隐具魔术箭伤害'], 'a2')
}, {
  title: '礼花术弹伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['礼花术弹伤害'], 'a2')
}, {
  title: '满层E伤害',
  dmg: ({ talent }, dmg) => {
    let eDmg = dmg(talent.e['技能伤害'], 'e')
    let ePlusDmg = dmg(talent.e['技能伤害加成'] * 5, 'e')
    return {
      dmg: eDmg.dmg + ePlusDmg.dmg,
      avg: eDmg.avg + ePlusDmg.avg
    }
  }
}, {
  title: 'Q总伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'] + talent.q['引爆礼花伤害'], 'q')
}]

export const defDmgIdx = 0
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '天赋-惊险演出：基于攻击力的80%，满蓄力重击伤害提高[a2Plus]',
  data: {
    a2Plus: ({ attr, calc }) => calc(attr.atk) * 0.8
  }
}, {
  title: '天赋-完场喝彩：队伍有三名火元素角色时，对处于火元素影响下的敌人造成的伤害提升[dmg]%',
  data: {
    dmg: 100
  }
}, {
  title: '林尼2命：在场6秒后，暴击伤害提高60%',
  cons: 2,
  data: {
    cdmg: 60
  }
}, {
  title: '林尼4命：重击命中敌人后，降低敌人火元素抗性20%',
  cons: 4,
  data: {
    kx: 20
  }
}, {
  title: '林尼6命：发射隐具魔术箭时，额外发射一枚礼花术弹·重奏，造成礼花术弹80%的伤害',
  cons: 6,
  data: {
    a2Plus: ({ talent, attr, calc }) => talent.a['礼花术弹伤害'] / 100 * calc(attr.atk) * 0.8
  }
}]
