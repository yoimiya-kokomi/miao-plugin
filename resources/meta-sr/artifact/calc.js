let attr = (key, val) => {
  let data = {}
  data[key] = val
  return {
    isStatic: true,
    data
  }
}
export default {
  云无留迹的过客2: attr('heal', 10),
  野穗伴行的快枪手2: attr('atkPct', 12),
  野穗伴行的快枪手4: [attr('speed', 6), attr('aDmg', 10)],
  净庭教宗的圣骑士2: attr('defPct', 15),
  净庭教宗的圣骑士4: attr('shield', 20),
  密林卧雪的猎人2: attr('ice', 10),
  街头出身的拳王2: attr('phy', 10),
  熔岩锻铸的火匠2: attr('fire', 10),
  繁星璀璨的天才2: attr('quantum', 10),
  激奏雷电的乐队2: attr('elec', 10),
  晨昏交界的翔鹰2: attr('wind', 10),
  流星追迹的怪盗2: attr('stance', 16),
  流星追迹的怪盗4: attr('stance', 16),
  盗匪荒漠的废土客2: attr('imaginary', 10),
  太空封印站2: attr('atkPct', 12),
  不老者的仙舟2: attr('hpPct', 12),
  泛银河商业公司2: attr('effPct', 12),
  筑城者的贝洛伯格2: attr('defPct', 12),
  星体差分机2: attr('cdmg', 16),
  停转的萨尔索图2: attr('cpct', 8),
  盗贼公国塔利亚2: attr('stance', 16),
  生命的翁瓦克2: attr('recharge', 5)

}
