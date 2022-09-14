export default function ({ attr, rule, def }) {
  // 核爆胡桃，具体数值待定
  if (attr.cpct < 30 && attr.cdmg > 200) {
    return rule('胡桃-核爆', { hp: 85, atk: 50, cd: 100, mastery: 85, dmg: 100 })
  }
  return def({ hp: 80, atk: 50, cp: 100, cd: 100, mastery: 75, dmg: 100 })
}
