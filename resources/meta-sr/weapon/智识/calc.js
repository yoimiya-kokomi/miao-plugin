export default function (staticIdx, keyIdx) {
  return {
    '「我」的诞生': [
      (tables) => {
        return {
          title: '敌方目标当前生命值百分比小于等于50%追加伤害提高[a3Dmg]%',
          data: {
            a3Dmg: tables[1] + tables[2]
          }
        }
      }
    ],
    今日亦是和平的一日: (tables) => {
      return {
        title: '根据能量上限提高数据',
        data: {
          dmg: ({ sp }) => tables[1] * Math.min(sp, 160)
        }
      }
    },
    别让世界静下来: [
      staticIdx(1, 'recharge'),
      keyIdx('终结技造成的伤害提高[qDmg]%', 'qDmg', 2)
    ],
    天才们的休憩: [
      staticIdx(1, 'atkPct'),
      keyIdx('消灭敌方目标后爆伤提高[cdmg]%', 'cdmg', 2)
    ],
    拂晓之前: [
      staticIdx(1, 'cdmg'),
      keyIdx('战技和终结技造成的伤害提高[eDmg]%，追加攻击造成的伤害提高[a3Dmg]%', { eDmg: 2, qDmg: 2, a3Dmg: 3 })
    ],
    早餐的仪式感: [
      staticIdx(1, 'dmg'),
      (tables) => {
        return {
          title: '3层Buff下提高攻击力[atkPct]%',
          data: {
            atkPct: tables[2] * 3
          }
        }
      }
    ],
    智库: [
      keyIdx('使装备者终结技造成的伤害提高[qDmg]%', 'qDmg', 1)
    ],
    灵钥: [],
    睿见: [
      keyIdx('施放终结技时攻击力提高[atkPct]%', 'atkPct', 1)
    ],
    银河铁道之夜: [
      (tables) => {
        return {
          title: '3个敌方目标提高攻击力[atkPct]%，弱点击破时伤害提高[dmg]%',
          data: {
            atkPct: tables[1] * 3,
            dmg: tables[2]
          }
        }
      }
    ]
  }
}