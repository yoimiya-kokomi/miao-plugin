export default function (staticIdx, keyIdx) {
  return {
    '「我」的诞生': [
      (tables) => {
        return {
          title: '敌方目标当前生命值百分比小于等于50%追加伤害提高[tDmg]%',
          data: {
            tDmg: tables[1] + tables[2]
          }
        }
      }
    ],
    今日亦是和平的一日: (tables) => {
      return {
        title: '根据能量上限提高数据',
        data: {
          dmg: ({ attr }) => tables[1] * Math.min(attr.sp, 160)
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
      keyIdx('战技和终结技造成的伤害提高[eDmg]%，追加攻击造成的伤害提高[tDmg]%', { eDmg: 2, qDmg: 2, tDmg: 3 })
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
    ],
    '片刻，留在眼底': [
      staticIdx(1, 'cdmg'),
      (tables) => {
        return {
          title: '根据装备者的能量上限提高伤害[qDmg]%',
          data: {
            qDmg: ({ attr }) => tables[2] * Math.min(attr.sp, 180)
          }
        }
      }
    ],
    银河沦陷日: [
      staticIdx(1, 'atkPct'),
      keyIdx('提高暴击伤害[cdmg]%', 'cdmg', 2)
    ],
    谐乐静默之后: [
      staticIdx(1, 'stance'),
      keyIdx('施放终结技后速度提高[speedPct]%', 'speedPct', 2)
    ],
    不息的演算: [
      staticIdx(1, 'atkPct'),
      (tables) => {
        return {
          title: '施放攻击击中五名敌方目标，使攻击力额外提高[atkPct]%，速度提升[speedPct]%',
          data: {
            atkPct: tables[2] * 5,
            speedPct: tables[3]
          }
        }
      }
    ],
    偏偏希望无价: [
      staticIdx(1, 'cpct'),
      (tables) => {
        return {
          check: ({ attr }) => attr.cdmg > 120,
          title: '基于暴击伤害，追加攻击伤害提高[tDmg]%，终结技或追加攻击伤害无视[qIgnore]%防御',
          sort: 9,
          data: {
            tDmg: ({ attr }) => Math.min(Math.floor((attr.cdmg - 120) / 20), 4) * tables[2],
            qIgnore: tables[3],
            tIgnore: tables[3]
          }
        }
      }
    ],
    '忍法帖•缭乱破魔': [
      staticIdx(1, 'stance')
    ]
  }
}
