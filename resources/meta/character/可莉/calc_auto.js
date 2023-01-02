export const details = [{
    title: 'E后带火花重击',
    params: { q: false, team: false },
    dmg: ({ talent }, dmg) => dmg(talent.a['重击伤害'], 'a2')
  }, {
    title: 'E后带火花重击蒸发',
    params: { q: false, team: false },
    dmg: ({ talent }, dmg) => dmg(talent.a['重击伤害'], 'a2', 'vaporize')
  }, {
    title: '单次轰轰火花伤害',
    params: { team: false },
    dmg: ({ talent }, dmg) => dmg(talent.q['轰轰火花伤害'], 'q')
  }, {
    title: '可莉三火E后火花重击',
    params: { q: false, team: true },
    dmg: ({ talent }, dmg) => dmg(talent.a['重击伤害'], 'a2')
  }, {
    title: '可莉三火轰轰火花伤害',
    params: { team: true },
    dmg: ({ talent }, dmg) => dmg(talent.q['轰轰火花伤害'], 'q')
  }
  ]
  
  export const defDmgIdx = 1
  export const mainAttr = 'atk,cpct,cdmg,mastery'
  
  export const defParams = {
    team: true
  }
  
  export const buffs = [{
    title: '可莉天赋：爆裂火花使重击伤害提升50%',
    data: {
      a2Dmg: 50
    }
  }, {
    title: '可莉2命：蹦蹦炸弹的诡雷会使敌人的防御力降低23%',
    cons: 2,
    data: {
      enemyDef: 23
    }
  }, {
    title: '可莉6命：释放轰轰火花后获得10%火元素伤害加成',
    cons: 6,
    data: {
      dmg: ({ params }) => params.q === false ? 0 : 10
    }
  }, {
    check: ({ params }) => params.team === true,
    title: '风鹰宗室班：增加[atkPlus]点攻击力与[atkPct]%攻击力',
    sort: 9,
    data: {
      atkPct: 20,
      atkPlus: 1202.35
    }
  }, {
    check: ({ params }) => params.team === true,
    title: '香菱6命：增加[dmg]%火伤',
    sort: 9,
    data: {
      dmg: 15
    }
  }, {
    check: ({ cons, params }) => cons <= 1 && params.team === true,
    title: '精1苍古0命万叶：获得[dmg]%增伤(苍古普攻16增伤)，增加[atkPct]%攻击,减抗[kx]%',
    sort: 9,
    data: {
      aDmg: 16,
      a2Dmg: 16,
      a3Dmg: 16,
      dmg: 40,
      atkPct: 20,
      kx: 40
    }
  }, {
    check: ({ cons, params }) => ((cons < 6 && cons > 1) && params.team === true),
    title: '精1苍古2命万叶：获得[dmg]%增伤(苍古普攻16增伤)，增加[atkPct]%攻击,减抗[kx]%,精通[mastery]',
    sort: 9,
    data: {
      aDmg: 16,
      a2Dmg: 16,
      a3Dmg: 16,
      dmg: 48,
      atkPct: 20,
      kx: 40,
      mastery: 200
    }
  }, {
    check: ({ cons, params }) => (cons >= 6 && params.team === true),
    title: '精5苍古6命万叶：获得[dmg]%增伤(苍古普攻32增伤)，增加[atkPct]%攻击,减抗[kx]%,精通[mastery]',
    sort: 9,
    data: {
      aDmg: 32,
      a2Dmg: 32,
      a3Dmg: 32,
      dmg: 48,
      atkPct: 40,
      kx: 40,
      mastery: 200
    }
  }, 'vaporize']
  