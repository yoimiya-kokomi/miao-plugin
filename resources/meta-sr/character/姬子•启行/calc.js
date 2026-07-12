export const details = [{
  title: '普攻',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '助战技裁决模式',
  params: { caijue: true },
  dmg: ({ talent, cons }, dmg) => dmg((talent.t2['群体伤害'] + talent.t2['弹射伤害'] * (cons >= 1 ? 5 : 4)) * (cons >= 2 ? 1.3 : 1), 't2')
}, {
  title: '大招裁决模式',
  params: { caijue: true },
  dmg: ({ talent, cons }, dmg) => {
    return {
      dmg: (dmg(talent.q3['弹射伤害'] * 2 * 3, 'q3').dmg + dmg(talent.q3['群体伤害'], 'q3').dmg + 
      dmg(talent.q2['技能伤害'], 'q2').dmg + dmg(talent.q['弹射伤害'] * 3, 'q').dmg) * (cons >= 2 ? 1.3 : 1),
      avg: (dmg(talent.q3['弹射伤害'] * 2 * 3, 'q3').avg + dmg(talent.q3['群体伤害'], 'q3').avg + 
      dmg(talent.q2['技能伤害'], 'q2').avg + dmg(talent.q['弹射伤害'] * 3, 'q').avg) * (cons >= 2 ? 1.3 : 1),
    }
  }
}, {
  title: '助战技歼破模式',
  params: { jianpo: true },
  dmg: ({ talent, cons }, dmg) => dmg((talent.t2['群体伤害'] + talent.t2['弹射伤害'] * (cons >= 1 ? 5 : 4)) * (cons >= 2 ? 1.3 : 1), 't2')
}, {
  title: '大招歼破模式',
  params: { jianpo: true },
  dmg: ({ talent, cons }, dmg) => {
    return {
      dmg: (dmg(talent.q3['弹射伤害'] * 2 * 3, 'q3').dmg + dmg(talent.q3['群体伤害'], 'q3').dmg + 
      dmg(talent.q2['技能伤害'], 'q2').dmg + dmg(talent.q['弹射伤害'] * 3, 'q').dmg) * (cons >= 2 ? 1.3 : 1),
      avg: (dmg(talent.q3['弹射伤害'] * 2 * 3, 'q3').avg + dmg(talent.q3['群体伤害'], 'q3').avg + 
      dmg(talent.q2['技能伤害'], 'q2').avg + dmg(talent.q['弹射伤害'] * 3, 'q').avg) * (cons >= 2 ? 1.3 : 1),
    }
  }
}]

export const defDmgIdx = 4
export const mainAttr = 'atk,cpct,cdmg,dmg'

export const buffs = [{
  title: '使用助战技提高全属性抗性穿透提高[kx]%、暴击伤害提高[cdmg]%',
  data: {
    kx: 20,
    cdmg: 80
  }
}, {
  title: '【领航旗语】使我方全体造成的伤害提高[dmg]%',
  data: {
    dmg: 20
  }
}, {
  title: '同行协议：裁决：伤害提高[dmg]%，造成的终结技伤害额外提高[qDmg]%',
  check: ({ params }) => params.caijue === true,
  data: {
    dmg: 100,
    qDmg: 100
  }
}, {
  title: '同行协议：歼破：暴击伤害提高[cdmg]%，战技造成的暴击伤害额外提高[eCdmg]%',
  check: ({ params }) => params.jianpo === true,
  data: {
    cdmg: 200
  }
}, {
  title: '姬子启行1魂：发动助战技时，造成额外伤害的效果次数增加1次',
  cons: 1
}, {
  title: '姬子启行2魂：终结技和助战技造成的伤害为原伤害的130%',
  cons: 2
}, {
  title: '姬子启行4魂：全属性抗性穿透额外提高[kx]%',
  cons: 4,
  data: {
    kx: 10
  }
}, {
  title: '姬子启行6魂：火属性抗性穿透提高[kx]%，助战技造成的伤害提高[tDmg]%',
  cons: 6,
  data: {
    tDmg: 75,
    kx: 20
  }
}]

export const createdBy = '欧阳青瓜'
