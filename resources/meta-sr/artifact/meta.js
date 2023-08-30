import lodash from 'lodash'
import { Format } from '#miao'
import { attrPct, basicNum } from '../../meta/artifact/index.js'

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
const attrMap = {
  atk: { title: '大攻击', format: 'pct', calc: 'pct', value: 4.32 },
  atkPlus: { title: '小攻击', format: 'comma', value: 127 / 6 },
  def: { title: '大防御', format: 'pct', calc: 'pct', value: 5.4 },
  defPlus: { title: '小防御', format: 'comma', value: 127 / 6 },
  hp: { title: '大生命', format: 'pct', calc: 'pct', value: 4.32 },
  hpPlus: { title: '小生命', format: 'comma', value: 254 / 6 },
  speed: { title: '速度', format: 'comma', calc: 'plus', value: 2.6 },
  cpct: { title: '暴击率', format: 'pct', calc: 'plus', value: 3.24 },
  cdmg: { title: '暴击伤害', format: 'pct', calc: 'plus', value: 6.48 },
  recharge: { title: '充能效率', format: 'pct', calc: 'plus', value: 3.11 },
  dmg: { title: '伤害加成', format: 'pct', value: 6.22 },
  heal: { title: '治疗加成', format: 'pct', calc: 'pct' },
  stance: { title: '击破特攻', format: 'pct', value: 6.48, calc: 'pct' },
  effPct: { title: '效果命中', format: 'pct', value: 4.32, calc: 'pct' },
  effDef: { title: '效果抵抗', format: 'pct', value: 4.32, calc: 'pct' }
}

lodash.forEach(attrMap, (attr, key) => {
  // 设置value
  if (!attr.value) {
    return true
  }

  // 设置type
  attr.base = { hpPlus: 'hp', atkPlus: 'atk', defPlus: 'def' }[key]
  attr.type = attr.base ? 'plus' : 'normal'

  // 设置展示文字
  attr.text = Format[attr.format](attr.value, 2)

})

export { attrMap }

export const abbr = {
  快枪手的野穗毡帽: '快枪手的毡帽',
  快枪手的粗革手套: '快枪手的手套',
  快枪手的猎风披肩: '快枪手的披肩',
  快枪手的铆钉马靴: '快枪手的铆钉靴',
  废土客的呼吸面罩: '废土客的面罩',
  废土客的荒漠终端: '废土客的终端',
  废土客的修士长袍: '废土客的长袍',
  废土客的动力腿甲: '废土客的腿甲',
  '「黑塔」的空间站点': '黑塔的空间站点',
  '「黑塔」的漫历轨迹': '黑塔的漫历轨迹',
  罗浮仙舟的天外楼船: '罗浮仙舟的楼船',
  罗浮仙舟的建木枝蔓: '罗浮仙舟的建木',
  贝洛伯格的存护堡垒: '贝洛伯格的堡垒',
  贝洛伯格的铁卫防线: '贝洛伯格的防线',
  螺丝星的机械烈阳: '螺丝星的烈阳',
  螺丝星的环星孔带: '螺丝星的孔带',
  萨尔索图的移动城市: '萨尔索图的城市',
  萨尔索图的晨昏界线: '萨尔索图的界线',
  塔利亚的钉壳小镇: '塔利亚的小镇',
  塔利亚的裸皮电线: '塔利亚的电线',
  翁瓦克的诞生之岛: '翁瓦克的诞生岛',
  翁瓦克的环岛海岸: '翁瓦克的海岸',
  泰科铵的镭射球场:'泰科铵的球场',
  泰科铵的弧光赛道:'泰科铵的赛道',
  伊须磨洲的残船鲸落:'伊须磨洲的鲸落',
  伊须磨洲的坼裂缆索:'伊须磨洲的缆索'
}