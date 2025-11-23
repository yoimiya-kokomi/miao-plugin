export const details = [{
  title: '【魔导·秘仪】「嘭嘭轰击」伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['重击伤害'], 'a2')
}, {
  title: '【魔导·秘仪】「嘭嘭轰击」蒸发伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['重击伤害'], 'a2', 'vaporize')
}, {
  title: '单次轰轰火花伤害',
  params: { cons_6: true },
  dmg: ({ talent }, dmg) => dmg(talent.q['轰轰火花伤害'], 'q')
}, {
  title: '4命Q后额外爆炸伤害',
  params: { cons_4: true, cons_6: true },
  cons: 4,
  dmg: ({}, dmg) => dmg(555)
}, {
  title: '【魔导·秘仪】6命Q后「嘭嘭轰击」伤害',
  params: { cons_6: true },
  dmg: ({ talent }, dmg) => dmg(talent.a['重击伤害'], 'a2')
}, {
  title: '【魔导·秘仪】6命Q后「嘭嘭轰击」蒸发伤害',
  params: { cons_6: true },
  dmg: ({ talent }, dmg) => dmg(talent.a['重击伤害'], 'a2', 'vaporize')
}]

export const defParams = { Hexenzirkel: true } // 魔女会成员
export const defDmgIdx = 1
export const mainAttr = 'atk,cpct,cdmg,mastery'

export const buffs = [{
  title: '可莉天赋：特殊重击「嘭嘭轰击」对比重击伤害提升50%',
  data: {
    a2Dmg: 50
  }
}, {
  title: '可莉天赋：获得【魔导·秘仪】效果时，3枚「轰轰勋章」使特殊重击「嘭嘭轰击」造成原本150%的伤害。',
  data: {
    a2Multi: 50
  }
}, {
  title: '可莉1命：攻击与施放技能时，有几率召唤火花。触发该效果后的12秒内，可莉的攻击力提升60%',
  cons: 1,
  data: {
    atkPct: 60
  }
}, {
  title: '可莉2命：蹦蹦炸弹的诡雷会使敌人的防御力降低23%',
  cons: 2,
  data: {
    enemyDef: 23
  }
}, {
  check: ({ params }) => params.cons_4 === true,
  title: '可莉4命：触发额外爆炸时，如果可莉在场上，则造成的伤害提升100%',
  cons: 4,
  data: {
    dmg: 100
  }
}, {
  check: ({ params }) => params.cons_6 === true,
  title: '可莉6命：施放轰轰火花后获得50%火元素伤害加成',
  cons: 6,
  data: {
    dmg: 50
  }
}, 'vaporize']

export const createdBy = '喵喵 & 冰翼'
