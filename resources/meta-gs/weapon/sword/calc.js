export default function (step, staticStep) {
  return {
    辰砂之纺锤: {
      title: '元素战技造成的伤害值提高[ePlus]',
      sort: 9,
      data: {
        ePlus: ({ attr, calc, refine }) => calc(attr.def) * step(40)[refine] / 100
      }
    },
    腐殖之剑: {
      title: '元素战技的伤害增加[eDmg]%，暴击率提高[eCpct]%',
      refine: {
        eDmg: step(16),
        eCpct: step(6)
      }
    },
    降临之剑: {
      title: '旅行者攻击力提高[atkPlus]',
      data: {
        atkPlus: 66
      }
    },
    黑剑: {
      title: '普攻与重击的造成的伤害提升[aDmg]%',
      refine: {
        aDmg: step(20),
        a2Dmg: step(20)
      }
    },
    暗巷闪光: {
      title: '角色造成的伤害提升[dmg]%',
      refine: {
        dmg: step(12),
        phy: step(12)
      }
    },
    宗室长剑: {
      title: '3层Buff下，暴击率提高[cpct]%',
      buffCount: 3,
      refine: {
        cpct: step(8)
      }
    },
    试作斩岩: {
      title: '满Buff提高攻击力及防御力[atkPct]%',
      buffCount: 4,
      refine: {
        atkPct: step(4),
        defPct: step(4)
      }
    },
    匣里龙吟: {
      check: ({ element }) => ['火', '雷'].includes(element),
      title: '对处于火元素或雷元素影响下的敌人，造成的伤害提高[dmg]%',
      refine: {
        dmg: step(20, 4),
        phy: step(20, 4)
      }
    },
    铁蜂刺: {
      title: '满Buff伤害提高[dmg]%',
      buffCount: 2,
      refine: {
        dmg: step(6),
        phy: step(6)
      }
    },
    黑岩长剑: {
      title: '满Buff攻击力提高[atkPct]%',
      buffCount: 3,
      refine: {
        atkPct: step(12)
      }
    },
    飞天御剑: {
      title: '施放元素爆发后，提高[atkPct]%的攻击力',
      refine: {
        atkPct: step(12)
      }
    },
    黎明神剑: {
      title: '生命值高于90%时，暴击率提升[cpct]%',
      refine: {
        cpct: step(14)
      }
    },
    暗铁剑: {
      check: ({ element }) => element === '雷',
      title: '触发雷元素相关反应后攻击力提高[atkPct]%',
      refine: {
        atkPct: step(20)
      }
    },
    冷刃: {
      check: ({ element }) => ['水', '冰'].includes(element),
      title: '对处于水或冰元素影响的敌人伤害提高[dmg]%',
      refine: {
        dmg: step(12),
        phy: step(12)
      }
    },
    笼钓瓶一心: {
      title: '触发效果时攻击力提升[atkPct]%',
      refine: {
        atkPct: step(15)
      }
    },
    西福斯的月光: {
      title: '基于元素精通，提升[recharge]%元素充能效率',
      sort: 6,
      data: {
        recharge: ({ attr, calc, refine }) => calc(attr.mastery) * step(0.036)[refine]
      }
    },
    波乱月白经津: [{
      title: '元素伤害加成[dmg]%',
      refine: {
        dmg: step(12)
      }
    }, {
      title: '满层提高普攻[aDmg]%',
      buffCount: 2,
      refine: {
        aDmg: step(20)
      }
    }],
    雾切之回光: [{
      title: '元素伤害加成[dmg]%',
      refine: {
        dmg: step(12)
      }
    }, {
      title: '满层获得伤害加成[dmg]%',
      refine: {
        dmg: step(28)
      }
    }],
    苍古自由之誓: [{
      title: '造成的伤害提高[dmg]%',
      refine: {
        dmg: step(10)
      }
    }, {
      title: '触发Buff后提高普攻重击与下落攻击[aDmg]%，攻击力提升[atkPct]%',
      refine: {
        aDmg: step(16),
        a2Dmg: step(16),
        a3Dmg: step(16),
        atkPct: step(20)
      }
    }],
    磐岩结绿: [staticStep('hpPct', 20), {
      title: '基于生命值上限提高攻击力[atkPlus]',
      sort: 9,
      data: {
        atkPlus: ({ attr, calc, refine }) => calc(attr.hp) * step(1.2)[refine] / 100
      }
    }],
    裁叶萃光: [staticStep('cpct', 4), {
      title: '普攻与元素战技造成的伤害值提高[aPlus]',
      sort: 9,
      data: {
        aPlus: ({ attr, calc, refine }) => calc(attr.mastery) * step(120)[refine] / 100,
        ePlus: ({ attr, calc, refine }) => calc(attr.mastery) * step(120)[refine] / 100
      }
    }],
    斫峰之刃: [{
      title: '护盾强效提升[shield]%',
      refine: {
        shield: step(20)
      }
    }, {
      title: '满Buff提高攻击力[atkPct]%',
      buffCount: 10,
      refine: {
        atkPct: step(4)
      }
    }],
    天空之刃: [staticStep('cpct', 4), {
      title: '暴击提高[_cpct]%',
      refine: {
        _cpct: step(4)
      }
    }],
    风鹰剑: [staticStep('atkPct', 20), {
      title: '攻击力提高[_atkPct]%',
      refine: {
        _atkPct: step(20)
      }
    }],
    原木刀: {
      title: '拾取种识之叶的角色元素精通提升[mastery]',
      refine: {
        mastery: step(60)
      }
    },
    圣显之钥: [staticStep('hpPct', 20), {
      title: '基于生命提升元素精通，满层提升[mastery]',
      sort: 5,
      data: {
        mastery: ({ attr, calc, refine }) => step(0.36 + 0.2)[refine] * calc(attr.hp) / 100
      }
    }],
    灰河渡手: {
      title: '元素战技暴击率提升[eCpct]%；此外，施放元素战技后的5秒内，元素充能效率提升[rechargePlus]%',
      refine: {
        eCpct: step(8),
        rechargePlus: [16, 20, 24, 28, 32]
      }
    },
    海渊终曲: {
      title: '释放元素战技攻击力提升[atkPct]%，生命之契提升[atkPlus]点攻击力',
      sort: 9,
      data: {
        atkPlus: ({ attr, calc, refine }) => Math.min(Math.floor(calc(attr.hp) * 0.25 * step(0.24)[refine] / 10, step(150)))
      },
      refine: {
        atkPct: step(12)
      }
    },
    船坞长剑: {
      title: '满层提高[mastery]点元素精通',
      refine: {
        mastery: step(40 * 3)
      }
    },
    狼牙: [{
      title: '元素战技与元素爆发造成的伤害提升[eDmg]%',
      refine: {
        eDmg: step(16),
        qDmg: step(16)
      }
    }, {
      title: '满层下，元素战技与元素爆发命中敌人，其暴击率提升[eCpct]%',
      refine: {
        eCpct: step(8),
        qCpct: step(8)
      }
    }],
    静水流涌之辉: [{
      title: '生命值变化时，3层Buff战技伤害提高[eDmg]%',
      refine: {
        eDmg: step(8 * 3)
      }
    }, {
      title: '其他角色生命值变化时，2层Buff提高生命上限[hpPct]%',
      refine: {
        hpPct: step(14 * 2)
      }
    }]
  }
}
