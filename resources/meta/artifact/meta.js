export const abbr = {
  炽烈的炎之魔女: '魔女',
  昔日宗室之仪: '宗室',
  翠绿之影: '风套',
  千岩牢固: '千岩',
  流浪大地的乐团: '乐团',
  绝缘之旗印: '绝缘',
  被怜爱的少女: '少女',
  沉沦之心: '水套',
  角斗士的终幕礼: '角斗',
  冰风迷途的勇士: '冰套',
  逆飞的流星: '逆飞',
  苍白之火: '苍白',
  华馆梦醒形骸记: '华馆',
  战狂: '战狂',
  悠古的磐岩: '岩套',
  渡过烈火的贤人: '渡火',
  游医: '游医',
  教官: '教官',
  冒险家: '冒险',
  追忆之注连: '追忆',
  海染砗磲: '海染',
  如雷的盛怒: '如雷',
  染血的骑士道: '染血',
  平息鸣雷的尊者: '平雷',
  流放者: '流放',
  学士: '学士',
  行者之心: '行者',
  幸运儿: '幸运',
  勇士之心: '勇士',
  守护之心: '守护',
  武人: '武人',
  赌徒: '赌徒',
  奇迹: '奇迹',
  辰砂往生录: '辰砂',
  来歆余响: '余响',
  深林的记忆: '草套',
  饰金之梦: '饰金',
  沙上楼阁史话: '沙套',
  乐园遗落之花: '乐园'
}

export const attrValue = {
  cpct: 3.89,
  cdmg: 7.77,
  mastery: 23.31,
  atk: 5.83,
  hp: 5.83,
  def: 7.29,
  recharge: 6.48,
  dmg: 5.825,
  phy: 7.288,
  heal: 4.487
}
/**
 *
 * @type {{phy: {format: string, text: string, title: string, type: string, value: number}, def: {valueMin: number, format: string, calc: string, text: string, title: string, type: string, value: number}, hp: {valueMin: number, format: string, calc: string, text: string, title: string, type: string, value: number}, atkPlus: {valueMin: number, format: string, title: string, type: string, value: number, base: string}, hpPlus: {valueMin: number, format: string, title: string, type: string, value: number, base: string}, mastery: {valueMin: number, format: string, calc: string, text: string, title: string, type: string, value: number}, cpct: {valueMin: number, format: string, calc: string, text: string, title: string, type: string, value: number}, defPlus: {valueMin: number, format: string, title: string, type: string, value: number, base: string}, cdmg: {valueMin: number, format: string, calc: string, text: string, title: string, type: string, value: number}, recharge: {valueMin: number, format: string, calc: string, text: string, title: string, type: string, value: number}, heal: {format: string, text: string, title: string, type: string, value: number}, atk: {valueMin: number, format: string, calc: string, text: string, title: string, type: string, value: number}, dmg: {format: string, text: string, title: string, type: string, value: number}}}
 */
export const attrMap = {
  atk: { title: '大攻击', format: 'pct', calc: 'pct', type: 'normal', value: 5.83, text: '5.83%', valueMin: 4.08 },
  atkPlus: { title: '小攻击', format: 'comma', type: 'plus', base: 'atk', value: 19.45, valueMin: 13.62 },
  def: { title: '大防御', format: 'pct', calc: 'pct', type: 'normal', value: 7.29, text: '7.29%', valueMin: 5.1 },
  defPlus: { title: '小防御', format: 'comma', type: 'plus', base: 'def', value: 23.15, valueMin: 16.2 },
  hp: { title: '大生命', format: 'pct', calc: 'pct', type: 'normal', value: 5.83, text: '5.83%', valueMin: 4.08 },
  hpPlus: { title: '小生命', format: 'comma', type: 'plus', base: 'hp', value: 298.75, valueMin: 209.13 },
  cpct: { title: '暴击率', format: 'pct', calc: 'plus', type: 'normal', value: 3.89, text: '3.89%', valueMin: 2.72 },
  cdmg: { title: '暴击伤害', format: 'pct', calc: 'plus', type: 'normal', value: 7.77, text: '7.77%', valueMin: 5.44 },
  mastery: { title: '元素精通', format: 'comma', calc: 'plus', type: 'normal', value: 23.31, text: '23.31', valueMin: 16.32 },
  recharge: { title: '充能效率', format: 'pct', calc: 'plus', type: 'normal', value: 6.48, text: '6.48%', valueMin: 4.53 },
  dmg: { title: '元素伤害', format: 'pct', type: 'normal', value: 5.825, text: '5.83%' },
  phy: { title: '物伤加成', format: 'pct', type: 'normal', value: 7.288, text: '7.29%' },
  heal: { title: '治疗加成', format: 'pct', type: 'normal', value: 4.487, text: '4.49%' }
}

let anMap = {}
for (let attr in attrMap) {
  anMap[attrMap[attr].title] = attr
}

export const attrNameMap = anMap

export const mainAttr = {
  3: 'atk,def,hp,mastery,recharge'.split(','),
  4: 'atk,def,hp,mastery,dmg,phy'.split(','),
  5: 'atk,def,hp,mastery,heal,cpct,cdmg'.split(',')
}

export const subAttr = 'atk,def,hp,mastery,recharge,cpct,cdmg'.split(',')
