export default function (staticIdx, keyIdx) {
  return {
    乐圮: [
      keyIdx('对生命值大于50%的伤害提高[dmg]%', 'dmg', 1)
    ],
    俱殁: [
      keyIdx('生命值大于80%时提高暴击率[cpct]%', 'cpct', 1)
    ],
    在蓝天下: [
      staticIdx(1, 'atkPct'),
      keyIdx('消灭敌方目标后暴击率提高[cpct]%', 'cpct', 2)
    ],
    天倾: [
      keyIdx('普攻和战技伤害提高[aDmg]%', { aDmg: 1, eDmg: 1 })
    ],
    无可取代的东西: [
      staticIdx(1, 'atkPct'),
      keyIdx('受到攻击时提高造成伤害[dmg]%', 'dmg', 3)
    ],
    无处可逃: [
      staticIdx(1, 'atkPct')
    ],
    '汪！散步时间！': [
      staticIdx(1, 'atkPct'),
      keyIdx('对烧灼或裂伤状态的敌人伤害提高[dmg]%', 'dmg', 2)
    ],
    秘密誓心: [
      staticIdx(1, 'dmg'),
      keyIdx('对生命百分比高于角色的敌人的伤害提高[dmg]%', 'dmg', 2)
    ],
    记一位星神的陨落: [(tables) => {
      return {
        title: '4层Buff提高攻击力[atkPct]%，击破弱点后造成的伤害提高[dmg]%',
        data: {
          atkPct: tables[1] * 4,
          dmg: tables[2]
        }
      }
    }],
    鼹鼠党欢迎你: [(tables) => {
      return {
        title: '3层Buff提高攻击力[atkPct]%',
        data: {
          atkPct: tables[1] * 3
        }
      }
    }],
    到不了的彼岸: [
      staticIdx(1, 'cpct'),
      staticIdx(2, 'hpPct'),
      keyIdx('受到攻击或装备者消耗自身生命值，伤害提高[dmg]%', 'dmg', 3)
    ],
    比阳光更明亮的: [
      staticIdx(1, 'cpct'),
      (tables) => {
        return {
          title: '2层Buff提高攻击力[atkPct]%，能量恢复效率提高[recharge]%',
          data: {
            atkPct: tables[2] * 2,
            recharge: tables[3] * 2
          }
        }
      }
    ],
    此身为剑: [
      staticIdx(1, 'cdmg'),
      (tables) => {
        return {
          title: '3层Buff使装备者下一次攻击造成的伤害提高[dmg]%，使该次攻击无视目标[ignore]%的防御力',
          data: {
            dmg: tables[2] * 3,
            ignore: tables[3]
          }
        }
      }
    ],
    在火的远处: [
      keyIdx('装备者造成的伤害提高[dmg]%', 'dmg', 1)
    ],
    铭记于心的约定: [
      staticIdx(1, 'stance'),
      keyIdx('释放终结技时，暴击率提高[cpct]%', 'cpct', 2)
    ],
    梦应归于何处: [
      staticIdx(1, 'stance'),
      keyIdx('敌方受到装备者造成的击破伤害提高[breakEnemydmg]%', 'breakEnemydmg', 2)
    ],
    落日时起舞: [
      staticIdx(1, 'cdmg'),
      (tables) => {
        return {
          title: '2层Buff使追加攻击造成的伤害提高[tDmg]%',
          data: {
            tDmg: tables[2] * 2
          }
        }
      }
    ],
    '忍事录•音律狩猎': [
      staticIdx(1, 'hpPct'),
      keyIdx('损失或回复自身生命值，暴击伤害提高[cdmg]%', 'cdmg', 2)
    ],
    '血火啊，燃烧前路': [
      staticIdx(1, 'hpPct'),
      (tables) => {
        return {
          title: '施放战技或终结技时，使本次攻击造成的伤害提高[eDmg]%',
          data: {
            eDmg: ({ attr, calc }) => {
              return calc(attr.hp) * tables[3] / 100 > 500 ? tables[5] + tables[4] : tables[4]
            },
            qDmg: ({ attr, calc }) => {
              return calc(attr.hp) * tables[3] / 100 > 500 ? tables[5] + tables[4] : tables[4]
            }
          }
        }
      }
    ]
  }
}
