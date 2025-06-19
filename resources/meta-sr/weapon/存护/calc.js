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
    ],
    她已闭上双眼: [
      staticIdx(1, 'hpPct'),
      staticIdx(2, 'recharge'),
      keyIdx('装备者生命降低时，使我方全体造成的伤害提高[dmg]%', 'dmg', 3)
    ],
    织造命运之线: [
      staticIdx(1, 'effDef'),
      (tables) => {
        return {
          title: '基于防御力提高造成的伤害[dmg]%',
          data: {
            dmg: ({ calc, attr }) => Math.min(calc(attr.def) * tables[2] / 100, 32)
          }
        }
      }
    ],
    命运从未公平: [
      staticIdx(1, 'defPct'),
      (tables) => {
        return {
          title: '装备者为我方提供护盾时，暴击伤害提高[cdmg]%。追击命中敌方时，使敌方目标受到伤害提高[enemydmg]%',
          data: {
            cdmg: tables[2],
            enemydmg: tables[4]
          }
        }
      }
    ],
    两个人的演唱会: [
      staticIdx(1, 'defPct'),
      (tables) => {
        return {
          title: '基于场上持有护盾的角色数目，提高装备者造成的伤害[dmg]%',
          data: {
            dmg: tables[2] * 4
          }
        }
      }
    ]
  }
}
