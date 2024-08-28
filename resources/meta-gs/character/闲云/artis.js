export default function ({ cons, rule, def }) {
    if (cons === 6) {
      return rule('闲云-满命', { hp: 0, atk: 100, def: 0, cpct: 100, cdmg: 100, mastery: 0, dmg: 100, phy: 0, recharge: 35, heal: 95 })
    }
    return def({ hp: 0, atk: 100, def: 0, cpct: 50, cdmg: 50, mastery: 0, dmg: 80, phy: 0, recharge: 75, heal: 95 })
  }