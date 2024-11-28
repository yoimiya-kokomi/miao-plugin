export default function (staticIdx, keyIdx) {
  return {
    一场术后对话: [
      staticIdx(1, 'recharge'),
      keyIdx('释放终结技时的治疗量提高[qHeal]%', 'qHeal', 2)
    ],
    同一种心情: [
      staticIdx(1, 'heal')
    ],
    嘉果: [],
    时节不居: [
      staticIdx(1, 'hpPct'),
      staticIdx(2, 'heal')
    ],
    暖夜不会漫长: [
      staticIdx(1, 'hpPct')
    ],
    此时恰好: [
      staticIdx(1, 'effDef'),
      (tables) => {
        return {
          title: '基于效果抵抗，提高治疗量[heal]%',
          data: {
            heal: ({ attr, calc }) => Math.min(tables[3], calc(attr.effDef) * tables[2] / 100)
          }
        }
      }
    ],
    物穰: [
      keyIdx('释放战技与终结技时，治疗量提高[eHeal]%', { eHeal: 1, qHeal: 1 })
    ],
    等价交换: [],
    蕃息: [],
    棺的回响: [
      staticIdx(1, 'atkPct'),
      keyIdx('释放终结技后，速度提升[speed]', 'speed', 3)
    ],
    '嘿，我在这儿': [
      staticIdx(1, 'hpPct'),
      keyIdx('释放战技时，治疗量提高[heal]%', 'heal', 2)
    ],
    惊魂夜: [
      staticIdx(1, 'recharge'),
      (tables) => {
        return {
          title: '提供治疗时，5层提供目标攻击力[atkPct]%',
          data: {
            atkPct: tables[3] * 5
          }
        }
      }
    ],
    何物为真: [
      staticIdx(1, 'stance')
    ],
    唯有香如故: [
      staticIdx(1, 'stance'),
      (tables) => {
        return {
          title: '终结技攻击敌方目标后，敌方目标受到的伤害提高[enemyDmg]%',
          sort: 9,
          data: {
            enemyDmg: ({ attr, calc }) => calc(attr.stance) >= 150 ? (tables[2] + tables[3]) : tables[2]
          }
        }
      }
    ],
    梦的蒙太奇: [
      staticIdx(1, 'speedPct')
    ]
  }
}
