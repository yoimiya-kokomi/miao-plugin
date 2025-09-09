export default function (staticIdx, keyIdx) {
  return {
    于夜色中: [
      staticIdx(1, 'cpct'),
      (tables) => {
        return {
          title: '[_count]层Buff提高普攻与战技伤害[aDmg]%，终结技的暴击伤害[qCdmg]%',
          data: {
            _count: ({ attr, calc }) => Math.min(6, Math.floor((calc(attr.speed) - 100) / 10)) + '',
            aDmg: ({ attr, calc }) => Math.min(6, Math.floor((calc(attr.speed) - 100) / 10)) * tables[2],
            eDmg: ({ attr, calc }) => Math.min(6, Math.floor((calc(attr.speed) - 100) / 10)) * tables[2],
            qCdmg: ({ attr, calc }) => Math.min(6, Math.floor((calc(attr.speed) - 100) / 10)) * tables[3]
          }
        }
      }],
    唯有沉默: [
      staticIdx(1, 'atkPct'),
      keyIdx('场上目标小于等于2时，暴击率提高[cpct]%', 'cpct', 2)
    ],
    如泥酣眠: [
      staticIdx(1, 'cdmg')
    ],
    星海巡航: [
      staticIdx(1, 'cpct'),
      keyIdx('对生命值小于50%的敌人暴击率提高[cpct]%，消灭敌方目标后，攻击力提高[atkPct]%', { cpct: 2, atkPct: 3 })
    ],
    春水初生: [
      keyIdx('进入战斗提高速度[speedPct]%，伤害[dmg]%', { speedPct: 1, dmg: 2 })
    ],
    '点个关注吧！': [(tables) => {
      return {
        title: '满能量提高普攻和战技伤害[aDmg]%',
        data: {
          aDmg: tables[1] * 2,
          eDmg: tables[1] * 2
        }
      }
    }],
    相抗: [
      keyIdx('消灭敌方目标后，速度提高[speedPct]%', 'speedPct', 1)
    ],
    离弦: [
      keyIdx('消灭敌方目标后，攻击力[atkPct]%', 'atkPct', 1)
    ],
    论剑: [(tables) => {
      return {
        title: '连续击中5次同一个目标，伤害提高[dmg]%',
        data: {
          dmg: tables[1] * 5
        }
      }
    }],
    重返幽冥: [
      staticIdx(1, 'cpct')
    ],
    锋镝: [
      keyIdx('战斗开始时暴击率提高[cpct]%', 'cpct', 1)
    ],
    '烦恼着，幸福着': [
      staticIdx(1, 'cpct'),
      keyIdx('追加攻击造成的伤害提高[tDmg]%', 'tDmg', 2),
      (tables) => {
        return {
          title: '2层Buff时，造成的暴击伤害提高[cdmg]%',
          data: {
            cdmg: tables[3] * 2
          }
        }
      }
    ],
    纯粹思维的洗礼: [
      staticIdx(1, 'cdmg'),
      (tables) => {
        return {
          title: '3层Buff提升装备者暴击伤害[cdmg]%',
          data: {
            cdmg: tables[2] * 3
          }
        }
      },
      keyIdx('释放终结技后，造成伤害提高[dmg]%，追加攻击无视目标防御力[tIgnore]%', { dmg: 3, tIgnore: 4 })
    ],
    最后的赢家: [
      staticIdx(1, 'atkPct'),
      (tables) => {
        return {
          title: '4层Buff提升装备者暴击伤害[cdmg]%',
          data: {
            cdmg: tables[2] * 4
          }
        }
      }
    ],
    驶向第二次生命: [
      staticIdx(1, 'stance'),
      keyIdx('造成的击破伤害无视目标[breakIgnore]%的防御力', 'breakIgnore', 2),
      (tables) => {
        return {
          title: '速度提高[speedPct]%',
          check: ({ attr }) => attr.stance >= 150,
          data: {
            speedPct: tables[3]
          }
        }
      }
    ],
    黑夜如影随行: [
      staticIdx(1, 'stance'),
      (tables) => {
        return {
          title: '进入战斗或造成击破伤害后，速度提高[speedPct]%',
          data: {
            speedPct: tables[2]
          }
        }
      }
    ],
    '我将，巡征追猎': [
      staticIdx(1, 'cpct'),
      (tables) => {
        return {
          title: '2层Buff使装备者造成的终结技伤害无视目标[qIgnore]%防御力',
          data: {
            qIgnore: tables[2] * 2
          }
        }
      }
    ],
    理想燃烧的地狱: [
      staticIdx(1, 'cpct'),
      (tables) => {
        return {
          title: '攻击力提高[atkPct]%',
          data: {
            atkPct: tables[2] + tables[3] * 4
          }
        }
      }
    ],
    于那终点再见: [
      staticIdx(1, "cdmg"),
      keyIdx("装备者战技和追加攻击造成的伤害提高[eDmg]%", { eDmg: 2, tDmg: 2 })
    ]
  }
}
