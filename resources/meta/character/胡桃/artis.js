export default function ({ attr, rule, def }) {
  // 核爆胡桃
  if (attr.cpct < 15 && attr.cdmg > 280) {
    return rule('胡桃-核爆', { hp: 90, atk: 50, cdmg: 100, mastery: 90, dmg: 100 })
  }
  return def({ hp: 80, atk: 50, cpct: 100, cdmg: 100, mastery: 75, dmg: 100 })
}
