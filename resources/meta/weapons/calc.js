let step = function (start, step = 0) {
  if (!step) {
    step = start / 4;
  }
  let ret = [];
  for (let idx = 0; idx <= 5; idx++) {
    ret.push(start + step * idx)
  }
  return ret;
}


let polearm = {
  "白缨枪": {
    title: "白缨枪普通攻击伤害提高[aDmg]%",
    refine: { aDmg: step(24) }
  },
  "黑岩刺枪": {
    title: "黑岩刺枪满层攻击力加成[atkPct]%",
    data: {
      atkPct: ({ refine }) => step(12)[refine] * 3
    }
  },
  "决斗之枪": {
    title: "身边敌人少于2个时，获得[atkPct]%的攻击力提升",
    refine: {
      atkPct: step(24)
    }
  },
  "匣里灭辰": {
    check: ({ element }) => ['水', '火'].includes(element),
    title: "对于水或或元素影响的敌人造成伤害提高[dmg]%",
    refine: {
      dmg: step(20, 4)
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
      aDmg: step(8),
      a2Dmg: step(8)
    }
  },
  "宗室猎枪": {
    title: "3层Buff暴击提高[cpct]%",
    buffCount: 3,
    refine: {
      cpct: step(8)
    }
  },
  "喜多院十文字": {
    title: "元素战技伤害提升[eDmg]%",
    refine: {
      eDmg: step(6)
    }
  },
  "「渔获」": {
    title: "元素爆发造成伤害提高[qDmg]%，元素爆发的暴击率提高[qCpct]%",
    refine: {
      qDmg: step(16),
      qCpct: step(6)
    }
  },
  "断浪长鳍": {
    title: "满层元素爆发伤害提高[qDmg]%",
    refine: { qDmg: step(40) }
  },
  "贯虹之槊": [{
    title: "护盾满层状态提高攻击力[atkPct]%",
    buffCount: 10,
    refine: {
      atkPct: step(4)
    }
  }, {
    title: "护盾强效提高[shield]%",
    refine: {
      shield: step(20)
    }
  }],
  "和璞鸢": {
    title: "满层攻击力提高[atkPct]%，伤害提升[dmg]%",
    refine: {
      atkPct: [3.2 * 7, 3.9 * 7, 4.6 * 7, 5.3 * 7, 6 * 7],
      dmg: step(12)
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
        return Math.min(recharge * step(28)[refine] / 100, [80, 90, 100, 110, 120][refine])
      }
    }
  }]
};

let catalyst = {
  "翡玉法球": {
    check: ({ element }) => element === "水",
    title: "触发蒸发、感电、冰冻或水元素扩散反应后的12秒内，攻击力提高[atkPct]%",
    refine: {
      atkPct: step(20)
    }
  },
  "魔导绪论": {
    check: ({ element }) => ["水", "雷"].includes(element),
    title: "对处于水元素或雷元素影响下的敌人，造成的伤害提高[dmg]%",
    refine: {
      dmg: step(12)
    }
  },
  "甲级宝珏": {
    title: "击败敌人后攻击力提升[atkPct]%",
    refine: {
      atkPct: step(12, 2)
    }
  },
  "黑岩绯玉": {
    title: "击败敌人后，满层攻击力提升[atkPct]%",
    buffCount: 3,
    refine: {
      atkPct: step(12)
    }
  },
  "万国诸海图谱": {
    title: "触发元素反应后，满层提高[dmg]%的元素伤害",
    buffCount: 2,
    refine: {
      dmg: step(8)
    }
  },
  "宗室秘法录": {
    title: "3层状态下提高暴击率[cpct]%",
    buffCount: 3,
    refine: {
      cpct: step(8)
    }
  },
  "匣里日月": {
    title: "普攻提高元素战技与爆发伤害[eDmg]%，元素战技与爆发提高普攻伤害[aDmg]%",
    refine: {
      aDmg: step(20),
      eDmg: step(20),
      qDmg: step(20)
    }
  },
  "流浪乐章": {
    title: "咏叹调下全元素伤害提升[dmg]%",
    refine: {
      dmg: step(48, 12)
    }
  },
  "暗巷的酒与诗": {
    title: "冲刺后攻击力提升[atkPct]%",
    refine: {
      atkPct: step(20)
    }
  },
  "嘟嘟可故事集": {
    title: "普攻提高重击伤害[a2Dmg]%，重击提高攻击力[atkPct]%",
    refine: {
      a2Dmg: step(16),
      atkPct: step(8)
    }
  },
  "白辰之环": {
    title: "与雷元素反应后提高元素反应加成[dmg]%",
    refine: {
      dmg: step(10, 2.5)
    }
  },
  "证誓之明瞳": {
    title: "施放元素战技后，元素充能效率提升[recharge]%",
    refine: {
      recharge: step(24)
    }
  },
  "四风原典": {
    title: "满层获得[dmg]%的元素伤害加成",
    buffCount: 4,
    refine: {
      dmg: step(8)
    }
  },
  "天空之卷": {
    title: "元素伤害加成提升[dmg]%",
    refine: {
      dmg: step(12)
    }
  },
  "尘世之锁": [{
    title: "护盾强效提升[shield]%",
    refine: {
      shield: step(20)
    }
  }, {
    title: "护盾+满层情况下攻击力提高[atkPct]%",
    buffCount: 10,
    refine: {
      atkPct: step(4),
      shield: step(20)
    }
  }],
  "不灭月华": {
    title: "治疗加成提高[_heal]%，普攻伤害增加[aPlus]",
    refine: {
      _heal: step(10, 2.5)
    },
    data: {
      aPlus: ({ attr, calc, refine }) => calc(attr.hp) * step(1, 0.5)[refine] / 100
    }
  },
  "神乐之真意": {
    title: "满层提高元素战技伤害[eDmg]%，元素伤害提高[dmg]%",
    refine: {
      eDmg: [12 * 3, 15 * 3, 18 * 3, 21 * 3, 24 * 3],
      dmg: step(12)
    }
  }
};

let bow = {
  "鸦羽弓": {
    check: ({ element }) => ['水', '火'].includes(element),
    title: "对处于水或火元素影响下的敌人，造成的伤害提高[dmg]%",
    refine: {
      dmg: step(12)
    }
  },
  "神射手之誓": {
    title: "针对要害造成的伤害提升[a2Dmg]%",
    refine: {
      a2Dmg: step(24)
    }
  },
  "弹弓": {
    title: "普攻与重击的箭矢0.3秒内击中敌人，伤害增加[a2Dmg]%",
    refine: {
      aDmg: step(36, 6),
      a2Dmg: step(36, 6)
    }
  },
  "绝弦": {
    title: "元素战技与元素爆发的伤害提高[eDmg]%",
    refine: {
      eDmg: step(24),
      qDmg: step(24)
    }
  },
  "暗巷猎手": {
    title: "满层提高[dmg]%伤害",
    refine: {
      dmg: step(20)
    }
  },
  "黑岩战弓": {
    title: "击败敌人后，攻击力满层提升[atkPct]%",
    buffCount: 3,
    refine: {
      atkPct: step(12)
    }
  },
  "钢轮弓": {
    title: "普通攻击与重击命中时，满层提升[atkPct]%",
    buffCount: 4,
    refine: {
      atkPct: step(4)
    }
  },
  "试作澹月": {
    title: "重击命中要害提高[atkPct]%攻击力",
    refine: {
      atkPct: step(36)
    }
  },
  "宗室长弓": {
    title: "3层提高暴击率[cpct]%",
    buffCount: 3,
    refine: {
      cpct: step(8)
    }
  },
  "弓藏": {
    title: "普攻造成的伤害提升[aDmg]%",
    refine: {
      aDmg: step(40)
    }
  },
  "风花之颂": {
    title: "施放元素战技时攻击力提升[atkPct]%",
    refine: {
      atkPct: step(16)
    }
  },
  "幽夜华尔兹": {
    title: "Buff下普攻及元素战技造成的伤害提升[aDmg]%",
    refine: {
      aDmg: step(20),
      eDmg: step(20)
    }
  },
  "破魔之弓": {
    title: "满能量下普攻伤害提高[aDmg]%，重击伤害提高[a2Dmg]%",
    buffCount: 2,
    refine: {
      aDmg: step(16),
      a2Dmg: step(12)
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
      qDmg: step(40)
    }
  },
  "冬极白星": [{
    title: "元素战技与元素爆发伤害提高[eDmg]%",
    refine: {
      eDmg: step(12),
      qDmg: step(12),
    }
  }, {
    title: "满Buff下提高攻击力[atkPct]%",
    refine: {
      atkPct: step(48, 12)
    }
  }],
  "飞雷之弦振": [{
    title: "满Buff下提高普攻伤害[aDmg]%",
    refine: {
      aDmg: step(40)
    }
  }],
  "终末嗟叹之诗": [{
    title: "元素精通提高[mastery]",
    refine: {
      mastery: step(60)
    }
  }, {
    title: "Buff下提高元素精通[mastery],攻击力[atkPct]%",
    refine: {
      mastery: step(100),
      atkPct: step(20)
    }
  }],
  "阿莫斯之弓": [{
    title: "普攻与重击伤害提高[a2Dmg]%",
    refine: {
      aDmg: step(12),
      a2Dmg: step(12)
    }
  }, {
    title: "5段Buff重击伤害提高[a2Dmg]%",
    buffCount: 5,
    refine: {
      aDmg: step(8),
      a2Dmg: step(8)
    }
  }],

  "若水": {
    title: "生命值提高[hpPct]%，伤害提高[dmg]%",
    refine: {
      hpPct: step(16),
      dmg: step(20)
    }
  },
  "陨龙之梦": {
    title: "护盾+满Buff提高攻击力[atkPct]%",
    buffCount: 10,
    refine: {
      atkPct: step(4)
    }
  },
  "落霞": {
    title: "二层状态下提高伤害[dmg]%",
    refine: {
      dmg: step(10, 2.5)
    }
  }
};

let sword = {
  "辰砂之纺锤": {
    title: "元素战技造成的伤害值提高[ePlus]",
    data: {
      ePlus: ({ attr, calc, refine }) => calc(attr.def) * step(40)[refine] / 100
    }
  },
  "腐殖之剑": {
    title: "元素战技的伤害增加[eDmg]%，暴击率提高[eCpct]%",
    refine: {
      eDmg: step(16),
      eCpct: step(6)
    }
  },
  "降临之剑": {
    title: "旅行者攻击力提高[atkPlus]",
    data: {
      atkPlus: 66
    }
  },
  "黑剑": {
    title: "普攻与重击的造成的伤害提升[aDmg]%",
    refine: {
      aDmg: step(20),
      a2Dmg: step(20)
    }
  },
  "暗巷闪光": {
    title: "角色造成的伤害提升[dmg]%",
    refine: {
      dmg: step(12)
    }
  },
  "宗室长剑": {
    title: "3层Buff下，暴击率提高[cpct]%",
    buffCount: 3,
    refine: {
      cpct: step(8)
    }
  },
  "试作斩岩": {
    title: "满Buff提高攻击力及防御力[atkPct]%",
    buffCount: 4,
    refine: {
      atkPct: step(4),
      defPct: step(4)
    }
  },
  "匣里龙吟": {
    check: ({ element }) => ['火', '雷'].includes(element),
    title: "对处于火元素或雷元素影响下的敌人，造成的伤害提高[dmg]%",
    refine: {
      dmg: step(20, 4)
    }
  },
  "铁蜂刺": {
    title: "满Buff伤害提高[dmg]%",
    buffCount: 2,
    refine: {
      dmg: step(6)
    }
  },
  "黑岩长剑": {
    title: "满Buff攻击力提高[atkPct]%",
    buffCount: 3,
    refine: {
      atkPct: step(12)
    }
  },
  "飞天御剑": {
    title: "施放元素爆发后，提高[atkPct]%的攻击力",
    refine: {
      atkPct: step(12)
    }
  },
  "黎明神剑": {
    title: "生命值高于90%时，暴击率提升[cpct]%",
    refine: {
      cpct: step(14)
    }
  },
  "暗铁剑": {
    check: ({ element }) => element === "雷",
    title: "触发雷元素相关反应后攻击力提高[atkPct]%",
    refine: {
      atkPct: step(20)
    }
  },
  "冷刃": {
    check: ({ element }) => ['水', '冰'].includes(element),
    title: "对处于水或冰元素影响的敌人伤害提高[dmg]%",
    refine: {
      dmg: step(12)
    }
  },
  "波乱月白经津": [{
    title: "元素伤害加成[dmg]%",
    refine: {
      dmg: step(12)
    }
  }, {
    title: "满层提高普攻[aDmg]%",
    buffCount: 2,
    refine: {
      aDmg: step(20)
    }
  }],
  "雾切之回光": [{
    title: "元素伤害加成[dmg]%",
    refine: {
      dmg: step(12)
    }
  }, {
    title: "满层获得伤害加成[dmg]%",
    refine: {
      dmg: step(28)
    }
  }],
  "苍古自由之誓": {
    title: "触发Buff后提高普攻重击与下落攻击[aDmg]%，攻击力提升[atkPct]%",
    refine: {
      aDmg: step(16),
      a2Dmg: step(16),
      a3Dmg: step(16),
      atkPct: step(20)
    }
  },
  "磐岩结绿": [{
    title: "基于生命值上限提高攻击力[atkPlus]",
    data: {
      atkPlus: ({ attr, calc, refine }) => calc(attr.hp) * step(1.2)[refine] / 100
    }
  }],
  "斫峰之刃": [{
    title: "护盾强效提升[shield]%",
    refine: {
      shield: step(20)
    }
  }, {
    title: "满Buff提高攻击力[atkPct]%",
    buffCount: 5,
    refine: {
      atkPct: step(4)
    }
  }],
  "天空之刃": [{
    title: "普攻与重击的伤害值提高[aPlus]",
    data: {
      aPlus: ({ attr, calc, refine }) => calc(attr.atk) * step(20)[refine] / 100,
      a2Plus: ({ attr, calc, refine }) => calc(attr.atk) * step(20)[refine] / 100
    }
  }],
  "风鹰剑": {
    title: "攻击力提高[_atkPct]%",
    refine: {
      _atkPct: step(20)
    }
  },

}

export const weapons = { ...polearm, ...catalyst, ...bow, ...sword };