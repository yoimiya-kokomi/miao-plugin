export default function (staticIdx, keyIdx) {
  return {
    以世界之名: [
      keyIdx('对陷入负面效果的敌人伤害提高[dmg]%，释放战技的功力提高[atkPct]%', { dmg: 1, atkPct: 3 })
    ],
    决心如汗珠般闪耀: [
      keyIdx('攻陷状态敌方防御力降低[enemyDef]%', 'enemyDef', 2)
    ],
    匿影: [],
    后会有期: [],
    幽邃: [
      keyIdx('使装备者的效果命中提高[effPct]%', 'effPct', 1)
    ],
    延长记号: [
      staticIdx(1, 'stance'),
      keyIdx('对触电或风化状态的敌方目标伤害提高[dmg]%', 'dmg', 2)
    ],
    晚安与睡颜: [
      (tables) => {
        return {
          title: '3层Buff提高伤害[dmg]%',
          data: {
            dmg: tables[1] * 3
          }
        }
      }
    ],
    渊环: [
      keyIdx('对减速状态的目标伤害提高[dmg]%', 'dmg', 1)
    ],
    猎物的视线: [
      staticIdx(1, 'effPct')
    ],
    新手任务开始前: [
      staticIdx(1, 'effPct')
    ],
    雨一直下: [
      staticIdx(1, 'effPct'),
      keyIdx('对大于3个负面效果的敌人提升暴击率[cpct]%', 'cpct', 2),
      keyIdx('以太编码提升伤害[dmg]%', 'dmg', 3)
    ],
    只需等待: [
      staticIdx(1, 'dmg'),
      (tables) => {
        return {
          title: '释放攻击3层Buff提高速度[speedPct]%',
          data: {
            speedPct: tables[2] * 3
          }
        }
      }
    ],
    孤独的疗愈: [
      staticIdx(1, 'stance'),
      keyIdx('装备者造成的持续伤害提高[dotDmg]%', 'dotDmg', 2)
    ],
    重塑时光之忆: [
      staticIdx(1, 'effPct'),
      (tables) => {
        return {
          title: '4层Buff提高攻击力[atkPct]%，造成的持续伤害无视目标[dotIgnore]%的防御力',
          data: {
            atkPct: tables[2] * 4,
            dotIgnore: tables[3] * 4
          }
        }
      }
    ],
    好戏开演: [
      (tables) => {
        return {
          title: '3层Buff提高造成的伤害[dmg]%',
          data: {
            dmg: tables[1] * 3
          }
        }
      },
      (tables) => {
        return {
          check: ({ attr, calc }) => calc(attr.effPct) >= 80,
          title: '攻击力提高[atkPct]%',
          data: {
            atkPct: tables[2]
          }
        }
      }
    ],
    行于流逝的岸: [
      staticIdx(1, 'cdmg'),
      (tables) => {
        return {
          title: '造成的伤害提高[dmg]%，终结技伤害额外提高[qDmg]%',
          data: {
            dmg: tables[2],
            qDmg: tables[3]
          }
        }
      }
    ],
    无边曼舞: [
      staticIdx(1, 'cpct'),
      keyIdx('对处于防御降低或减速状态下的敌人暴击伤害提高[cdmg]%', 'cdmg', 2)
    ],
    那无数个春天: [
      staticIdx(1, 'effPct'),
      (tables) => {
        return {
          title: '【穷寇】状态下，敌方目标受到的伤害提高[enemydmg]%',
          data: {
            enemydmg: tables[2] + tables[3]
          }
        }
      }
    ]
  }
}
