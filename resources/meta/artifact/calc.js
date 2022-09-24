export const buffs = {
  行者之心4: {
    title: '行者4：重击的暴击率提高30%',
    data: {
      a2Cpct: 30
    }
  },
  勇士之心4: {
    title: '勇士4：对生命值高于50%的敌人，造成的伤害增加30%',
    data: {
      dmg: 30
    }
  },
  武人2: {
    title: '武人2: 普攻与重击造成的伤害提高15%',
    data: {
      aDmg: 15,
      a2Dmg: 15
    }
  },
  武人4: {
    title: '武人4：施放元素战技后的8秒内，普攻和重击伤害提升25%',
    data: {
      aDmg: 25,
      a2Dmg: 25
    }
  },
  战狂4: {
    title: '战狂4：生命值低于70%时，暴击率提升24%',
    data: {
      cpct: 24
    }
  },
  染血的骑士道4: {
    title: '染血4：击败敌人后的10秒内，重击造成的伤害提升50%',
    data: {
      a2Dmg: 50
    }
  },
  角斗士的终幕礼4: {
    check: ({ weaponType }) => ['单手剑', '双手剑', '长柄武器'].includes(weaponType),
    title: '角斗4：角色普通攻击造成的伤害提高35%',
    data: {
      aDmg: 35
    }
  },
  流浪大地的乐团4: {
    check: ({ weaponType }) => ['法器', '弓'].includes(weaponType),
    title: '乐团4：角色重击造成的伤害提高35%',
    data: {
      a2Dmg: 35
    }
  },
  苍白之火4: {
    title: '苍白4：2层提高18%攻击力，物理伤害额外提高25%',
    data: {
      atkPct: 18,
      phy: 25
    }
  },
  赌徒2: {
    title: '赌徒2：元素战技造成的伤害提升20%',
    data: {
      eDmg: 20
    }
  },
  悠古的磐岩4: {
    title: '磐岩4：获得元素反应晶片，对应元素伤害提高35%',
    data: {
      dmg: 35
    }
  },
  炽烈的炎之魔女4: {
    check: ({ element }) => element === '火',
    title: '魔女4：蒸发、融化伤害提高15%，[buffCount]层额外提高[dmg]%火元素伤害加成',
    data: {
      zf: 15,
      rh: 15,
      dmg: ({ params }) => (params.monv || 1) * 7.5,
      buffCount: ({ params }) => params.monv || 1
    }
  },
  昔日宗室之仪2: {
    title: '宗室2：元素爆发造成的伤害提升20%',
    data: {
      qDmg: 20
    }
  },
  昔日宗室之仪4: {
    title: '宗室4：施放元素爆发后，攻击力提升20%',
    check: ({ currentTalent }) => !currentTalent || currentTalent === 'q',
    data: {
      atkPct: 20
    }
  },
  冰风迷途的勇士4: {
    check: ({ element }) => element === '冰',
    title: '冰套4：攻击处于冰元素影响下的敌人时，暴击率提高20%',
    data: {
      cpct: 20
    }
  },
  沉沦之心4: {
    title: '水套4：施放元素战技后，普攻与重击伤害提高30%',
    data: {
      aDmg: 30,
      a2Dmg: 30
    }
  },
  冰之川与雪之砂4: {
    title: '冰雪4：融化加成提高15%，释放元素爆发后，冰伤提高30%',
    data: {
      rh: 15,
      dmg: 30
    }
  },
  追忆之注连4: {
    title: '追忆4：施放元素战技后，普通攻击、重击、下落攻击造成的伤害提高50%',
    data: {
      aDmg: 50,
      a2Dmg: 50,
      a3Dmg: 50
    }
  },
  逆飞的流星4: {
    title: '逆飞4：处于护盾庇护下时，获得40%普攻和重击伤害加成',
    data: {
      aDmg: 40,
      a2Dmg: 40
    }
  },
  平息鸣雷的尊者4: {
    check: ({ element }) => element === '雷',
    title: '平雷4：对处于雷元素影响下的敌人造成的伤害提升35%',
    data: {
      dmg: 35
    }
  },
  渡过烈火的贤人4: {
    check: ({ element }) => element === '火',
    title: '渡火4：对处于火元素影响下的敌人造成的伤害提升35%',
    data: {
      dmg: 35
    }
  },
  教官4: {
    title: '教官4：触发元素反应后，队伍中所有角色的元素精通提高120点',
    data: {
      mastery: 120,
      masteryInc: 120
    }
  },
  千岩牢固4: {
    title: '千岩4：元素战技命中敌人后，攻击力提升20%',
    data: {
      atkPct: 20
    }
  },
  绝缘之旗印4: {
    title: '绝缘4：基于元素充能效率提高元素爆发[qDmg]%伤害',
    data: {
      qDmg: ({ attr }) => Math.min(75, (attr.recharge.base + attr.recharge.plus) * 0.25)
    }
  },
  华馆梦醒形骸记4: {
    title: '华馆4：满层获得24%防御及24%岩伤加成',
    sort: 0,
    data: {
      defPct: 24,
      dmg: 24
    }
  },
  辰砂往生录4: {
    title: '辰砂4：满层提高48%攻击力',

    data: {
      atkPct: 48
    }
  },
  来歆余响4: {
    title: '余响4：触发提高普攻[aPlus]伤害',
    data: {
      aPlus: ({ attr }) => (attr.atk.base + attr.atk.plus + attr.atk.pct * attr.atk.base / 100) * 0.7
    }
  },
  被怜爱的少女4: {
    title: '少女4：施放元素战技或元素爆发后，受治疗效果加成提高20%',
    data: {
      healInc: 20
    }
  },
  翠绿之影4: {
    title: '翠绿4：扩散反应造成的伤害提升60%，降低对应元素抗性40%',
    sort: 5,
    data: {
      ks: 60,
      fykx: 40
    }
  },
  如雷的盛怒4: {
    title: '如雷4：超载、感电、超导反应造成的伤害提升40%',
    data: {
      cz: 40,
      gd: 40,
      cd: 40
    }
  },
  深林的记忆4: {
    title: '元素战技或元素爆发命中敌人后，使命中目标的草元素抗性降低30%',
    data: {
      kx: 30
    }
  },
  饰金之梦4: {
    title: '队伍存在其他3个不同元素类型角色时，精通提高150',
    data: {
      mastery: 150
    }
  }
}
