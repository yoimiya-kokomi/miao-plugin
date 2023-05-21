export default function (staticIdx, keyIdx) {
  return {
    于夜色中: [
      staticIdx(1, 'cpct'),
      (tables) => {
        return {
          title: `[_count]层Buff提高普攻与战技伤害[aDmg]%，终结技的暴击伤害[qCdmg]%`,
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
      keyIdx(2, 'cpct', '场上目标小于等于2时，暴击率提高[cpct]%')
    ],
    如泥酣眠: [
      staticIdx(1, 'cdmg')
    ],
    星海巡航: [
      staticIdx(1, 'cpct'),
      keyIdx(2, 'cpct', '对生命值小于50%的敌人暴击率提高[cpct]%'),
      keyIdx(3, 'atkPct', '消灭敌方目标后，攻击力提高[atkPct]%')
    ],
    春水初生: [(tables) => {
      return {
        title: '进入战斗提高速度[speedPct]%，伤害[dmg]%',
        data: {
          speedPct: tables[1],
          dmg: tables[2]
        }
      }
    }],
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
      keyIdx(1, 'speedPct', '消灭敌方目标后，速度提高[speedPct]%')
    ],
    离弦: [
      keyIdx(1, 'atkPct', '消灭敌方目标后，攻击力[atkPct]%')
    ],
    论剑: [(tables) => {
      return {
        title: '连续击中5次同一个目标，伤害提高[dmg]%',
        data: {
          dmg: tables[1] * 5
        }
      }
    }],
    重返幽冥: [staticIdx(1, 'cpct')],
    锋镝: [
      keyIdx(1, 'cpct', '战斗开始时暴击率提高[cpct]%')
    ]
  }
}