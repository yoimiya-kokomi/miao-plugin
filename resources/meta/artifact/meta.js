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

export const subAttr = 'atk,atkPlus,def,defPlus,hp,hpPlus,mastery,recharge,cpct,cdmg'.split(',')

export const mainIdMap = {
  10001: {
    depotId: 1000,
    key: 'hpPlus'
  },
  10002: {
    depotId: 1000,
    key: 'hp',
    weight: 1334
  },
  10003: {
    depotId: 1000,
    key: 'atkPlus'
  },
  10004: {
    depotId: 1000,
    key: 'atk',
    weight: 1333
  },
  10005: {
    depotId: 1000,
    key: 'defPlus'
  },
  10006: {
    depotId: 1000,
    key: 'def',
    weight: 1333
  },
  10007: {
    depotId: 1000,
    key: 'recharge',
    weight: 500
  },
  10008: {
    depotId: 1000,
    key: 'mastery',
    weight: 500
  },
  12001: {
    depotId: 2000,
    key: 'atkPlus',
    weight: 1000
  },
  13001: {
    depotId: 3000,
    key: 'hpPlus'
  },
  13002: {
    depotId: 3000,
    key: 'hp',
    weight: 1100
  },
  13003: {
    depotId: 3000,
    key: 'atkPlus'
  },
  13004: {
    depotId: 3000,
    key: 'atk',
    weight: 1100
  },
  13005: {
    depotId: 3000,
    key: 'defPlus'
  },
  13006: {
    depotId: 3000,
    key: 'def',
    weight: 1100
  },
  13007: {
    depotId: 3000,
    key: 'cpct',
    weight: 500
  },
  13008: {
    depotId: 3000,
    key: 'cdmg',
    weight: 500
  },
  13009: {
    depotId: 3000,
    key: 'heal',
    weight: 500
  },
  13010: {
    depotId: 3000,
    key: 'mastery',
    weight: 200
  },
  14001: {
    depotId: 4000,
    key: 'hpPlus',
    weight: 1000
  },
  15001: {
    depotId: 5000,
    key: 'hpPlus'
  },
  15002: {
    depotId: 5000,
    key: 'hp',
    weight: 850
  },
  15003: {
    depotId: 5000,
    key: 'atkPlus'
  },
  15004: {
    depotId: 5000,
    key: 'atk',
    weight: 850
  },
  15005: {
    depotId: 5000,
    key: 'defPlus'
  },
  15006: {
    depotId: 5000,
    key: 'def',
    weight: 800
  },
  15007: {
    depotId: 5000,
    key: 'mastery',
    weight: 100
  },
  15008: {
    depotId: 5000,
    key: 'pyro',
    weight: 200
  },
  15009: {
    depotId: 5000,
    key: 'electro',
    weight: 200
  },
  15010: {
    depotId: 5000,
    key: 'cryo',
    weight: 200
  },
  15011: {
    depotId: 5000,
    key: 'hydro',
    weight: 200
  },
  15012: {
    depotId: 5000,
    key: 'anemo',
    weight: 200
  },
  15013: {
    depotId: 5000,
    key: 'geo',
    weight: 200
  },
  15014: {
    depotId: 5000,
    key: 'dendro'
  },
  15015: {
    depotId: 5000,
    key: 'phy',
    weight: 200
  },
  10990: {
    depotId: 1099,
    key: 'atk',
    weight: 999
  },
  10980: {
    depotId: 1098,
    key: 'hp',
    weight: 999
  },
  10970: {
    depotId: 1097,
    key: 'def',
    weight: 999
  },
  10960: {
    depotId: 1096,
    key: 'recharge',
    weight: 999
  },
  10950: {
    depotId: 1095,
    key: 'mastery',
    weight: 999
  },
  30990: {
    depotId: 3099,
    key: 'atk',
    weight: 999
  },
  30980: {
    depotId: 3098,
    key: 'hp',
    weight: 999
  },
  30970: {
    depotId: 3097,
    key: 'def',
    weight: 999
  },
  30960: {
    depotId: 3096,
    key: 'cpct',
    weight: 999
  },
  30950: {
    depotId: 3095,
    key: 'cdmg',
    weight: 999
  },
  30940: {
    depotId: 3094,
    key: 'heal',
    weight: 999
  },
  30930: {
    depotId: 3093,
    key: 'mastery',
    weight: 999
  },
  50990: {
    depotId: 5099,
    key: 'atk',
    weight: 999
  },
  50980: {
    depotId: 5098,
    key: 'hp',
    weight: 999
  },
  50970: {
    depotId: 5097,
    key: 'def',
    weight: 999
  },
  50960: {
    depotId: 5096,
    key: 'pyro',
    weight: 999
  },
  50950: {
    depotId: 5095,
    key: 'electro',
    weight: 999
  },
  50940: {
    depotId: 5094,
    key: 'cryo',
    weight: 999
  },
  50930: {
    depotId: 5093,
    key: 'hydro',
    weight: 999
  },
  50920: {
    depotId: 5092,
    key: 'anemo',
    weight: 999
  },
  50910: {
    depotId: 5091,
    key: 'geo',
    weight: 999
  },
  50900: {
    depotId: 5090,
    key: 'dendro',
    weight: 999
  },
  50890: {
    depotId: 5089,
    key: 'phy',
    weight: 999
  },
  50880: {
    depotId: 5088,
    key: 'mastery',
    weight: 999
  }
}

export const attrIdMap = {
  101021: {
    key: 'hpPlus',
    eff: 0.7998661408903833,
    position: 1
  },
  101022: {
    key: 'hpPlus',
    eff: 1,
    position: 2
  },
  101031: {
    key: 'hp',
    eff: 0.8013698223808419,
    position: 1
  },
  101032: {
    key: 'hp',
    eff: 1,
    position: 2
  },
  101051: {
    key: 'atkPlus',
    eff: 0.799999951093626,
    position: 1
  },
  101052: {
    key: 'atkPlus',
    eff: 1,
    position: 2
  },
  101061: {
    key: 'atk',
    eff: 0.8013698223808419,
    position: 1
  },
  101062: {
    key: 'atk',
    eff: 1,
    position: 2
  },
  101081: {
    key: 'defPlus',
    eff: 0.800865831025008,
    position: 1
  },
  101082: {
    key: 'defPlus',
    eff: 1,
    position: 2
  },
  101091: {
    key: 'def',
    eff: 0.8021977881396791,
    position: 1
  },
  101092: {
    key: 'def',
    eff: 1,
    position: 2
  },
  101201: {
    key: 'cpct',
    eff: 0.8041236658084417,
    position: 1
  },
  101202: {
    key: 'cpct',
    eff: 1,
    position: 2
  },
  101221: {
    key: 'cdmg',
    eff: 0.7989690355415727,
    position: 1
  },
  101222: {
    key: 'cdmg',
    eff: 1,
    position: 2
  },
  101231: {
    key: 'recharge',
    eff: 0.8024691315440212,
    position: 1
  },
  101232: {
    key: 'recharge',
    eff: 1,
    position: 2
  },
  101241: {
    key: 'mastery',
    eff: 0.7993138779408093,
    position: 1
  },
  101242: {
    key: 'mastery',
    eff: 1,
    position: 2
  },
  201021: {
    key: 'hpPlus',
    eff: 0.700000010640718,
    position: 1
  },
  201022: {
    key: 'hpPlus',
    eff: 0.8500697818291011,
    position: 2
  },
  201023: {
    key: 'hpPlus',
    eff: 1,
    position: 3
  },
  201031: {
    key: 'hp',
    eff: 0.6995708401537059,
    position: 1
  },
  201032: {
    key: 'hp',
    eff: 0.8497854200768529,
    position: 2
  },
  201033: {
    key: 'hp',
    eff: 1,
    position: 3
  },
  201051: {
    key: 'atkPlus',
    eff: 0.700214117238633,
    position: 1
  },
  201052: {
    key: 'atkPlus',
    eff: 0.8501070586193165,
    position: 2
  },
  201053: {
    key: 'atkPlus',
    eff: 1,
    position: 3
  },
  201061: {
    key: 'atk',
    eff: 0.6995708401537059,
    position: 1
  },
  201062: {
    key: 'atk',
    eff: 0.8497854200768529,
    position: 2
  },
  201063: {
    key: 'atk',
    eff: 1,
    position: 3
  },
  201081: {
    key: 'defPlus',
    eff: 0.6996403138377545,
    position: 1
  },
  201082: {
    key: 'defPlus',
    eff: 0.8489208343106637,
    position: 2
  },
  201083: {
    key: 'defPlus',
    eff: 1,
    position: 3
  },
  201091: {
    key: 'def',
    eff: 0.7010309324542161,
    position: 1
  },
  201092: {
    key: 'def',
    eff: 0.8522336763160644,
    position: 2
  },
  201093: {
    key: 'def',
    eff: 1,
    position: 3
  },
  201201: {
    key: 'cpct',
    eff: 0.7032258250586824,
    position: 1
  },
  201202: {
    key: 'cpct',
    eff: 0.8516129125293411,
    position: 2
  },
  201203: {
    key: 'cpct',
    eff: 1,
    position: 3
  },
  201221: {
    key: 'cdmg',
    eff: 0.7009646525642665,
    position: 1
  },
  201222: {
    key: 'cdmg',
    eff: 0.8488746119364413,
    position: 2
  },
  201223: {
    key: 'cdmg',
    eff: 1,
    position: 3
  },
  201231: {
    key: 'recharge',
    eff: 0.6988417152242902,
    position: 1
  },
  201232: {
    key: 'recharge',
    eff: 0.8494208216537456,
    position: 2
  },
  201233: {
    key: 'recharge',
    eff: 1,
    position: 3
  },
  201241: {
    key: 'mastery',
    eff: 0.6998928470745912,
    position: 1
  },
  201242: {
    key: 'mastery',
    eff: 0.8499463979833213,
    position: 2
  },
  201243: {
    key: 'mastery',
    eff: 1,
    position: 3
  },
  301021: {
    key: 'hpPlus',
    eff: 0.700000010640718,
    position: 1
  },
  301022: {
    key: 'hpPlus',
    eff: 0.8000000425628723,
    position: 2
  },
  301023: {
    key: 'hpPlus',
    eff: 0.9000000212814362,
    position: 3
  },
  301024: {
    key: 'hpPlus',
    eff: 1,
    position: 4
  },
  301031: {
    key: 'hp',
    eff: 0.699999978712627,
    position: 1
  },
  301032: {
    key: 'hp',
    eff: 0.800000021287373,
    position: 2
  },
  301033: {
    key: 'hp',
    eff: 0.9000000106436865,
    position: 3
  },
  301034: {
    key: 'hp',
    eff: 1,
    position: 4
  },
  301051: {
    key: 'atkPlus',
    eff: 0.700214117238633,
    position: 1
  },
  301052: {
    key: 'atkPlus',
    eff: 0.7997858317081389,
    position: 2
  },
  301053: {
    key: 'atkPlus',
    eff: 0.8993575461776449,
    position: 3
  },
  301054: {
    key: 'atkPlus',
    eff: 1,
    position: 4
  },
  301061: {
    key: 'atk',
    eff: 0.699999978712627,
    position: 1
  },
  301062: {
    key: 'atk',
    eff: 0.800000021287373,
    position: 2
  },
  301063: {
    key: 'atk',
    eff: 0.9000000106436865,
    position: 3
  },
  301064: {
    key: 'atk',
    eff: 1,
    position: 4
  },
  301081: {
    key: 'defPlus',
    eff: 0.7002700675271825,
    position: 1
  },
  301082: {
    key: 'defPlus',
    eff: 0.8001800736312134,
    position: 2
  },
  301083: {
    key: 'defPlus',
    eff: 0.9000900368156067,
    position: 3
  },
  301084: {
    key: 'defPlus',
    eff: 1,
    position: 4
  },
  301091: {
    key: 'def',
    eff: 0.7002288624079749,
    position: 1
  },
  301092: {
    key: 'def',
    eff: 0.8009153643849788,
    position: 2
  },
  301093: {
    key: 'def',
    eff: 0.8993134980229961,
    position: 3
  },
  301094: {
    key: 'def',
    eff: 1,
    position: 4
  },
  301201: {
    key: 'cpct',
    eff: 0.6995708401537059,
    position: 1
  },
  301202: {
    key: 'cpct',
    eff: 0.7982832806729697,
    position: 2
  },
  301203: {
    key: 'cpct',
    eff: 0.9012875594807361,
    position: 3
  },
  301204: {
    key: 'cpct',
    eff: 1,
    position: 4
  },
  301221: {
    key: 'cdmg',
    eff: 0.6995708401537059,
    position: 1
  },
  301222: {
    key: 'cdmg',
    eff: 0.8004292397881477,
    position: 2
  },
  301223: {
    key: 'cdmg',
    eff: 0.9012875594807361,
    position: 3
  },
  301224: {
    key: 'cdmg',
    eff: 1,
    position: 4
  },
  301231: {
    key: 'recharge',
    eff: 0.6992288170077031,
    position: 1
  },
  301232: {
    key: 'recharge',
    eff: 0.7994858620441655,
    position: 2
  },
  301233: {
    key: 'recharge',
    eff: 0.8997429549635376,
    position: 3
  },
  301234: {
    key: 'recharge',
    eff: 1,
    position: 4
  },
  301241: {
    key: 'mastery',
    eff: 0.6997855698371146,
    position: 1
  },
  301242: {
    key: 'mastery',
    eff: 0.7998570238353141,
    position: 2
  },
  301243: {
    key: 'mastery',
    eff: 0.8999285460018005,
    position: 3
  },
  301244: {
    key: 'mastery',
    eff: 1,
    position: 4
  },
  401021: {
    key: 'hpPlus',
    eff: 0.7000000127688611,
    position: 1
  },
  401022: {
    key: 'hpPlus',
    eff: 0.7999999872311389,
    position: 2
  },
  401023: {
    key: 'hpPlus',
    eff: 0.9000000255377223,
    position: 3
  },
  401024: {
    key: 'hpPlus',
    eff: 1,
    position: 4
  },
  401031: {
    key: 'hp',
    eff: 0.6995708401537059,
    position: 1
  },
  401032: {
    key: 'hp',
    eff: 0.8004292397881477,
    position: 2
  },
  401033: {
    key: 'hp',
    eff: 0.9012875594807361,
    position: 3
  },
  401034: {
    key: 'hp',
    eff: 1,
    position: 4
  },
  401051: {
    key: 'atkPlus',
    eff: 0.6998714684861824,
    position: 1
  },
  401052: {
    key: 'atkPlus',
    eff: 0.8001285008687569,
    position: 2
  },
  401053: {
    key: 'atkPlus',
    eff: 0.899742906327304,
    position: 3
  },
  401054: {
    key: 'atkPlus',
    eff: 1,
    position: 4
  },
  401061: {
    key: 'atk',
    eff: 0.6995708401537059,
    position: 1
  },
  401062: {
    key: 'atk',
    eff: 0.8004292397881477,
    position: 2
  },
  401063: {
    key: 'atk',
    eff: 0.9012875594807361,
    position: 3
  },
  401064: {
    key: 'atk',
    eff: 1,
    position: 4
  },
  401081: {
    key: 'defPlus',
    eff: 0.6997840020416457,
    position: 1
  },
  401082: {
    key: 'defPlus',
    eff: 0.800215946464062,
    position: 2
  },
  401083: {
    key: 'defPlus',
    eff: 0.9001079732320311,
    position: 3
  },
  401084: {
    key: 'defPlus',
    eff: 1,
    position: 4
  },
  401091: {
    key: 'def',
    eff: 0.6998285024582124,
    position: 1
  },
  401092: {
    key: 'def',
    eff: 0.799313882035583,
    position: 2
  },
  401093: {
    key: 'def',
    eff: 0.9005145565239961,
    position: 3
  },
  401094: {
    key: 'def',
    eff: 1,
    position: 4
  },
  401201: {
    key: 'cpct',
    eff: 0.7009646525642665,
    position: 1
  },
  401202: {
    key: 'cpct',
    eff: 0.8006431216735538,
    position: 2
  },
  401203: {
    key: 'cpct',
    eff: 0.900321590782841,
    position: 3
  },
  401204: {
    key: 'cpct',
    eff: 1,
    position: 4
  },
  401221: {
    key: 'cdmg',
    eff: 0.6993569082725104,
    position: 1
  },
  401222: {
    key: 'cdmg',
    eff: 0.7990353773817976,
    position: 2
  },
  401223: {
    key: 'cdmg',
    eff: 0.900321590782841,
    position: 3
  },
  401224: {
    key: 'cdmg',
    eff: 1,
    position: 4
  },
  401231: {
    key: 'recharge',
    eff: 0.70077217786434,
    position: 1
  },
  401232: {
    key: 'recharge',
    eff: 0.7992277861772604,
    position: 2
  },
  401233: {
    key: 'recharge',
    eff: 0.8996138571302306,
    position: 3
  },
  401234: {
    key: 'recharge',
    eff: 1,
    position: 4
  },
  401241: {
    key: 'mastery',
    eff: 0.7002681333376832,
    position: 1
  },
  401242: {
    key: 'mastery',
    eff: 0.8000000204541412,
    position: 2
  },
  401243: {
    key: 'mastery',
    eff: 0.9002681640188951,
    position: 3
  },
  401244: {
    key: 'mastery',
    eff: 1,
    position: 4
  },
  501021: {
    key: 'hpPlus',
    eff: 0.7000167527458159,
    position: 1
  },
  501022: {
    key: 'hpPlus',
    eff: 0.8,
    position: 2
  },
  501023: {
    key: 'hpPlus',
    eff: 0.9000167527458159,
    position: 3
  },
  501024: {
    key: 'hpPlus',
    eff: 1,
    position: 4
  },
  501031: {
    key: 'hp',
    eff: 0.6998285024582124,
    position: 1
  },
  501032: {
    key: 'hp',
    eff: 0.799313882035583,
    position: 2
  },
  501033: {
    key: 'hp',
    eff: 0.9005145565239961,
    position: 3
  },
  501034: {
    key: 'hp',
    eff: 1,
    position: 4
  },
  501051: {
    key: 'atkPlus',
    eff: 0.700257036056831,
    position: 1
  },
  501052: {
    key: 'atkPlus',
    eff: 0.7999999901935807,
    position: 2
  },
  501053: {
    key: 'atkPlus',
    eff: 0.9002570458632503,
    position: 3
  },
  501054: {
    key: 'atkPlus',
    eff: 1,
    position: 4
  },
  501061: {
    key: 'atk',
    eff: 0.6998285024582124,
    position: 1
  },
  501062: {
    key: 'atk',
    eff: 0.799313882035583,
    position: 2
  },
  501063: {
    key: 'atk',
    eff: 0.9005145565239961,
    position: 3
  },
  501064: {
    key: 'atk',
    eff: 1,
    position: 4
  },
  501081: {
    key: 'defPlus',
    eff: 0.6997840617661291,
    position: 1
  },
  501082: {
    key: 'defPlus',
    eff: 0.8000000329563484,
    position: 2
  },
  501083: {
    key: 'defPlus',
    eff: 0.8997840288097807,
    position: 3
  },
  501084: {
    key: 'defPlus',
    eff: 1,
    position: 4
  },
  501091: {
    key: 'def',
    eff: 0.6995884908250543,
    position: 1
  },
  501092: {
    key: 'def',
    eff: 0.7997256775838287,
    position: 2
  },
  501093: {
    key: 'def',
    eff: 0.8998628643426032,
    position: 3
  },
  501094: {
    key: 'def',
    eff: 1,
    position: 4
  },
  501201: {
    key: 'cpct',
    eff: 0.6992288170077031,
    position: 1
  },
  501202: {
    key: 'cpct',
    eff: 0.7994858620441655,
    position: 2
  },
  501203: {
    key: 'cpct',
    eff: 0.8997429549635376,
    position: 3
  },
  501204: {
    key: 'cpct',
    eff: 1,
    position: 4
  },
  501221: {
    key: 'cdmg',
    eff: 0.7001287406686748,
    position: 1
  },
  501222: {
    key: 'cdmg',
    eff: 0.8005148188410904,
    position: 2
  },
  501223: {
    key: 'cdmg',
    eff: 0.8996139218275844,
    position: 3
  },
  501224: {
    key: 'cdmg',
    eff: 1,
    position: 4
  },
  501231: {
    key: 'recharge',
    eff: 0.6990740469264689,
    position: 1
  },
  501232: {
    key: 'recharge',
    eff: 0.7993827171139947,
    position: 2
  },
  501233: {
    key: 'recharge',
    eff: 0.8996913298124741,
    position: 3
  },
  501234: {
    key: 'recharge',
    eff: 1,
    position: 4
  },
  501241: {
    key: 'mastery',
    eff: 0.7001287030773611,
    position: 1
  },
  501242: {
    key: 'mastery',
    eff: 0.800085802051574,
    position: 2
  },
  501243: {
    key: 'mastery',
    eff: 0.900042901025787,
    position: 3
  },
  501244: {
    key: 'mastery',
    eff: 1,
    position: 4
  }
}
