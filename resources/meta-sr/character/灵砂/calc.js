export const details = [{
  title: '识烟飞彩伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
},{
  title: '识烟飞彩治疗量',
  dmg: ({ calc, attr, talent }, { heal }) => heal(calc(attr.atk) * talent.e['回复·百分比生命'] + talent.e['回复·固定值'] * 1)
},{
  title: '幔亭缭霞伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
},{
  title: '幔亭缭霞治疗量',
  dmg: ({ calc, attr, talent }, { heal }) => heal(calc(attr.atk) * talent.q['回复·百分比生命'] + talent.q['回复·固定值'] * 1)
},{
  title: '烟斜雾横，氛氲化生伤害',
  dmg: ({ talent }, dmg) => dmg(talent.t['全体伤害'], 't')
},{
  title: '烟斜雾横，氛氲化生治疗量',
  dmgKey: 'tz',
  dmg: ({ calc, attr, talent }, { heal }) => heal(calc(attr.atk) * talent.t['回复·百分比生命'] + talent.t['回复·固定值'] * 1)
}]

export const defDmgKey = 'tz'
export const mainAttr = 'atk,cpct,cdmg,heal'

export const buffs = [{
  title: '朱燎：攻击力提升[atkPct]%,治疗量提高[heal]%',
  data: {
    atkPct: ({ calc, attr }) => Math.min(50, calc(attr.stance) * 0.25),
    heal: ({ calc, attr }) => Math.min(20, calc(attr.stance) * 0.1)
  }
},{
  title: '1魂：当有敌方单位的弱点被击破时，使其防御力降低20%。',
  cons: 1,
  data: {
    enemyDef: 20
 }
},{
  title: '2魂：我方全体击破特攻提高40%',
  cons: 2,
  data: {
    stance: 40
 }
},{
  title: '6魂：敌方全体全属性抗性降低20%',
  cons: 6,
  data: {
    kx: 20
 }
}]

export const createdBy = '羊咩别闹！'