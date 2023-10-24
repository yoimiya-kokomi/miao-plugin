export default function (step, staticStep) {
  return {
    白缨枪: {
      title: '白缨枪普通攻击伤害提高[aDmg]%',
      refine: { aDmg: step(24) }
    },
    黑岩刺枪: {
      title: '黑岩刺枪满层攻击力加成[atkPct]%',
      data: {
        atkPct: ({ refine }) => step(12)[refine] * 3
      }
    },
    决斗之枪: {
      title: '身边敌人少于2个时，获得[atkPct]%的攻击力提升',
      refine: {
        atkPct: step(24)
      }
    },
    匣里灭辰: {
      check: ({ element }) => ['水', '火'].includes(element),
      title: '对于水或火元素影响的敌人造成伤害提高[dmg]%',
      refine: {
        dmg: step(20, 4),
        phy: step(20, 4)
      }
    },
    千岩长枪: {
      title: '四璃月队伍提高[atkPct]%攻击力及[cpct]%的暴击率提高',
      buffCount: 4,
      refine: {
        atkPct: [7, 8, 9, 10, 11],
        cpct: [3, 4, 5, 6, 7]
      }
    },
    试作星镰: {
      title: '释放元素战技后，2层Buff普攻与重击造成伤害提高[aDmg]%',
      buffCount: 2,
      refine: {
        aDmg: step(8),
        a2Dmg: step(8)
      }
    },
    宗室猎枪: {
      title: '3层Buff暴击提高[cpct]%',
      buffCount: 3,
      refine: {
        cpct: step(8)
      }
    },
    喜多院十文字: {
      title: '元素战技伤害提升[eDmg]%',
      refine: {
        eDmg: step(6)
      }
    },
    '「渔获」': {
      title: '元素爆发造成伤害提高[qDmg]%，元素爆发的暴击率提高[qCpct]%',
      refine: {
        qDmg: step(16),
        qCpct: step(6)
      }
    },
    断浪长鳍: {
      title: '满层元素爆发伤害提高[qDmg]%',
      refine: { qDmg: step(40) }
    },
    贯虹之槊: [{
      title: '护盾满层状态提高攻击力[atkPct]%',
      buffCount: 10,
      refine: {
        atkPct: step(4)
      }
    }, {
      title: '护盾强效提高[shield]%',
      refine: {
        shield: step(20)
      }
    }],
    和璞鸢: {
      title: '满层攻击力提高[atkPct]%，伤害提升[dmg]%',
      refine: {
        atkPct: [3.2 * 7, 3.9 * 7, 4.6 * 7, 5.3 * 7, 6 * 7],
        dmg: step(12),
        phy: step(12)
      }
    },
    护摩之杖: [staticStep('hpPct', 20), {
      title: '角色生命低于50%时额外获得[atkPlus]攻击力',
      sort: 9,
      data: {
        atkPlus: ({ attr, refine, calc }) => {
          let totalHp = calc(attr.hp)
          return totalHp * ([0.8, 1, 1.2, 1.4, 1.6][refine] + [1, 1.2, 1.4, 1.6, 1.8][refine]) / 100
        }
      }
    }],
    天空之脊: staticStep('cpct', 8),
    薙草之稻光: [{
      title: '元素爆发12秒内元素充能提高[rechargePlus]%',
      refine: {
        rechargePlus: [30, 35, 40, 45, 50]
      }
    }, {
      title: '基于元素充能提升攻击力[atkPct]%',
      sort: 4,
      data: {
        atkPct: ({ attr, refine }) => {
          let recharge = attr.recharge.base + attr.recharge.plus - 100
          return Math.min(recharge * step(28)[refine] / 100, [80, 90, 100, 110, 120][refine])
        }
      }
    }],
    息灾: {
      title: '获得[dmg]%元素伤害加成，满Buff前台提供[atkPct]%攻击力加成',
      refine: {
        dmg: step(12),
        atkPct: step(3.2 * 6)
      }
    },
    贯月矢: {
      title: '拾取苏生之叶的角色攻击力提升[atkPct]%',
      refine: {
        atkPct: step(16)
      }
    },
    赤沙之杖: {
      title: '赤沙之杖被动：基于元素精通获得攻击力[_atk1]，3层Buff提高攻击力[_atk2]',
      sort: 6,
      data: {
        _atk1: ({ attr, calc, refine }) => step(52)[refine] * calc(attr.mastery) / 100,
        _atk2: ({ attr, calc, refine }) => step(28 * 3)[refine] * calc(attr.mastery) / 100,
        atkPlus: ({ attr, calc, refine }) => step(52 + 28 * 3)[refine] * calc(attr.mastery) / 100
      }
    },
    风信之锋: {
      title: '触发元素反应提升攻击力[atkPct]%, 精通[mastery]',
      refine: {
        atkPct: step(12),
        mastery: step(48)
      }
    },
    峡湾长歌: {
      title: '队伍中存在至少三种不同元素类型的角色时，元素精通提升[mastery]点',
      refine: {
        mastery: step(120)
      }
    },
    勘探钻机: {
      title: '满层下，提高[atkPct]%攻击力与[dmg]%所有元素伤害加成',
      refine: {
        atkPct: [3 * 3, 4 * 3, 5 * 3, 6 * 3, 7 * 3],
        dmg: [7 * 3, 8.5 * 3, 10 * 3, 11.5 * 3, 13 * 3]
      }
    },
    公义的酬报: false
  }
}
