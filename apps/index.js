import { wifeReg } from './character.js'

import { consStat, abyssPct, abyssTeam, uploadData } from './stat.js'
import { wiki, calendar } from './wiki.js'
import { help, versionInfo } from './help.js'
import lodash from 'lodash'
import { rule as adminRule, updateRes, sysCfg, updateMiaoPlugin, profileCfg } from './admin.js'

export {
  character,
  getProfile,
  wife,
  pokeWife,
  enemyLv,
  profileArtisList,
  getProfileAll,
  profileHelp,
  getOriginalPicture,
  uploadCharacterImg,
  profileList,
  profileStat
} from './character.js'

export {
  consStat,
  abyssPct,
  abyssTeam,
  wiki,
  updateRes,
  updateMiaoPlugin,
  sysCfg,
  help,
  versionInfo,
  calendar,
  profileCfg,
  uploadData
}

let rule = {
  character: {
    reg: '^(#(.*)|#*(更新|录入)?(.*)(详细|详情|面板|面版|伤害[1-7]?)(更新)?)$',
    // reg: "noCheck",
    describe: '【#角色】角色详情'
  },
  uploadCharacterImg: {
    reg: '^#*(喵喵)?(上传|添加)(.+)(照片|写真|图片|图像)\\s*$',
    describe: '喵喵上传角色写真'
  },
  profileArtisList: {
    reg: '^#圣遗物列表\\s*(\\d{9})?$',
    describe: '【#角色】圣遗物列表'
  },
  profileList: {
    reg: '^#(面板角色|角色面板|面板)(列表)?\\s*(\\d{9})?$',
    describe: '【#角色】查看当前已获取面板数据的角色列表'
  },
  profileStat: {
    reg: '^#面板练度统计$',
    describe: '【#角色】查看当前面板练度统计$'
  },
  profileHelp: {
    reg: '^#角色面板帮助$',
    describe: '【#角色】查看当前已获取面板数据的角色列表'
  },
  wife: {
    reg: wifeReg,
    describe: '【#角色】#老公 #老婆 查询'
  },
  pokeWife: {
    reg: '#poke#',
    describe: '【#角色】戳一戳'
  },
  getOriginalPicture: {
    reg: '^#?(获取|给我|我要|求|发|发下|发个|发一下)?原图(吧|呗)?$',
    describe: '【#原图】 回复角色卡片，可获取原图'
  },
  consStat: {
    reg: '^#(喵喵)?角色(持有|持有率|命座|命之座|.命)(分布|统计|持有|持有率)?$',
    describe: '【#统计】 #角色持有率 #角色5命统计'
  },
  abyssPct: {
    reg: '^#(喵喵)?深渊(第?.{1,2}层)?(角色)?(出场|使用)(率|统计)*$',
    describe: '【#统计】 #深渊出场率 #深渊12层出场率'
  },
  abyssTeam: {
    reg: '#深渊(组队|配队)',
    describe: '【#角色】 #深渊组队'
  },
  wiki: {
    reg: '^(#|喵喵)?.*(天赋|技能|命座|命之座|资料|照片|写真|图片|图像)$',
    describe: '【#资料】 #神里天赋 #夜兰命座'
  },
  help: {
    reg: '^#?(喵喵)?(命令|帮助|菜单|help|说明|功能|指令|使用说明)$',
    describe: '【#帮助】 #喵喵帮助'
  },
  getProfile: {
    reg: '^#(全部面板更新|更新全部面板|获取游戏角色详情|更新面板|面板更新)\\s*(\\d{9})?$',
    describe: '【#角色】 获取游戏橱窗详情数据'
  },
  enemyLv: {
    reg: '^#(敌人|怪物)等级\\s*\\d{1,3}\\s*$',
    describe: '【#角色】 设置伤害计算中目标敌人的等级'
  },
  versionInfo: {
    reg: '^#?喵喵版本$',
    describe: '【#帮助】 喵喵版本介绍'
  },
  calendar: {
    reg: '^(#|喵喵)+(日历|日历列表)$',
    describe: '【#日历】 活动日历'
  },
  uploadData: {
    reg: '^#*(喵喵|上传|本期)*(深渊|深境|深境螺旋)[ |0-9]*(数据)?$'
  },
  ...adminRule
}

lodash.forEach(rule, (r) => {
  r.priority = r.priority || 50
  r.prehash = true
  r.hashMark = true
})

export { rule }
