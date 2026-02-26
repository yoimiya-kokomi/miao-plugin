export const details = [
  {
    title: 'E「狂飙突进」尾段总伤害',
    params: { skills_1: true, skills_2: true, cons_6: true },
    dmg: ({ attr, talent } , dmg) => {
      let dmg1 = dmg(talent.e['狂飙突进·五段伤害2'][0], 'a', 'coloringDmg')
      let dmg2 = dmg(talent.e['狂飙突进·五段伤害2'][1], 'a')
      return {
        dmg: dmg1.dmg + dmg2.dmg,
        avg: dmg1.avg + dmg2.avg
      }
    }
  },
  {
    title: 'E「四风将起」总伤害',
    params: { skills_1: true, skills_2: true, cons_6: true },
    dmg: ({ attr, talent } , dmg) => {
      let dmg1 = dmg(talent.e['四风将起伤害2'][0], 'e', 'coloringDmg')
      let dmg2 = dmg(talent.e['四风将起伤害2'][1], 'e')
      return {
        dmg: dmg1.dmg + dmg2.dmg,
        avg: dmg1.avg + dmg2.avg
      }
    }
  },
  {
    title: 'E「苍噬」总伤害',
    params: { skills_1: true, skills_2: true, cons_6: true },
    dmg: ({ attr, talent } , dmg) => {
      let dmg1 = dmg(talent.e['苍噬伤害'][0], 'a2', 'coloringDmg')
      let dmg2 = dmg(talent.e['苍噬伤害'][1], 'a2')
      return {
        dmg: dmg1.dmg + dmg2.dmg,
        avg: dmg1.avg + dmg2.avg
      }
    }
  },
  {
    title: 'Q总伤害',
    dmg: ({ attr, talent } , dmg) => {
      let dmg1 = dmg(talent.q['技能第一段伤害'], 'q', 'coloringDmg')
      let dmg2 = dmg(talent.q['技能第二段伤害'], 'q')
      return {
        dmg: dmg1.dmg + dmg2.dmg,
        avg: dmg1.avg + dmg2.avg
      }
    }
  },
  {
    title: '1命「歌中的佳酿」「四风将起」总伤害',
    cons: 1,
    params: { skills_1: true, skills_2: true, cons_1: true, cons_6: true },
    dmg: ({ attr, talent } , dmg) => {
      let dmg1 = dmg(talent.e['四风将起伤害2'][0], 'e', 'coloringDmg')
      let dmg2 = dmg(talent.e['四风将起伤害2'][1], 'e')
      return {
        dmg: dmg1.dmg + dmg2.dmg,
        avg: dmg1.avg + dmg2.avg
      }
    }
  },
  {
    title: '1命「歌中的佳酿」「苍噬」总伤害',
    cons: 1,
    params: { skills_1: true, skills_2: true, cons_1: true, cons_6: true },
    dmg: ({ attr, talent } , dmg) => {
      let dmg1 = dmg(talent.e['苍噬伤害'][0], 'a2', 'coloringDmg')
      let dmg2 = dmg(talent.e['苍噬伤害'][1], 'a2')
      return {
        dmg: dmg1.dmg + dmg2.dmg,
        avg: dmg1.avg + dmg2.avg
      }
    }
  },
  {
    title: '2命额外伤害',
    cons: 2,
    dmg: ({ attr, talent } , dmg) => dmg(800)
  }
]

export const defParams = { Hexenzirkel: true } // 魔女会成员
export const defDmgIdx = 0
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [
  {
    check: ({ params }) => params.skills_1 === true,
    title: '法尔伽天赋：队伍中同时存在至少2名风元素角色与至少2名元素类型相同的火/水/雷/冰元素角色，则会使狂飙突进模式下进行的普通攻击、重击、苍噬、四风将起将造成原本[multi]%的伤害',
    data: {
      multi: 120
    }
  },
  {
    check: ({ params }) => params.skills_2 === true,
    title: '法尔伽天赋：队伍中附近的角色触发扩散反应时，法尔伽的普通攻击、重击、特殊重击苍噬与施放的特殊元素战技四风将起造成的伤害最多提升[dmg]%',
    data: {
      dmg: 7.5 * 4,
    }
  },
  {
    title: '法尔伽天赋：队伍中存在火/水/雷/冰元素角色时，每1000点攻击力都将使法尔伽获得10%风元素伤害加成与对应元素伤害加成。当前共获得[dmg]%元素伤害加成。',
    sort: 9,
    data: {
      dmg: ({ attr, calc }) => Math.min(calc(attr.atk) / 1000 * 10, 25),
      coloringDmg: ({ attr, calc }) => Math.min(calc(attr.atk) / 1000 * 10, 25),
    }
  },
  {
    check: ({ params }) => params.cons_1 === true,
    title: '法尔伽1命：切换至狂飙突进模式并消耗「歌中的佳酿」效果后，四风将起或苍噬造成原本[multi]%的伤害',
    cons: 1,
    data: {
      multi: 200
    }
  },
  {
    title: '法尔伽4命：法尔伽触发扩散反应时，使队伍中附近的所有角色分别获得[dmg]%风元素伤害加成与对应元素伤害加成',
    cons: 4,
    data: {
      dmg: 20,
      coloringDmg: 20
    }
  },
  {
    check: ({ params }) => params.cons_6 === true,
    title: '法尔伽6命：突破天赋获得强化——满层「苍牙之誓」还会使法尔伽的暴击伤害提升[cdmg]%',
    cons: 6,
    data: {
      cdmg: 20 * 4
    }
  }
]

export const createdBy = '冰翼'
