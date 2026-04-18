export const details = [{
  title: '「狩灾誓锤」提升队友伤害',
  dmg: ({ calc, attr }) => {
    return {
      avg: Math.round(Math.min((calc(attr.atk) - 1000) * 0.01, 35) * 100) / 100 + "%",
      type: 'text'
    }
  }
}, {
  title: 'E一段伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能一段伤害'], 'e')
}, {
  title: 'E二段伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能二段伤害'], 'e')
}, {
  title: 'Q释放伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}, {
  title: 'Q协同伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['诱巫饵铃伤害'], 'q')
}]

export const defDmgIdx = 0
export const mainAttr = 'atk,cpct,cdmg,mastery,dmg'
export const defParams = { Hexenzirkel: true }

export const buffs = [{
  title: '布伦妮天赋：队伍中魔导角色触发扩散反应，攻击力提升[atkPct]%',
  data: {
    atkPct: 65
  }
}, {
  title: '布伦妮2命：「诱巫饵铃」和经过元素转化的「狩灾誓锤」命中敌人时，攻击力提升[atkPct]%',
  cons: 2,
  data: {
    atkPct: 40
  }
}, {
  title: '布伦妮6命：处于「振铃鼓舞」下触发任意元素反应,攻击力提升[atkPlus]',
  cons: 6,
  data: {
    atkPlus: 350
  }
}]

