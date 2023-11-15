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
    ]
  }
}
