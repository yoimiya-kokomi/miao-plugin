export default function({ attr, rule, def }) {
  if (attr.hp > 5000) {
    return rule("镜流-生命", { hp: 75, atk: 0, def: 0, speed: 100, cpct: 100, cdmg: 100, stance: 0, heal: 0, recharge: 50, effPct: 0, effDef: 0, dmg: 100 })
  }
  return def({ hp: 0, atk: 75, def: 0, speed: 100, cpct: 100, cdmg: 100, stance: 0, heal: 0, recharge: 50, effPct: 0, effDef: 0, dmg: 100 })
}