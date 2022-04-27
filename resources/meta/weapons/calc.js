let polearm = {
  "白缨枪": {
    title: "白缨枪普通攻击伤害提高[aDmg]%",
    refine: { aDmg: [24, 30, 36, 42, 48] }
  },
  "黑岩刺枪": {
    title: "黑岩刺枪满层攻击力加成[atkPct]%",
    data: {
      atkPct: ({ refine }) => [12, 15, 18, 21, 24][refine] * 3
    }
  },
  "决斗之枪": {
    title: "身边敌人少于2个时，获得[atkPct]%的攻击力提升",
    refine: {
      atkPct: [24, 30, 36, 42, 48]
    }
  },
  "匣里灭辰": {
    check: ({ element }) => ['水', '火'].includes(element),
    title: "对于水或或元素影响的敌人造成伤害提高[dmg]%",
    refine: {
      dmg: [20, 24, 28, 32, 36]
    }
  },
  "千岩长枪": {
    title: "四璃月队伍提高[atkPct]%攻击力及[cpct]%的暴击率提高",
    refine: {
      atkPct: [7, 8, 9, 10, 11],
      cpct: [3, 4, 5, 6, 7]
    }
  },
  "试作星镰": {
    title: "释放元素战技后，2层Buff普攻与重击造成伤害提高[aDmg]%",
    buffCount: 2,
    refine: {
      aDmg: [8, 10, 12, 14, 16],
      a2Dmg: [8, 10, 12, 14, 16]
    }
  },
  "宗室猎枪": {
    title: "3层Buff暴击提高[cpct]%",
    buffCount: 3,
    refine: {
      cpct: [8, 10, 12, 14, 16]
    }
  },
  "喜多院十文字": {
    title: "元素战技伤害提升[eDmg]%",
    refine: {
      eDmg: [6, 7.5, 9, 10.5, 12]
    }
  },
  "「渔获」": {
    title: "元素爆发造成伤害提高[qDmg]%，元素爆发的暴击率提高[qCpct]%",
    refine: {
      qDmg: [16, 20, 24, 28, 32],
      qCpct: [6, 7.5, 9, 10.5, 12]
    }
  },
  "断浪长鳍": {
    title: "满层元素爆发伤害提高[qDmg]%",
    refine: { qDmg: [40, 50, 60, 70, 80] }
  },
  "贯虹之槊": {
    title: "护盾满层状态提高攻击力[atkPct]%",
    buffCount: 10,
    refine: {
      atkPct: [4, 5, 6, 7, 8]
    }
  },
  "和璞鸢": {
    title: "满层攻击力提高[atkPct]%，伤害提升[dmg]%",
    refine: {
      atkPct: [3.2 * 7, 3.9 * 7, 4.6 * 7, 5.3 * 7, 6 * 7],
      dmg: [12, 15, 18, 21, 24]
    }
  },
  "天空之脊": {
    title: "暴击率提升[cpct]%",
    refine: {
      cpct: [8, 10, 12, 14, 16]
    }
  },
  "护摩之杖": {
    title: "角色生命低于50%时额外获得[atkPlus]攻击力",
    data: {
      atkPlus: ({ attr, refine, calc }) => {
        let totalHp = calc(attr.hp);
        return totalHp * ([0.8, 1, 1.2, 1.4, 1.6][refine] + [1, 1.2, 1.4, 1.6, 1.8][refine]) / 100
      }
    }
  },
  "薙草之稻光": [{
    title: "元素爆发12秒内元素充能提高[rechargePlus]%",
    sort: 0,
    refine: {
      rechargePlus: [30, 35, 40, 45, 50]
    }
  }, {
    title: "攻击力基于元素充能提升[atkPct]%",
    sort: 10,
    data: {
      atkPct: ({ attr, refine }) => {
        let recharge = attr.recharge.base + attr.recharge.plus - 100
        return Math.min(recharge * [28, 35, 42, 49, 56][refine] / 100, [80, 90, 100, 110, 120][refine])
      }
    }
  }]
};

let catalyst = {
  "翡玉法球": {
    check: ({ element }) => element === "水",
    title: "触发蒸发、感电、冰冻或水元素扩散反应后的12秒内，攻击力提高[atkPct]%",
    refine: {
      atkPct: [20, 25, 30, 35, 40]
    }
  },
  "魔导绪论": {
    check: ({ element }) => ["水", "雷"].includes(element),
    title: "对处于水元素或雷元素影响下的敌人，造成的伤害提高[dmg]%",
    refine: {
      dmg: [12, 15, 18, 21, 24]
    }
  },
  "甲级宝珏": {
    title: "击败敌人后攻击力提升[atkPct]%",
    refine: {
      atkPct: [12, 14, 16, 18, 20]
    }
  },
  "黑岩绯玉": {
    title: "击败敌人后，满层攻击力提升[atkPct]%",
    buffCount: 3,
    refine: {
      atkPct: [12, 15, 18, 21, 24]
    }
  },
  "万国诸海图谱": {
    title: "触发元素反应后，满层提高[dmg]%的元素伤害",
    buffCount: 2,
    refine: {
      dmg: [8, 10, 12, 14, 16]
    }
  },
  "宗室秘法录": {
    title: "3层状态下提高暴击率[cpct]%",
    buffCount: 3,
    refine: {
      cpct: [8, 10, 12, 14, 16]
    }
  },
  "匣里日月": {
    title: "普攻提高元素战技与爆发伤害[eDmg]%，元素战技与爆发提高普攻伤害[aDmg]%",
    refine: {
      aDmg: [20, 25, 30, 35, 40],
      eDmg: [20, 25, 30, 35, 40],
      qDmg: [20, 25, 30, 35, 40]
    }
  },
  "流浪乐章": {
    title: "咏叹调下全元素伤害提升[dmg]%",
    refine: {
      dmg: [48, 60, 72, 84, 96]
    }
  },
  "暗巷的酒与诗": {
    title: "冲刺后攻击力提升[atkPct]%",
    refine: {
      atkPct: [20, 25, 30, 35, 40]
    }
  },
  "嘟嘟可故事集": {
    title: "普攻提高重击伤害[a2Dmg]%，重击提高攻击力[atkPct]%",
    refine: {
      a2Dmg: [16, 20, 24, 28, 32],
      atkPct: [8, 10, 12, 14, 16]
    }
  },
  "白辰之环": {
    title: "与雷元素反应后提高元素反应加成[dmg]%",
    refine: {
      dmg: [10, 12.5, 15, 17.5, 20]
    }
  },
  "证誓之明瞳": {
    title: "施放元素战技后，元素充能效率提升[recharge]%",
    refine: {
      recharge: [24, 30, 36, 42, 48]
    }
  },
  "四风原典": {
    title: "满层获得[dmg]%的元素伤害加成",
    buffCount: 4,
    refine: {
      dmg: [8, 10, 12, 14, 16]
    }
  },
  "天空之卷": {
    title: "元素伤害加成提升[dmg]%",
    refine: {
      dmg: [12, 15, 18, 21, 24]
    }
  },
  "尘世之锁": {
    title: "护盾+满层情况下攻击力提高[atkPct]%",
    buffCount: 10,
    refine: {
      atkPct: [4, 5, 6, 7, 8]
    }
  },
  "不灭月华": {
    title: "治疗加成提高[heal]%，普攻伤害增加[aPlus]",
    refine: {
      heal: [10, 12.5, 15, 17.5, 20]
    },
    data: {
      aPlus: ({ attr, calc }) => calc(attr.hp) / 100
    }
  },
  "神乐之真意": {
    title: "满层提高元素战技伤害[eDmg]%，元素伤害提高[dmg]%",
    refine: {
      eDmg: [12 * 3, 15 * 3, 18 * 3, 21 * 3, 24 * 3],
      dmg: [12, 15, 18, 21, 24]
    }
  }
};

let bow = {
  "鸦羽弓": {
    check: ({ element }) => ['水', '火'].includes(element),
    title: "对处于水或火元素影响下的敌人，造成的伤害提高[dmg]%",
    refine: {
      dmg: [12, 15, 18, 21, 24]
    }
  },
  "神射手之誓": {
    title: "针对要害造成的伤害提升[a2Dmg]%",
    refine: {
      a2Dmg: [24, 30, 36, 42, 48]
    }
  },
  "弹弓": {
    title: "普攻与重击的箭矢0.3秒内击中敌人，伤害增加[a2Dmg]%",
    refine: {
      aDmg: [36, 42, 48, 54, 60],
      a2Dmg: [36, 42, 48, 54, 60]
    }
  },
  "绝弦": {
    title: "元素战技与元素爆发的伤害提高[eDmg]%",
    refine: {
      eDmg: [24, 30, 36, 42, 48],
      qDmg: [24, 30, 36, 42, 48]
    }
  },
  "暗巷猎手": {
    title: "满层提高[dmg]%伤害",
    refine: {
      dmg: [20, 25, 30, 35, 40]
    }
  },
  "黑岩战弓": {
    title: "击败敌人后，攻击力满层提升[atkPct]%",
    buffCount: 3,
    refine: {
      atkPct: [12, 15, 18, 21, 24]
    }
  },
  "钢轮弓": {
    title: "普通攻击与重击命中时，满层提升[atkPct]%",
    buffCount: 4,
    refine: {
      atkPct: [4, 5, 6, 7, 8]
    }
  },
  "试作澹月": {
    title: "重击命中要害提高[atkPct]%攻击力",
    refine: {
      atkPct: [36, 45, 54, 63, 72]
    }
  },
  "宗室长弓": {
    title: "3层提高暴击率[cpct]%",
    buffCount: 3,
    refine: {
      cpct: [8, 10, 12, 14, 16]
    }
  },
  "弓藏": {
    title: "普攻造成的伤害提升[aDmg]%",
    refine: {
      aDmg: [40, 50, 60, 70, 80]
    }
  },
  "风花之颂": {
    title: "施放元素战技时攻击力提升[atkPct]%",
    refine: {
      atkPct: [16, 20, 24, 28, 32]
    }
  },
  "幽夜华尔兹": {
    title: "Buff下普攻及元素战技造成的伤害提升[aDmg]%",
    refine: {
      aDmg: [20, 25, 30, 35, 40],
      eDmg: [20, 25, 30, 35, 40]
    }
  },
  "破魔之弓": {
    title: "满能量下普攻伤害提高[aDmg]%，重击伤害提高[a2Dmg]%",
    buffCount: 2,
    refine: {
      aDmg: [16, 20, 24, 28, 32],
      a2Dmg: [12, 15, 18, 21, 24]
    }
  },
  "掠食者": {
    check: ({ element }) => element === "冰",
    title: "满Buff普攻与重击伤害提高[aDmg]%，埃洛伊攻击力提升66",
    refine: {
      aDmg: [20],
      atkPlus: 66
    }
  },
  "曚云之月": {
    title: "满层元素爆发伤害提高[qDmg]%",
    refine: {
      qDmg: [40, 50, 60, 70, 80]
    }
  },
  "冬极白星": [{
    title: "元素战技与元素爆发伤害提高[eDmg]%",
    refine: {
      eDmg: [12, 15, 18, 21, 24],
      qDmg: [12, 15, 18, 21, 24],
    }
  }, {
    title: "满Buff下提高攻击力[atkPct]%",
    refine: {
      atkPct: [48, 60, 72, 84, 96]
    }
  }],
  "飞雷之弦振": [{
    title: "满Buff下提高普攻伤害[aDmg]%",
    refine: {
      aDmg: [40, 50, 60, 70, 80]
    }
  }],
  "终末嗟叹之诗": [{
    title: "元素精通提高[mastery]",
    refine: {
      mastery: [60, 75, 90, 105, 120]
    }
  }, {
    title: "Buff下提高元素精通[mastery],攻击力[atkPct]%",
    refine: {
      mastery: [100, 125, 150, 175, 200],
      atkPct: [20, 25, 30, 35, 40]
    }
  }],
  "阿莫斯之弓": [{
    title: "普攻与重击伤害提高[a2Dmg]%",
    refine: {
      aDmg: [12, 15, 18, 21, 24],
      a2Dmg: [12, 15, 18, 21, 24]
    }
  }, {
    title: "5段Buff重击伤害提高[a2Dmg]%",
    buffCount: 5,
    refine: {
      aDmg: [8, 10, 12, 14, 16],
      a2Dmg: [8, 10, 12, 14, 16]
    }
  }],
  "天空之翼": {
    title: "暴击伤害提高[cdmg]%",
    refine: {
      cdmg: [20, 25, 30, 35, 40]
    }
  },
  "若水": {
    title: "生命值提高[hpPct]%，伤害提高[dmg]%",
    refine: {
      hpPct: [16, 20, 24, 28, 32],
      dmg: [20, 25, 30, 35, 40]
    }
  },
  "陨龙之梦": {
    title: "护盾+满Buff提高攻击力[atkPct]%",
    buffCount: 10,
    refine: {
      atkPct: [4, 5, 6, 7, 8]
    }
  },
  "落霞": {
    title: "二层状态下提高伤害[dmg]%",
    refine: {
      dmg: [10, 12.5, 15, 17.5, 20]
    }
  }
};

export const weapons = { ...polearm, ...catalyst, ...bow };