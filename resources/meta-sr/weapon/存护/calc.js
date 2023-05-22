export default function (staticIdx, keyIdx) {
  return {
    余生的第一天: [
      staticIdx(1, 'defPct')
    ],
    制胜的瞬间: [
      staticIdx(1, 'defPct'),
      staticIdx(2, 'effPct'),
      keyIdx('受到攻击时，防御力提高[defPct]%', 'defPct', 3)
    ],
    宇宙市场趋势: [
      staticIdx(1, 'defPct')
    ],
    开疆: [],
    戍御: [],
    我们是地火: [],
    朗道的选择: [],
    琥珀: [
      staticIdx(1, 'defPct'),
      keyIdx('生命值小于50%时，防御力提高[defPct]%', 'defPct', 2)
    ],
    记忆的质料: [
      staticIdx(1, 'effDef')
    ],
    '这就是我啦！': [
      staticIdx(1, 'defPct'),
      (tables) => {
        return {
          title: '基于防御力提高终结技伤害值[qInc]',
          data: {
            qInc: ({ calc, attr }) => calc(attr.def) * tables[2] / 100
          }
        }
      }
    ]
  }
}