export default function ({ attr,artis, rule, def }) {
  if (artis.is('冰套4')) {
    return rule('永冻甘雨', { atk: 75, cp: 100, cd: 100, dmg: 100, recharge: 0 })
  }
  if (attr.cpct < 20) {
    return rule('甘雨-核爆', { atk: 75, cp: 0, cd: 100, mastery: 75, dmg: 100, recharge: 0 })
  }
  return def({ atk: 75, cp: 100, cd: 100, mastery: 75, dmg: 100 })
}
