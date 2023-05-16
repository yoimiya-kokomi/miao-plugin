export const mainAttr = {
  3: 'atk,def,hp,cpct,cdmg,heal,effPct'.split(','),
  4: 'atk,def,hp,speed'.split(','),
  5: 'atk,def,hp,dmg'.split(','),
  6: 'atk,def,hp,recharge,stance'.split(',')
}

export const subAttr = 'atk,atkPlus,def,defPlus,hp,hpPlus,speed,cpct,cdmg,effPct,effDef,stance'.split(',')

/**
 * 圣遗物词条配置
 * @[]value 副词条单次提升值（最大档位）
 * @[]valueMin 副词条单次提升最小值
 * @[]calc 伤害计算时变更的字段type
 * @[]type 词条的类型 normal:普通字段 plus:小词条
 * @[]base 词条类型为小词条时，对应的大词条
 * @[]text 展示文字
 */
export const attrMap = {
  atk: { title: '大攻击', format: 'pct', calc: 'pct' },
  atkPlus: { title: '小攻击', format: 'comma' },
  def: { title: '大防御', format: 'pct', calc: 'pct' },
  defPlus: { title: '小防御', format: 'comma' },
  hp: { title: '大生命', format: 'pct', calc: 'pct' },
  hpPlus: { title: '小生命', format: 'comma' },
  speed: { title: '速度', format: 'comma' },
  cpct: { title: '暴击率', format: 'pct', calc: 'plus' },
  cdmg: { title: '暴击伤害', format: 'pct', calc: 'plus' },
  recharge: { title: '充能效率', format: 'pct', calc: 'plus' },
  dmg: { title: '伤害加成', format: 'pct' },
  heal: { title: '治疗加成', format: 'pct' },
  stance: { title: '击破特攻', format: 'pct' },
  effPct: { title: '效果命中', format: 'pct' },
  effDef: { title: '效果抵抗', format: 'pct' }
}