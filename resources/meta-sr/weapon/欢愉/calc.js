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
    ]
  }
}
