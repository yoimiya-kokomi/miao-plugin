import { character, getProfile, wife, wifeReg, enemyLv } from "./apps/character.js";
import { consStat, abyssPct } from "./apps/stat.js";
import { wiki } from "./apps/wiki.js";
import { help } from "./apps/help.js";
import lodash from "lodash";

import { rule as adminRule, updateRes, sysCfg } from "./apps/admin.js";

export { character, wife, consStat, abyssPct, wiki, updateRes, sysCfg, help, getProfile, enemyLv };


let rule = {
  character: {
    reg: "^#(喵喵)?(.*)(详情|详细|面板|面版)?$",
    describe: "【#角色】角色详情",
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
  wiki: {
    reg: "^(#|喵喵)?.*(天赋|技能|命座|命之座|资料|照片|写真|图片|插画)$",
    describe: "【#资料】 #神里天赋 #夜兰命座",
  },
  help: {
    reg: "^#?(喵喵)?(命令|帮助|菜单|help|说明|功能|指令|使用说明)$",
    describe: "【#帮助】 #喵喵帮助",
  },
  getProfile: {
    reg: "^#\s*(获取|更新)(游戏|角色)*(详情|详细|面板|面版)\s*$",
    describe: "【#角色】 获取游戏橱窗详情数据",
  },
  enemyLv: {
    reg: "^#\s*敌人等级\s*\d{1,3}\s*$",
    describe: "【#角色】 设置伤害计算中目标敌人的等级",
  },
  ...adminRule
};

lodash.forEach(rule, (r) => {
  r.priority = r.priority || 50;
  r.prehash = true;
  r.hashMark = true;
});

export { rule };

console.log("喵喵插件初始化~");