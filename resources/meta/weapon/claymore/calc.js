export default function (step) {
  return {
    沐浴龙血的剑: {
      check: ({ element }) => ['火', '雷'].includes(element),
      title: '对处于火元素或雷元素影响下的敌人，造成的伤害提高[dmg]%',
      refine: {
        dmg: step(12),
        phy: step(12)
      }
    },
    铁影阔剑: {
      title: '生命值低于70%时，提高[a2Dmg]%重击伤害',
      refine: {
        a2Dmg: step(30, 5)
      }
    },
    飞天大御剑: {
      title: '满层提高攻击力[atkPct]%',
      buffCount: 4,
      refine: {
        atkPct: step(6, 1)
      }
    },
    黑岩斩刀: {
      title: '击败敌人满Buff下攻击力提升[atkPct]%',
      buffCount: 3,
      refine: {
        atkPct: step(12)
      }
    },
    千岩古剑: {
      title: '四璃月角色提升攻击力[atkPct]%及暴击率[cpct]%',
      buffCount: 4,
      refine: {
        atkPct: step(3, 1),
        cpct: step(3, 1)
      }
    },
    雨裁: {
      check: ({ element }) => ['水', '雷'].includes(element),
      title: '对处于水元素或雷元素影响下的敌人，造成的伤害提高[dmg]%',
      refine: {
        dmg: step(20, 4),
        phy: step(20, 4)
      }
    },
    宗室大剑: {
      title: '3层Buff提高暴击率[cpct]%',
      buffCount: 3,
      refine: {
        cpct: step(8)
      }
    },
    螭骨剑: {
      title: '满Buff提高伤害[dmg]%',
      buffCount: 5,
      refine: {
        dmg: step(6, 1),
        phy: step(6, 1)
      }
    },
    钟剑: {
      title: '角色处于护盾庇护下时，造成的伤害提升[dmg]%',
      refine: {
        dmg: step(12),
        phy: step(12)
      }
    },
    白影剑: {
      title: '满Buff提升攻击力及防御力[atkPct]%',
      buffCount: 4,
      refine: {
        atkPct: step(6),
        defPct: step(6)
      }
    },
    桂木斩长正: {
      title: '元素战技造成的伤害提升[eDmg]%',
      refine: {
        eDmg: step(6)
      }
    },
    衔珠海皇: {
      title: '元素爆发造成的伤害提升[qDmg]%',
      refine: {
        qDmg: step(12)
      }
    },
    恶王丸: {
      title: '满层元素爆发造成的伤害提升[qDmg]%',
      refine: {
        qDmg: step(40)
      }
    },
    天空之傲: {
      title: '造成伤害提高[dmg]%',
      refine: {
        dmg: step(8),
        phy: step(8)
      }
    },
    狼的末路: {
      title: '攻击命中生命值低于30%的敌人时，攻击力提升[atkPct]%',
      refine: {
        atkPct: step(40)
      }
    },
    无工之剑: [{
      title: '护盾强效提高[shield]%',
      refine: {
        shield: step(20)
      }
    }, {
      title: '满Buff护盾下攻击力提高[atkPct]%',
      buffCount: 10,
      refine: {
        atkPct: step(4)
      }
    }],
    松籁响起之时: {
      title: 'Buff状态下提高攻击力[atkPct]%',
      refine: {
        atkPct: step(20)
      }
    },
    赤角石溃杵: {
      title: '普通攻击与重击造成的伤害值提高[aPlus]',
      data: {
        aPlus: ({ attr, calc, refine }) => calc(attr.def) * step(40)[refine] / 100,
        a2Plus: ({ attr, calc, refine }) => calc(attr.def) * step(40)[refine] / 100
      }
    },
    森林王器: {
      title: '拾取种识之叶的角色元素精通提升[mastery]',
      refine: {
        mastery: step(60)
      }
    }
  }
}
