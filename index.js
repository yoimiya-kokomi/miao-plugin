import {
  character,
  getProfile,
  wife,
  wifeReg,
  enemyLv,
  getArtis,
  getProfileAll,
  profileHelp
} from "./apps/character.js";
import { consStat, abyssPct, abyssTeam } from "./apps/stat.js";
import { wiki, calendar } from "./apps/wiki.js";
import { help, versionInfo } from "./apps/help.js";
import lodash from "lodash";
import common from "../../lib/common.js";
import { rule as adminRule, updateRes, sysCfg, updateMiaoPlugin } from "./apps/admin.js";
import { currentVersion, changelogs } from "./components/Changelog.js";

export {
  character,
  wife,
  consStat,
  abyssPct,
  abyssTeam,
  wiki,
  updateRes,
  updateMiaoPlugin,
  sysCfg,
  help,
  versionInfo,
  getProfile,
  enemyLv,
  getArtis,
  getProfileAll,
  profileHelp,
  calendar
};


let rule = {
  character: {
    reg: "^#(喵喵)?(更新)?(.*)(详情|详细|面板|面版|伤害[1-7]?)?(更新)?$",
    //reg: "noCheck",
    describe: "【#角色】角色详情",
  },
  getArtis: {
    reg: "^#圣遗物列表$",
    describe: "【#角色】圣遗物列表",
  },
  getProfileAll: {
    reg: "^#(面板角色|角色面板)列表$",
    describe: "【#角色】查看当前已获取面板数据的角色列表",
  },
  profileHelp: {
    reg: "^#角色面板帮助$",
    describe: "【#角色】查看当前已获取面板数据的角色列表",
  },
  wife: {
    reg: wifeReg,
    describe: "【#角色】#老公 #老婆 查询",
  },
  consStat: {
    reg: "^#(喵喵)?角色(持有|持有率|命座|命之座|.命)(分布|统计)?$",
    describe: "【#统计】 #角色持有率 #角色5命统计",
  },
  abyssPct: {
    reg: "^#(喵喵)?深渊(第?.{1,2}层)?(角色)?出场(率|统计)*$",
    describe: "【#统计】 #深渊出场率 #深渊12层出场率",
  },
  abyssTeam: {
    reg: "#深渊(组队|配队)",
    describe: "【#角色】 #深渊组队",
  },
  wiki: {
    reg: "^(#|喵喵)?.*(天赋|技能|命座|命之座|资料|照片|写真|图片|插画)$",
    describe: "【#资料】 #神里天赋 #夜兰命座",
  },
  help: {
    reg: "^#?(喵喵)?(命令|帮助|菜单|help|说明|功能|指令|使用说明)$",
    describe: "【#帮助】 #喵喵帮助",
  },
  getProfile: {
    reg: "^#(全部面板更新|更新全部面板|获取游戏角色详情)$",
    describe: "【#角色】 获取游戏橱窗详情数据",
  },
  enemyLv: {
    reg: "^#(敌人|怪物)等级\\s*\\d{1,3}\\s*$",
    describe: "【#角色】 设置伤害计算中目标敌人的等级",
  },
  versionInfo: {
    reg: "^#喵喵版本$",
    describe: "【#帮助】 喵喵版本介绍",
  },
  calendar: {
    reg: "^#喵喵日历$",
    describe: "【#日历】 活动日历",
  },
  ...adminRule
};

lodash.forEach(rule, (r) => {
  r.priority = r.priority || 50;
  r.prehash = true;
  r.hashMark = true;
});

export { rule };

console.log(`喵喵插件${currentVersion}初始化~`);

setTimeout(async function () {
  let msgStr = await redis.get("miao:restart-msg");
  if (msgStr) {
    let msg = JSON.parse(msgStr);
    await common.relpyPrivate(msg.qq, msg.msg);
    await redis.del("miao:restart-msg");
    let msgs = [`当前喵喵版本: ${currentVersion}`, ...changelogs];
    await common.relpyPrivate(msg.qq, msgs.join("\n"));
  }
}, 1000);