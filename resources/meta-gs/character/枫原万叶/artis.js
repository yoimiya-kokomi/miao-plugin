export default function ({ cons, rule, def }) {
    if (cons === 6) {
      return rule('万叶-满命', { atk: 75, cpct: 100, cdmg: 100, mastery: 30, dmg: 100, recharge: 55 })
    }
    return def({ hp: 0, atk: 75, def: 0, cpct: 50, cdmg: 50, mastery: 100, dmg: 100, phy: 0, recharge: 55, heal: 0 })
  }