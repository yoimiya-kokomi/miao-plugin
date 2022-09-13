export default function ({ attr, weapon, rule, def }) {
  // 蒸发可莉，具体数值待定
  if (attr.mastery < 80) {
    return rule('可莉-纯火', { hp: 0, atk: 75, def: 0, cp: 100, cd: 100, mastery: 0, dmg: 100, phy: 0, recharge: 0, heal: 0 })
  }
  return def({ hp: 0, atk: 75, def: 0, cp: 100, cd: 100, mastery: 75, dmg: 100, phy: 0, recharge: 0, heal: 0 })
}