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
    ],
    记忆永不落幕: [
      staticIdx(1, 'speedPct'),
      keyIdx('装备者施放战技后，使我方全体造成的伤害提高[dmg]%', 'dmg', 2)
    ],
    '让告别，更美一些': [
      staticIdx(1, 'hpPct'),
      keyIdx('无视目标[ignore]%的防御力', 'ignore', 2)
    ],
    愿虹光永驻天空: [
      staticIdx(1, 'speedPct'),
      keyIdx('装备者的忆灵施放忆灵技时，使敌方全体受到的伤害提高[enemydmg]%', 'enemydmg', 4)
    ],
    故事的下一页: [
      staticIdx(1, "hpPct"),
      (tables) => {
        return {
          check: ({ params }) => params.Memosprite,
          title: "装备者的忆灵攻击后，使装备者与忆灵的治疗量提高[heal]%",
          data: {
            heal: tables[2]
          }
        }
      }
    ],
    花儿不会忘记: [
      staticIdx(1, "cdmg"),
      (tables) => {
        return {
          check: ({ params }) => params.Memosprite,
          title: "装备者忆灵造成的暴击伤害额外提高[meCdmg]%",
          data: {
            meCdmg: tables[2]
          }
        }
      }
    ],
    致长夜的星光: [
      staticIdx(1, "hpPct"),
      (tables) => {
        return {
          check: ({ params }) => params.Memosprite,
          title: "【夜色】状态：忆灵无视[meIgnore]%防御，自身与忆灵增伤[dmg]%",
          data: {
            meIgnore: tables[2],
            dmg: tables[3]
          }
        }
      }
    ],
  }
}
