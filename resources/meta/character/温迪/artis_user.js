export default function ({ attr, weapon, rule, def }) {

  if (attr.recharge > 240) {
    return rule('温迪-工具人', { atk: 75, cp:100, cd: 100, mastery: 75, dmg: 100, recharge: 100 })
  }
  return def({ hp: 0, atk: 75, def: 0, cp: 100, cd: 100, mastery: 75, dmg: 100, phy: 0, recharge: 75, heal: 0 })
}