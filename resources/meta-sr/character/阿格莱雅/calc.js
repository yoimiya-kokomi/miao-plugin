export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '强化普攻伤害·主目标',
  params: { Supreme_Stance: true, cons6_a2:true },
  dmg: ({ talent }, dmg) => dmg(talent.a2['技能伤害'], 'a')
}, {
  title: '强化普攻伤害·相邻目标',
  params: { Supreme_Stance: true, cons6_a2:true },
  dmg: ({ talent }, dmg) => dmg(talent.a2['相邻目标伤害'], 'a')
}, {
  title: 'Q后忆灵技伤害·主目标',
  params: { Supreme_Stance: true },
  dmg: ({ talent }, dmg) => dmg(talent.me['技能伤害'], 'me')
}, {
  title: 'Q后忆灵技伤害·相邻目标',
  params: { Supreme_Stance: true },
  dmg: ({ talent }, dmg) => dmg(talent.me['相邻目标伤害'], 'me')
}, {
  title: 'Q后天赋附加伤害',
  params: { Supreme_Stance: true },
  dmg: ({ talent }, dmg) => dmg(talent.t['附加伤害'])
}]

export const defDmgIdx = 1
export const defParams = { Memosprite: true }
export const mainAttr = 'atk,cpct,cdmg,speed'

export const buffs = [ {
  check: ({ params }) => params.Supreme_Stance === true,
  title: '行迹-短视之惩：处于【至高之姿】状态时，阿格莱雅与衣匠的攻击力提高，提高数值等同于阿格莱雅速度的720%+衣匠速度的360%（按满层计算），总计[atkPlus]',
  sort: 9,
  tree: 1,
  data: {
    atkPlus: ({ talent, attr, cons, calc }) => {
      let num = cons > 3 ? 7 : 6
      let plus = calc(attr.speed) * (1 + talent.q['速度提高'] * num) * 720 / 100 + (calc(attr.speed) * 0.35 + talent.mt['速度提高'] * num) * 360 / 100
      return plus
    }
  }
}, {
  title: '阿格莱雅1魂：处于【间隙织线】状态下的敌人受到的伤害提高[enemydmg]%',
  cons: 1,
  data: {
    enemydmg: 15,
  }
}, {
  title: '阿格莱雅2魂：当阿格莱雅或衣匠行动时，使阿格莱雅与衣匠造成的伤害最多可以无视目标[ignore]%的防御力',
  cons: 2,
  data: {
    ignore: 42
  }
}, {
  title: '阿格莱雅6魂：当阿格莱雅处于【至高之姿】状态时，自身与衣匠的雷属性抗性穿透提高[kx]%。',
  cons: 6,
  data: {
    kx: 20
  }
}, {
  check: ({ params }) => params.cons6_a2 === true,
  title: '当阿格莱雅或衣匠的速度高于320点时，连携攻击伤害提高[aDmg]%。',
  cons: 6,
  data: {
    aDmg: 60
  }
}]

export const createdBy = '冰翼'
