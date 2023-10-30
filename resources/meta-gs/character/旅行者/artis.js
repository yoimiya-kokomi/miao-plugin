export default function ({ elem, attr, weapon, rule, def }) {
  switch (elem) {
    case 'anemo':
      return rule('风主', { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 75, dmg: 100, phy: 0, recharge: 55, heal: 0 })
    case 'geo':
      return rule('岩主', { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 0, dmg: 100, phy: 0, recharge: 55, heal: 0 })
    case 'electro':
      return rule('雷主', { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 75, dmg: 100, phy: 0, recharge: 75, heal: 0 })
    case 'dendro':
      return rule('草主', { hp: 0, atk: 75, def: 0, cpct: 100, cdmg: 100, mastery: 75, dmg: 100, phy: 0, recharge: 55, heal: 0 })
    case 'hydro':
      return rule('水主', { hp: 75, atk: 75, cpct: 100, cdmg: 100, mastery: 75, dmg: 100, recharge: 55 })
  }
}
