export const details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '战技伤害·主目标',
  dmg: ({ talent }, dmg) => dmg(talent.e['目标伤害'], 'e')
}, {
  title: '战技伤害·相邻目标',
  dmg: ({ talent }, dmg) => dmg(talent.e['相邻目标伤害'], 'e')
}, {
  title: '终结技伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}, {
  title: '天赋持续伤害',
  dmg: ({ talent }, dmg) => dmg(talent.t['持续伤害'], 't')
}]

export const defDmgIdx = 4
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '椒丘终结技：敌方目标受到的终结技伤害提高[qEnemydmg]%',
  data: {
    qEnemydmg: ({ talent }) => talent.q['终结技伤害提高'] * 100
  }
}, {
  title: '椒丘天赋：满层【烬煨】使敌人受到的伤害提高[enemydmg]%',
  data: {
    enemydmg: ({ talent, cons }) => {
      let num = cons < 6 ? 4 : 8
      return (talent.t['1层伤害提高'] + talent.t['叠加伤害提高'] * num) * 100
    }
  }
}, {
  title: '椒丘额外能力：椒丘效果命中大于80%时，每超过15%，则额外提高60%攻击力，最高不超过240%。当前额外提高[atkPct]%攻击力。',
  tree: 2,
  data: {
    atkPct: ({ calc, attr }) => {
      let num = Math.min(Math.floor((calc(attr.effPct) - 80) / 15), 4)
      if (num > 0) {
        return num * 60
      } else {
        return 0
      }
    }
  }
}, {
  title: '椒丘1命：我方目标对处于【烬煨】状态的敌方目标造成的伤害提高[dmg]%',
  cons: 1,
  data: {
    dmg: 40
  }
}, {
  title: '椒丘2命：敌方目标处于【烬煨】状态时，【烬煨】对其造成的火属性持续伤害倍率提高[tPct]%',
  cons: 2,
  data: {
    tPct: 300
  }
}, {
  title: '椒丘6命：满层【烬煨】会使目标的全属性抗性降低[kx]%',
  cons: 6,
  data: {
    kx : 9 * 3
  }
}]

export const createdBy = '冰翼'
