export default function ({ attr, rule, def }) {
  // 宵宫纯色流派
  if (attr.mastery < 80) {
    return rule('宵宫-纯色', { atk: 75, cp: 100, cd: 100, dmg: 100 })
  }
  if (attr.mastery > 200) {
    return rule('宵宫-精通', { atk: 75, cp: 100, cd: 100, mastery: 100, dmg: 100 })
  }
  return def({ atk: 75, cp: 100, cd: 100, mastery: 75, dmg: 100 })
}
