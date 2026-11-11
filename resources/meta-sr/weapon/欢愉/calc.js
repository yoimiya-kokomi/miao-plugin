export default function (staticIdx, keyIdx) {
  return {
    花花世界迷人眼: [
      staticIdx(1, 'cdmg'),
      (tables) => {
        return {
          title: '无视对方防御力[ignore]%，欢愉度提升[joy]%',
          data: {
            ignore: tables[2] * 4,
            joy: tables[3]
          }
        }
      }
    ],
    当她决定看见: [
      staticIdx(1, 'speedPct'),
      keyIdx('【上上签】增加[cpct]%暴击率,增加[cdmg]%暴击伤害', {
        cpct: 2, cdmg: 3
      })
    ],
    今日好手气: [
      staticIdx(1, 'cpct')
    ],
    菇菇嘎嘎历险记: [
      staticIdx(1, 'joy'),
      keyIdx('敌方全体受到的欢愉伤害提高[xeEnemydmg]%', 'xeEnemydmg', 2)
    ],
    '未来，有我们一起': [
      staticIdx(1, 'cdmg'),
      keyIdx('施放终结技后，使我方全体欢愉度提高[joy]%', 'joy', 2)
    ],
    欢愉满溢祝福: [
      staticIdx(1, 'atkPct')
    ],
    欢迎来到银河城: [
      staticIdx(1, 'speedPct'),
      keyIdx('造成的欢愉伤害无视目标[xeIgnore]%的防御力。装备者对自身单体施放终结技时，获得[punchline]点【笑点】', {
        xeIgnore: 2, punchline: 3
      })
    ],
    邂逅于下一个花季: [
      staticIdx(1, 'cdmg'),
      (tables) => {
        return {
          title: '能量恢复效率提高[recharge]%',
          data: {
            recharge: ({ attr }) => tables[2] + (Math.min(attr.sp, 480) - 120) / 10 * 0.3
          }
        }
      },
      keyIdx('施放欢愉技时，使敌方目标受到的伤害提高[enemydmg]%', 'enemydmg', 3)
    ],
    放个短假: [
      staticIdx(1, 'joyPct'),
      keyIdx('施放欢愉技期间无视目标[xeIgnore]%的防御力', 'xeIgnore', 2)
    ],
    向浪花掷下盛夏: [
      staticIdx(1, 'cpct'),
      keyIdx('装备者的速度提高[speedPct]%，欢愉度提高[joyPct]%', {
        speedPct: 2, joyPct: 3
      })
    ],
    献给明日的色彩: [
      staticIdx(1, 'defPct'),
      keyIdx('敌方全体受到的伤害提高[enemydmg]%', {
        enemydmg: 2
      })
    ],
    '在世界尽头相会吧！': [
      (tables) => ({
        title: '队伍中的欢愉角色使暴击伤害提高[cdmg]%',
        check: ({ weaponTypeName }) => weaponTypeName === '欢愉',
        data: {
          cdmg: ({ params }) => tables[1] * Math.max(1, Math.min(4, Math.trunc(Number(params.elationCount) || 1)))
        }
      }),
      (tables) => ({
        title: '星神★阿哈在场，暴击伤害额外提高[cdmg]%',
        check: ({ characterName, weaponTypeName, params }) => weaponTypeName === '欢愉' && (characterName === '星神★阿哈' || params.ahaInTeam === true),
        data: { cdmg: tables[2] }
      })
    ],
    '当第一声「阿哈」响起': [
      // 基础速度参与所有速度百分比加成，不能记作固定速度或速度百分比。
      staticIdx(1, 'speedBase'),
      (tables) => ({
        title: '对其他我方单体施放战技后，全队伤害无视[ignore]%防御力',
        check: ({ weaponTypeName, params }) => weaponTypeName === '欢愉' && params.ahaLightconeSkillTriggered !== false,
        data: { ignore: tables[4] }
      })
    ]
  }
}
