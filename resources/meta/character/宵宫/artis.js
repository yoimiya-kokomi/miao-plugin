export default function ({ attr, artis, rule, def }) {
  // 宵宫纯色流派
  if (attr.mastery < 50 && attr.cp * 2 + attr.cd > 320) {
    return rule('宵宫-纯火', { atk: 85, cp: 100, cd: 100, dmg: 100 })
  }
  if (attr.mastery > 200 && artis.is('mastery', 3)) {
    return rule('宵宫-精通', { atk: 75, cp: 100, cd: 100, mastery: 100, dmg: 100 })
  }
  return def({ atk: 75, cp: 100, cd: 100, mastery: 75, dmg: 100 })
}
