export const details = [{
  title: '重击伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['满蓄力瞄准射击'], 'a2')
}, {
  title: '兔兔伯爵爆炸',
  dmg: ({ talent }, dmg) => dmg(talent.e['爆炸伤害'], 'e')
}, {
  title: '兔兔伯爵蒸发',
  check: ({ cons }) => cons < 2,
  dmg: ({ talent }, dmg) => dmg(talent.e['爆炸伤害'], 'e', 'zf')
}, {
  title: '引爆兔兔伯爵蒸发',
  cons: 2,
  dmg: ({ talent }, dmg) => dmg(talent.e['爆炸伤害'] * 3, 'e', 'zf')
}, {
  title: 'Q箭雨总伤害',
  params: { q: true },
  dmg: ({ talent }, dmg) => dmg(talent.q['箭雨总伤害'], 'q')
}]

export const mainAttr = 'atk,cpct,cdmg,mastery'

export const buffs = [{
  title: '安柏天赋：命中弱点后攻击力提升15%',
  data: {
    atkPct: 15
  }
}, {
  title: '安柏被动：Q暴击率提高10%',
  data: {
    qCpct: 10
  }
}, {
  title: '安柏2命：瞄准引爆兔兔伯爵伤害提高200%',
  cons: 2
}, 'zf']
