export default function (staticIdx, keyIdx) {
  return {
    花花世界迷人眼: [
      staticIdx(1, 'cdmg'),
      (tables) => {
        return {
          title: '无视对方防御力[ignore]%，欢愉度提升[joyPct]%',
          data: {
            ignore: tables[2] * 4,
            joyPct: tables[3]
          }
        }
      }
    ],
    当她决定看见: [
      staticIdx(1, 'speedPct'),
      keyIdx('【上上签】增加[cpct]%暴击率,增加[cdmg]%暴击伤害', {
        cpct: 2, cdmg: 3
      })
    ],
    今日好手气: [
      staticIdx(1, 'cpct')
    ],
    菇菇嘎嘎历险记: [
      staticIdx(1, 'joy'),
      keyIdx('敌方全体受到的欢愉伤害提高[xeEnemydmg]%', 'xeEnemydmg', 2)
    ],
    '未来，有我们一起': [
      staticIdx(1, 'cdmg'),
      keyIdx('施放终结技后，使我方全体欢愉度提高[joyPct]%', 'joyPct', 2)
    ],
    欢愉满溢祝福: [
      staticIdx(1, 'atkPct')
    ],
    欢迎来到银河城: [
      staticIdx(1, 'speedPct'),
      keyIdx('造成的欢愉伤害无视目标[xeIgnore]%的防御力。装备者对自身单体施放终结技时，获得[punchline]点【笑点】', {
        xeIgnore: 2, punchline: 3
      })
    ],
    邂逅于下一个花季: [
      staticIdx(1, 'cdmg'),
      staticIdx(2, 'recharge'),
      keyIdx('施放欢愉技时，使敌方目标受到的伤害提高[enemydmg]%', 'enemydmg', 3)
    ]
  }
}
