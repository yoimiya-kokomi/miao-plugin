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
export const attrMap = {
  atk: { title: '大攻击', format: 'pct', type: 'normal', value: 5.83, text: '5.83%' },
  atkPlus: { title: '小攻击', format: 'comma', type: 'plus', base: 'atk', value: 15.56 },
  def: { title: '大防御', format: 'pct', type: 'normal', value: 7.29, text: '7.29%' },
  defPlus: { title: '小防御', format: 'comma', type: 'plus', base: 'def', value: 18.52 },
  hp: { title: '大生命', format: 'pct', type: 'normal', value: 5.83, text: '5.83%' },
  hpPlus: { title: '小生命', format: 'comma', type: 'plus', base: 'hp', value: 239.0 },
  cpct: { title: '暴击率', format: 'pct', type: 'normal', value: 3.89, text: '3.89%' },
  cdmg: { title: '暴击伤害', format: 'pct', type: 'normal', value: 7.77, text: '7.77%' },
  mastery: { title: '元素精通', format: 'comma', type: 'normal', value: 23.31, text: '23.31' },
  recharge: { title: '充能效率', format: 'pct', type: 'normal', value: 6.48, text: '6.48%' },
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

export const usefulAttr = {
  神里绫人: { hp: 50, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 0, dmg: 100, phy: 0, recharge: 30, heal: 0 },
  八重神子: { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 75, dmg: 100, phy: 0, recharge: 55, heal: 0 },
  申鹤: { hp: 0, atk: 100, def: 0, cpct: 100, cdmg: 100, mastery: 0, dmg: 100, phy: 0, recharge: 55, heal: 0 },
  云堇: { hp: 0, atk: 75, def: 100, cpct: 80, cdmg: 80, mastery: 0, dmg: 80, phy: 0, recharge: 80, heal: 0 },
  荒泷一斗: { hp: 0, atk: 50, def: 100, cpct: 100, cdmg: 100, mastery: 0, dmg: 100, phy: 0, recharge: 30, heal: 0 },
  五郎: { hp: 0, atk: 75, def: 100, cpct: 50, cdmg: 50, mastery: 0, dmg: 100, phy: 0, recharge: 75, heal: 0 },
  班尼特: { hp: 100, atk: 50, def: 0, cpct: 100, cdmg: 100, mastery: 0, dmg: 80, phy: 0, recharge: 55, heal: 100 },
  枫原万叶: { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 100, dmg: 100, phy: 0, recharge: 55, heal: 0 },
  行秋: { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 0, dmg: 100, phy: 0, recharge: 75, heal: 0 },
  钟离: { hp: 80, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 0, dmg: 100, phy: 50, recharge: 55, heal: 0 },
  神里绫华: { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 0, dmg: 100, phy: 0, recharge: 30, heal: 0 },
  香菱: { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 75, dmg: 100, phy: 0, recharge: 55, heal: 0 },
  胡桃: { hp: 80, atk: 50, def: 0, cpct: 100, cdmg: 100, mastery: 75, dmg: 100, phy: 0, recharge: 0, heal: 0 },
  温迪: { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 75, dmg: 100, phy: 0, recharge: 55, heal: 0 },
  珊瑚宫心海: { hp: 100, atk: 50, def: 0, cpct: 0, cdmg: 0, mastery: 0, dmg: 100, phy: 0, recharge: 55, heal: 100 },
  莫娜: { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 75, dmg: 100, phy: 0, recharge: 75, heal: 0 },
  阿贝多: { hp: 0, atk: 0, def: 100, cpct: 100, cdmg: 100, mastery: 0, dmg: 100, phy: 0, recharge: 0, heal: 0 },
  迪奥娜: { hp: 100, atk: 50, def: 0, cpct: 50, cdmg: 50, mastery: 0, dmg: 100, phy: 0, recharge: 90, heal: 100 },
  优菈: { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 0, dmg: 40, phy: 100, recharge: 55, heal: 0 },
  达达利亚: { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 75, dmg: 100, phy: 0, recharge: 30, heal: 0 },
  魈: { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 0, dmg: 100, phy: 0, recharge: 55, heal: 0 },
  宵宫: { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 75, dmg: 100, phy: 0, recharge: 0, heal: 0 },
  九条裟罗: { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 0, dmg: 100, phy: 0, recharge: 55, heal: 0 },
  琴: { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 0, dmg: 100, phy: 100, recharge: 55, heal: 100 },
  菲谢尔: { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 75, dmg: 100, phy: 60, recharge: 0, heal: 0 },
  罗莎莉亚: { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 0, dmg: 70, phy: 80, recharge: 30, heal: 0 },
  可莉: { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 75, dmg: 100, phy: 0, recharge: 30, heal: 0 },
  凝光: { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 0, dmg: 100, phy: 0, recharge: 30, heal: 0 },
  北斗: { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 75, dmg: 100, phy: 0, recharge: 55, heal: 0 },
  刻晴: { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 75, dmg: 100, phy: 100, recharge: 0, heal: 0 },
  托马: { hp: 90, atk: 55, def: 0, cpct: 90, cdmg: 90, mastery: 0, dmg: 90, phy: 0, recharge: 55, heal: 0 },
  迪卢克: { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 75, dmg: 100, phy: 0, recharge: 0, heal: 0 },
  诺艾尔: { hp: 0, atk: 50, def: 90, cpct: 100, cdmg: 100, mastery: 0, dmg: 100, phy: 0, recharge: 70, heal: 0 },
  旅行者: { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 0, dmg: 100, phy: 0, recharge: 55, heal: 0 },
  重云: { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 75, dmg: 100, phy: 0, recharge: 55, heal: 0 },
  七七: { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 0, dmg: 100, phy: 100, recharge: 55, heal: 100 },
  凯亚: { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 0, dmg: 100, phy: 100, recharge: 30, heal: 0 },
  烟绯: { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 75, dmg: 100, phy: 0, recharge: 30, heal: 0 },
  早柚: { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 100, dmg: 100, phy: 0, recharge: 55, heal: 100 },
  安柏: { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 75, dmg: 100, phy: 100, recharge: 0, heal: 0 },
  丽莎: { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 75, dmg: 100, phy: 0, recharge: 0, heal: 0 },
  埃洛伊: { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 0, dmg: 100, phy: 0, recharge: 0, heal: 0 },
  辛焱: { hp: 0, atk: 75, def: 75, cpct: 100, cdmg: 100, mastery: 0, dmg: 100, phy: 100, recharge: 0, heal: 0 },
  砂糖: { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 100, dmg: 75, phy: 0, recharge: 55, heal: 0 },
  雷泽: { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 0, dmg: 100, phy: 100, recharge: 0, heal: 0 },
  夜兰: { hp: 80, atk: 0, def: 0, cpct: 100, cdmg: 100, mastery: 0, dmg: 100, phy: 0, recharge: 55, heal: 0 },
  久岐忍: { hp: 100, atk: 50, def: 0, cpct: 100, cdmg: 100, mastery: 75, dmg: 100, phy: 0, recharge: 55, heal: 100 },
  鹿野院平藏: { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 75, dmg: 100, phy: 0, recharge: 30, heal: 0 },
  提纳里: { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 90, dmg: 100, phy: 0, recharge: 30, heal: 0 },
  柯莱: { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 75, dmg: 100, phy: 0, recharge: 30, heal: 0 },
  空: { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 75, dmg: 100, phy: 0, recharge: 55, heal: 0 },
  荧: { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 75, dmg: 100, phy: 0, recharge: 55, heal: 0 },
  赛诺: { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 75, dmg: 100, phy: 0, recharge: 55, heal: 0 },
  坎蒂丝: { hp: 75, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 0, dmg: 100, phy: 0, recharge: 55, heal: 0 },
  妮露: { hp: 80, atk: 0, def: 0, cpct: 100, cdmg: 100, mastery: 75, dmg: 80, phy: 0, recharge: 30, heal: 0 },
  纳西妲: { hp: 0, atk: 55, def: 0, cpct: 100, cdmg: 100, mastery: 100, dmg: 100, phy: 0, recharge: 55, heal: 0 },
  多莉: { hp: 75, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 0, dmg: 75, phy: 0, recharge: 55, heal: 100 }
}
