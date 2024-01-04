// 注意：天赋击破伤害减伤区为0.9，终结技和秘技击破伤害减伤区为1.0
export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '20祝福·秘技击破伤害(2韧性怪)',
  params: { break: true },
  dmg: ({ talent }, { reaction }) => {
    return {
      avg: reaction('iceBreak').avg / 0.9 * (2 + 2) / 4 * 20
    }
  }
}, {
  title: '20祝福·秘技击破伤害(10韧性怪)',
  params: { break: true },
  dmg: ({ talent }, { reaction }) => {
    return {
      avg: reaction('iceBreak').avg / 0.9 * (10 + 2) / 4 * 20
    }
  }
}, {
  title: '终结技击破伤害(2韧性怪)',
  params: { break: true, qBuff: true },
  dmg: ({ talent }, { reaction }) => {
    return {
      avg: reaction('iceBreak').avg / 0.9 * (2 + 2) / 4 * talent.q['击破伤害比例']
    }
  }
}, {
  title: '终结技击破伤害(10韧性怪)',
  params: { break: true, qBuff: true },
  dmg: ({ talent }, { reaction }) => {
    return {
      avg: reaction('iceBreak').avg / 0.9 * (10 + 2) / 4 * talent.q['击破伤害比例']
    }
  }
}, {
  title: '天赋击破伤害(2韧性怪)',
  params: { qBuff: true },
  dmg: ({ talent, cons }, { reaction }) => {
    const extraBreakTd = cons * 1 >= 6 ? 2 : 0
    return {
      avg: reaction('iceBreak').avg * (2 + 2) / 4 * talent.t['击破伤害比例'] * (1 + extraBreakTd)
    }
  }
}, {
  title: '天赋击破伤害(10韧性怪)',
  params: { qBuff: true },
  dmg: ({ talent, cons }, { reaction }) => {
    const extraBreakTd = cons * 1 >= 6 ? 2 : 0
    return {
      avg: reaction('iceBreak').avg * (10 + 2) / 4 * talent.t['击破伤害比例'] * (1 + extraBreakTd)
    }
  }
}]

export const defDmgIdx = 6
export const mainAttr = 'atk,stance'

export const buffs = [{
  title: '行迹-物体呼吸中：我方全体击破特攻提高[stance]%',
  tree: 1,
  data: {
    stance: 20
  }
}, {
  title: '阮梅终结技：使我方全体全属性抗性穿透提高[kx]%',
  check: ({ params }) => params.qBuff === true,
  data: {
    kx: ({ talent }) => talent.q['抗性穿透提高'] * 100
  }
}, {
  title: '阮梅1命：终结技期间，我方全体造成伤害时无视目标[ignore]%防御力',
  check: ({ params }) => params.qBuff === true,
  cons: 1,
  data: {
    ignore: 20
  }
}, {
  title: '阮梅4命：敌方目标弱点被击破时，自身击破特攻提高[stance]%',
  check: ({ params }) => params.break === true,
  cons: 4,
  data: {
    stance: 100
  }
}, {
  title: '阮梅6命：天赋造成的击破伤害倍率额外提高200%',
  cons: 6
}]

export const createdBy = 'Aluxes'
