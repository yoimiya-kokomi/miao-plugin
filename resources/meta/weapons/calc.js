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
      atkPlus: ({ attr, refine }) => {
        let { hp } = attr,
          totalHp = hp.base + hp.plus + hp.pct * hp.base / 100;
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
}

export const weapons = { ...polearm };