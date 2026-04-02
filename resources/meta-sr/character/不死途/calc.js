export const details = [{
  title: '普攻伤害',
  dmgKey: 'a',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '战技伤害',
  dmgKey: 'e',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: '战技对【饲饵】目标造成的伤害',
  dmgKey: 'e',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'] + talent.e['额外伤害'], 'e')
}, {
  title: '终结技伤害',
  dmgKey: 'q',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}, {
  title: '终结技之后强化天赋追加攻击满【婪酣】伤害',
  dmg: ({ talent, cons }, dmg) => {
    const gluttony = cons >= 2 ? 18 : 12
    const times = Math.floor(gluttony / 4)
    return dmg(talent.t['追加攻击伤害'] + talent.q['额外伤害'] * times, 't')
  }
}, {
  title: '天赋追加伤害',
  dmg: ({ talent }, dmg) => dmg(talent.t['追加攻击伤害'], 't')
}]

export const defDmgIdx = 4
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '影肢：不死途追加攻击造成的伤害额外提高[tCdmg]%。',
  tree: 2,
  data: {
    tCdmg: ({ cons }) => {
      const gluttony = cons >= 2 ? 18 : 12
      return 80 + 10 * gluttony
    }
  }
}, {
  title: '头狼：不死途在场时，我方目标造成的暴击伤害提高[cdmgPct]%，我方目标追加攻击造成的暴击伤害额外提高[tcdmgPct]%',
  tree: 3,
  data: {
    cdmgPct: 48,
    tCdmg: 80
  }
}, {
  title: '不死徒1魂：小于等于50%的敌方目标受到的伤害提高[enemydmgPct]%',
  cons: 1,
  data: {
    enemydmgPct: 36
 }
}, {
  title: '不死徒4魂：不死徒释放终结技时，攻击力提高[atkPct]%',
  cons: 4,
  data: {
    atkPct: 40
 }
}, {
  title: '不死徒6魂：敌方全体全属性抗性降低[kx]%，伤害至多提高[dmg]%',
  cons: 6,
  data: {
    kx: 20,
    dmg: 120
 }
}]

export const createdBy = '春哥'
