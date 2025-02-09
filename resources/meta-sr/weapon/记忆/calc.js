export default function (staticIdx, keyIdx) {
  return {
    溯忆: [(tables) => {
      return {
        title: '造成的伤害提高[dmg]%',
        data: {
          dmg: tables[1] * 4
        }
      }
    }],
    焚影: [],
    '多流汗，少流泪': [
      staticIdx(1, 'cpct'),
      keyIdx('造成的伤害提高[dmg]%', 'dmg', 2)
    ],
    天才们的问候: [
      staticIdx(1, 'atkPct'),
      keyIdx('普攻伤害提高[aDmg]%', 'aDmg', 2)
    ],
    胜利只在朝夕间: [
      staticIdx(1, 'cdmg'),
      keyIdx('造成的伤害提高[dmg]%', 'dmg', 2)
    ],
    将光阴织成黄金: [
      staticIdx(1, 'speed'),
      (tables) => {
        return {
          title: '暴击伤害提高[cdmg]%，普攻伤害提高[aDmg]%',
          data: {
            cdmg: tables[2] * 6,
            aDmg: tables[3] * 6
          }
        }
      }
    ]
  }
}
