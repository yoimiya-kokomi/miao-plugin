export default function (staticIdx, keyIdx) {
  return {
    以世界之名: [
      keyIdx('对陷入负面效果的敌人伤害提高[dmg]%，释放战技的功力提高[atkPct]%', { dmg: 1, atkPct: 3 })
    ],
    决心如汗珠般闪耀: [
      keyIdx('攻陷状态敌方防御力降低[ignore]%', 'ignore', 2)
    ],
    匿影: [],
    后会有期: [],
    幽邃: [
      keyIdx('使装备者的效果命中提高[effPct]%', 'effPct', 1)
    ],
    延长记号: [
      staticIdx(1, 'stance'),
      keyIdx('对触电或风化状态的地方目标伤害提高[dmg]%', 'dmg', 2)
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
    ]
  }
}
