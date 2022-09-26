export default function (step) {
  return {
    鸦羽弓: {
      check: ({ element }) => ['水', '火'].includes(element),
      title: '对处于水或火元素影响下的敌人，造成的伤害提高[dmg]%',
      refine: {
        dmg: step(12)
      }
    },
    神射手之誓: {
      title: '针对要害造成的伤害提升[a2Dmg]%',
      refine: {
        a2Dmg: step(24)
      }
    },
    弹弓: {
      title: '普攻与重击的箭矢0.3秒内击中敌人，伤害增加[a2Dmg]%',
      refine: {
        aDmg: step(36, 6),
        a2Dmg: step(36, 6)
      }
    },
    绝弦: {
      title: '元素战技与元素爆发的伤害提高[eDmg]%',
      refine: {
        eDmg: step(24),
        qDmg: step(24)
      }
    },
    暗巷猎手: {
      title: '满层提高[dmg]%伤害',
      refine: {
        dmg: step(20)
      }
    },
    黑岩战弓: {
      title: '击败敌人后，攻击力满层提升[atkPct]%',
      buffCount: 3,
      refine: {
        atkPct: step(12)
      }
    },
    钢轮弓: {
      title: '普通攻击与重击命中时，满层提升[atkPct]%',
      buffCount: 4,
      refine: {
        atkPct: step(4)
      }
    },
    试作澹月: {
      title: '重击命中要害提高[atkPct]%攻击力',
      refine: {
        atkPct: step(36)
      }
    },
    宗室长弓: {
      title: '3层提高暴击率[cpct]%',
      buffCount: 3,
      refine: {
        cpct: step(8)
      }
    },
    弓藏: {
      title: '普攻造成的伤害提升[aDmg]%',
      refine: {
        aDmg: step(40)
      }
    },
    风花之颂: {
      title: '施放元素战技时攻击力提升[atkPct]%',
      refine: {
        atkPct: step(16)
      }
    },
    幽夜华尔兹: {
      title: 'Buff下普攻及元素战技造成的伤害提升[aDmg]%',
      refine: {
        aDmg: step(20),
        eDmg: step(20)
      }
    },
    破魔之弓: {
      title: '满能量下普攻伤害提高[aDmg]%，重击伤害提高[a2Dmg]%',
      buffCount: 2,
      refine: {
        aDmg: step(16),
        a2Dmg: step(12)
      }
    },
    掠食者: {
      check: ({ element }) => element === '冰',
      title: '满Buff普攻与重击伤害提高[aDmg]%，埃洛伊攻击力提升66',
      refine: {
        aDmg: [20],
        atkPlus: 66
      }
    },
    曚云之月: {
      title: '满层元素爆发伤害提高[qDmg]%',
      refine: {
        qDmg: step(40)
      }
    },
    冬极白星: [{
      title: '元素战技与元素爆发伤害提高[eDmg]%',
      refine: {
        eDmg: step(12),
        qDmg: step(12)
      }
    }, {
      title: '满Buff下提高攻击力[atkPct]%',
      refine: {
        atkPct: step(48, 12)
      }
    }],
    飞雷之弦振: [{
      title: '满Buff下提高普攻伤害[aDmg]%',
      refine: {
        aDmg: step(40)
      }
    }],
    终末嗟叹之诗: [{
      title: '元素精通提高[_mastery]',
      sort: 0,
      refine: {
        _mastery: step(60)
      }
    }, {
      title: 'Buff下提高元素精通[mastery],攻击力[atkPct]%',
      sort: 0,
      refine: {
        mastery: step(100),
        atkPct: step(20)
      }
    }],
    阿莫斯之弓: [{
      title: '普攻与重击伤害提高[a2Dmg]%',
      refine: {
        aDmg: step(12),
        a2Dmg: step(12)
      }
    }, {
      title: '5段Buff重击伤害提高[a2Dmg]%',
      buffCount: 5,
      refine: {
        aDmg: step(8),
        a2Dmg: step(8)
      }
    }],

    若水: {
      title: '生命值提高[_hpPct]%，伤害提高[dmg]%',
      refine: {
        _hpPct: step(16),
        dmg: step(20)
      }
    },
    陨龙之梦: {
      title: '护盾+满Buff提高攻击力[atkPct]%',
      buffCount: 10,
      refine: {
        atkPct: step(4)
      }
    },
    落霞: {
      title: '二层状态下提高伤害[dmg]%',
      refine: {
        dmg: step(10, 2.5)
      }
    },
    猎人之径: {
      title: '元素伤害提高[dmg]%，重击造成的伤害值提高[a2Plus]',
      sort: 5,
      data: {
        dmg: ({ refine }) => step(12)[refine],
        a2Plus: ({ attr, calc, refine }) => calc(attr.mastery) * step(160)[refine] / 100
      }
    },
    王下近侍: {
      title: '施放元素战技或元素爆发时精通提高[mastery]',
      refine: {
        mastery: step(60, 20)
      }
    }
  }
}
