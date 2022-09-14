export default function ({ artis, rule, def }) {
  if (artis.is('冰套4')) {
    return rule('甘雨-永冻', { atk: 75, cp: 100, cd: 100, dmg: 100, recharge: 75 })
  }
  return def({ atk: 75, cp: 100, cd: 100, mastery: 75, dmg: 100 })
}
