export default function (staticIdx) {
  return {
    于夜色中: [staticIdx(1, 'cpct'), ({ attr, tables }) => {
      let buffCount = Math.min(6, Math.floor((attr.speed - 100) / 10))
      let dmg = tables[2] * buffCount
      let cdmg = tables[3] * buffCount
      return {
        title: `${buffCount}层Buff提高普攻与战技伤害[aDmg]%，终结技的暴击伤害[qCdmg]%`,
        data: {
          aDmg: dmg,
          eDmg: dmg,
          qCdmg: cdmg
        }
      }
    }],
    唯有沉默: [staticIdx(1, 'atkPct')],
    如泥酣眠: [staticIdx(1, 'cdmg')],
    星海巡航: [staticIdx(1, 'cpct')],
    春水初生: [],
    '点个关注吧！': [],
    相抗: [],
    离弦: [],
    论剑: [],
    重返幽冥: [staticIdx(1, 'cpct')],
    锋镝: []
  }
}