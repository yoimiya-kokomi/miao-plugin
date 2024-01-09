export const details = [{
  title: 'E点按伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['点按伤害'], 'e')
}, {
  title: 'E长按伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['长按伤害'], 'e')
}, {
  title: '「超量装药弹头」伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['「超量装药弹头」伤害'], 'e')
}, {
  title: '2命额外伤害',
  check: ({ cons }) => cons >= 2,
  dmg: ({ calc, attr }, { basic }) => basic(calc(attr.atk) * 120 / 100, 'e')
}, {
  title: 'E持续治疗',
  dmg: ({ attr, calc, talent }, { heal }) => heal(talent.e['持续治疗量2'][0] * calc(attr.hp) / 100 + talent.e['持续治疗量2'][1] * 1)
}, {
  title: 'Q释放伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['爆轰榴弹伤害'], 'q')
}, {
  title: 'Q分裂弹伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['二重毁伤弹伤害'], 'q')
}, {
  title: '6命额外治疗',
  check: ({ cons }) => cons >= 6,
  dmg: ({ attr, calc }, { heal }) => heal(calc(attr.hp) * 10 / 100)
}]

export const defDmgIdx = 4
export const mainAttr = 'atk,hp,cpct,cdmg,heal'

export const buffs = [{
  title: '夏沃蕾天赋：火元素与雷元素抗性降低[kx]%',
  data: {
    kx: 40
  }
}, {
  title: '夏沃蕾天赋：发射「超量装药弹头」后攻击力提升[atkPct]%',
  data: {
    atkPct: ({ calc, attr }) => Math.min(40, calc(attr.hp) / 1000)
  }
}, {
  title: '夏沃蕾6命：队伍中的角色受到「近迫式急促拦射」的治疗后，获得[dmg]%火元素伤害加成与雷元素伤害加成',
  cons: 6,
  data: {
    dmg: 60
  }
}]

export const createdBy = 'liangshi'
