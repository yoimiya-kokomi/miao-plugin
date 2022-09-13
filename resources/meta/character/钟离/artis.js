export default function ({ attr, artis, rule, def }) {
  if (artis.is('hp', '4,5')) {
    if (artis.is('绝缘4') && artis.is('hp,recharge', 3)) {
      return rule('绝缘血牛钟离', { hp: 100, atk: 50, cp: 50, cd: 50, recharge: 100 })
    } else if (artis.is('hp', 3)) {
      return rule('血牛钟离', { hp: 100, atk: 50, cp: 50, cd: 50, recharge: 50 })
    }
  }
  return def({ hp: 80, atk: 75, cp: 100, cd: 100, dmg: 100, phy: 50, recharge: 55 })
}
