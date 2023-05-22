export default function (staticIdx, keyIdx) {
  return {
    '「我」的诞生': [
      keyIdx(1, 'a3Dmg', '追加攻击伤害提高[a3Dmg]%')
    ],
    今日亦是和平的一日: (tables) => {
      return {
        title: '根据能量上限提高数据',
        data: {
          dmg: () => tables
        }
      }
    },
    别让世界静下来: [staticIdx(1, 'recharge')],
    天才们的休憩: [staticIdx(1, 'atkPct')],
    拂晓之前: [staticIdx(1, 'cdmg')],
    早餐的仪式感: [staticIdx(1, 'dmg')],
    智库: [],
    灵钥: [],
    睿见: [],
    银河铁道之夜: []
  }
}