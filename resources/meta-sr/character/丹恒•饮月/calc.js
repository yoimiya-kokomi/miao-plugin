export const details = [{
  title: '普攻伤害',
  dmg: ({ talent, cons }, dmg) => {
    // 2段伤害，比例3:7
    let dynamicDmg = cons >= 1 ? talent.t['伤害提高'] * 100 * 2 : talent.t['伤害提高'] * 100
    let a1dmg = dmg(talent.a['技能伤害'] * 0.3, 'a')
    let a2dmg = dmg.dynamic(talent.a['技能伤害'] * 0.7, 'a', { dynamicDmg })

    return {
      dmg: a1dmg.dmg + a2dmg.dmg,
      avg: a1dmg.avg + a2dmg.avg
    }
  }
}, {
  title: '1级强普伤害',
  dmg: ({ talent, cons }, dmg) => {
    // 3段伤害，比例33:33:34
    let dynamicDmg = cons >= 1 ? talent.t['伤害提高'] * 100 * 2 : talent.t['伤害提高'] * 100
    let a1dmg = dmg(talent.a2['瞬华·单体伤害'] * 0.33, 'a')
    let a2dmg = dmg.dynamic(talent.a2['瞬华·单体伤害'] * 0.33, 'a', { dynamicDmg })
    let a3dmg = dmg.dynamic(talent.a2['瞬华·单体伤害'] * 0.34, 'a', { dynamicDmg: dynamicDmg * 2 })

    return {
      dmg: a1dmg.dmg + a2dmg.dmg + a3dmg.dmg,
      avg: a1dmg.avg + a2dmg.avg + a3dmg.avg
    }
  }
}, {
  title: '2级强普伤害(扩散)',
  dmg: ({ talent, cons }, dmg) => {
    // 主目标5段伤害，比例20:20:20:20:20
    // 副目标2段伤害，比例50:50
    let dynamicDmg = cons >= 1 ? talent.t['伤害提高'] * 100 * 2 : talent.t['伤害提高'] * 100
    let dynamicCdmg = talent.e['暴击伤害提高'] * 100
    let a1dmg = dmg(talent.a2['天矢阴·单体伤害'] * 0.2, 'a')
    let a2dmg = dmg.dynamic(talent.a2['天矢阴·单体伤害'] * 0.2, 'a', { dynamicDmg })
    let a3dmg = dmg.dynamic(talent.a2['天矢阴·单体伤害'] * 0.2, 'a', { dynamicDmg: dynamicDmg * 2 })
    let a4dmg = dmg.dynamic(talent.a2['天矢阴·单体伤害'] * 0.2, 'a', { dynamicDmg: dynamicDmg * 3, dynamicCdmg })
    let a5dmg = dmg.dynamic(talent.a2['天矢阴·单体伤害'] * 0.2, 'a', { dynamicDmg: dynamicDmg * 4, dynamicCdmg: dynamicCdmg * 2 })

    let a1plusdmg = dmg.dynamic(talent.a2['天矢阴·相邻目标伤害'] * 0.5, 'a', { dynamicDmg: dynamicDmg * 3, dynamicCdmg })
    let a2plusdmg = dmg.dynamic(talent.a2['天矢阴·相邻目标伤害'] * 0.5, 'a', { dynamicDmg: dynamicDmg * 4, dynamicCdmg: dynamicCdmg * 2 })

    return {
      dmg: a1dmg.dmg + a2dmg.dmg + a3dmg.dmg + a4dmg.dmg + a5dmg.dmg + (a1plusdmg.dmg + a2plusdmg.dmg) * 2,
      avg: a1dmg.avg + a2dmg.avg + a3dmg.avg + a4dmg.avg + a5dmg.avg + (a1plusdmg.avg + a2plusdmg.avg) * 2
    }
  }
}, {
  title: '3级强普伤害(扩散)',
  params: { level3A: true },
  dmg: ({ talent, cons }, dmg) => {
    // 主目标7段伤害，前六段比例14.2，最后一段14.8
    // 副目标4段伤害，比例25:25:25:25
    let dynamicDmg = cons >= 1 ? talent.t['伤害提高'] * 100 * 2 : talent.t['伤害提高'] * 100
    let dynamicCdmg = talent.e['暴击伤害提高'] * 100
    let a1dmg = dmg(talent.a2['盘拏耀跃·单体伤害'] * 0.142, 'a')
    let a2dmg = dmg.dynamic(talent.a2['盘拏耀跃·单体伤害'] * 0.142, 'a', { dynamicDmg })
    let a3dmg = dmg.dynamic(talent.a2['盘拏耀跃·单体伤害'] * 0.142, 'a', { dynamicDmg: dynamicDmg * 2 })
    let a4dmg = dmg.dynamic(talent.a2['盘拏耀跃·单体伤害'] * 0.142, 'a', { dynamicDmg: dynamicDmg * 3, dynamicCdmg })
    let a5dmg = dmg.dynamic(talent.a2['盘拏耀跃·单体伤害'] * 0.142, 'a', { dynamicDmg: dynamicDmg * 4, dynamicCdmg: dynamicCdmg * 2 })
    let a6dmg = dmg.dynamic(talent.a2['盘拏耀跃·单体伤害'] * 0.142, 'a', { dynamicDmg: dynamicDmg * 5, dynamicCdmg: dynamicCdmg * 3 })

    let a1plusdmg = dmg.dynamic(talent.a2['盘拏耀跃·相邻目标伤害'] * 0.25, 'a', { dynamicDmg: dynamicDmg * 3, dynamicCdmg })
    let a2plusdmg = dmg.dynamic(talent.a2['盘拏耀跃·相邻目标伤害'] * 0.25, 'a', { dynamicDmg: dynamicDmg * 4, dynamicCdmg: dynamicCdmg * 2 })
    let a3plusdmg = dmg.dynamic(talent.a2['盘拏耀跃·相邻目标伤害'] * 0.25, 'a', { dynamicDmg: dynamicDmg * 5, dynamicCdmg: dynamicCdmg * 3 })

    dynamicDmg = cons >= 1 ? talent.t['伤害提高'] * 100 * 10 : talent.t['伤害提高'] * 100 * 6
    let a7dmg = dmg.dynamic(talent.a2['盘拏耀跃·单体伤害'] * 0.148, 'a', { dynamicDmg, dynamicCdmg: dynamicCdmg * 4 })
    let a4plusdmg = dmg.dynamic(talent.a2['盘拏耀跃·相邻目标伤害'] * 0.25, 'a', { dynamicDmg, dynamicCdmg: dynamicCdmg * 4 })

    return {
      dmg: a1dmg.dmg + a2dmg.dmg + a3dmg.dmg + a4dmg.dmg + a5dmg.dmg + a6dmg.dmg + a7dmg.dmg + (a1plusdmg.dmg + a2plusdmg.dmg + a3plusdmg.dmg + a4plusdmg.dmg) * 2,
      avg: a1dmg.avg + a2dmg.avg + a3dmg.avg + a4dmg.avg + a5dmg.avg + a6dmg.avg + a7dmg.avg + (a1plusdmg.avg + a2plusdmg.avg + a3plusdmg.avg + a4plusdmg.avg) * 2
    }
  }
}, {
  title: '终结技伤害(扩散)',
  dmg: ({ talent, cons }, dmg) => {
    // 3段伤害，比例3:3:4
    let dynamicDmg = cons >= 1 ? talent.t['伤害提高'] * 100 * 2 : talent.t['伤害提高'] * 100
    let a1dmg = dmg(talent.q['目标伤害'] * 0.3, 'q')
    let a2dmg = dmg.dynamic(talent.q['目标伤害'] * 0.3, 'q', { dynamicDmg })
    let a3dmg = dmg.dynamic(talent.q['目标伤害'] * 0.4, 'q', { dynamicDmg: dynamicDmg * 2 })

    let a1plusdmg = dmg(talent.q['相邻目标伤害'] * 0.3, 'q')
    let a2plusdmg = dmg.dynamic(talent.q['相邻目标伤害'] * 0.3, 'q', { dynamicDmg })
    let a3plusdmg = dmg.dynamic(talent.q['相邻目标伤害'] * 0.4, 'q', { dynamicDmg: dynamicDmg * 2 })

    return {
      dmg: a1dmg.dmg + a2dmg.dmg + a3dmg.dmg + (a1plusdmg.dmg + a2plusdmg.dmg + a3plusdmg.dmg) * 2,
      avg: a1dmg.avg + a2dmg.avg + a3dmg.avg + (a1plusdmg.avg + a2plusdmg.avg + a3plusdmg.avg) * 2
    }
  }
}]

export const defDmgIdx = 3
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '行迹-起蛰：对拥有虚数属性弱点的敌人造成伤害时，暴击伤害提高24%',
  tree: 3,
  data: {
    cdmg: 24
  }
}, {
  title: '天赋-亢心：丹恒•饮月施放每段攻击后获得1层【亢心】，使自身造成的伤害提高[_dmg]%，该效果可以叠加6层，持续至自身回合结束。',
  check: ({ cons }) => cons < 1,
  data: {
    _dmg: ({ talent }) => talent.t['伤害提高'] * 100
  }
}, {
  title: '天赋-亢心：丹恒•饮月施放每段攻击后获得1层【亢心】，使自身造成的伤害提高[_dmg]%，该效果可以叠加10层，持续至自身回合结束。',
  cons: 1,
  data: {
    _dmg: ({ talent }) => talent.t['伤害提高'] * 100
  }
}, {
  title: '叱咤：施放2级或3级强化普攻时，从第4段攻击开始，每段攻击前获得一层叱咤，使暴击伤害提高[_cdmg]%，最多叠加4层',
  data: {
    _cdmg: ({ talent }) => talent.e['暴击伤害提高'] * 100
  }
}, {
  title: '饮月6命：满Buff时使3级强普的虚数属性抗性穿透提高60%',
  cons: 6,
  check: ({ params }) => params.level3A === true,
  data: {
    kx: 60
  }
}]

export const createdBy = 'Aluxes'
