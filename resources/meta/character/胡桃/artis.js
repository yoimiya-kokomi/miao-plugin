export default function ({ attr, rule, def }) {
  // 核爆胡桃
  if (attr.cpct < 15 && attr.cdmg > 280) {
    return rule('胡桃-核爆', { hp: 90, atk: 50, cd: 100, mastery: 90, dmg: 100 })
  }
  return def({ hp: 80, atk: 50, cp: 100, cd: 100, mastery: 75, dmg: 100 })
}
