export const rule = {
  character: {
    prehash: true,
    reg: "^#(.*)?$",
    priority: 203,
    describe: "【#刻晴】角色详情",
  },
  wife: {
    prehash: true,
    reg: "^#(老婆|妻子|媳妇|娘子|女朋友|女友|女神|老公|丈夫|夫君|郎君|男朋友|男友|男神|女儿|儿子)[ |0-9]*$",
    priority: 203,
    describe: "【#老婆，#老公，#女儿】角色详情",
  },
  /*
  setCharacterImg: {
    prehash: true,
    reg: "^#(添加|更新)(.*)图片(#.*)?(上|右|下|左)?$",
    priority: 208,
  },
*/
  userStat: {
    prehash: true,
    reg: "^#*user\s*\d*",
    priority: 200
  },
  rebuildCookie: {
    prehash: true,
    reg: "#rebuild"
  },
  userStatus: {
    prehash: true,
    reg: "^#cc$",
    priority: 200
  },

  userCacheRebuild: {
    prehash: true,
    reg: "^#dd$",
    priority: 200
  },
  mysUserCk: {
    prehash: true,
    reg: "^#ck[0-9]+$",
    priority: 200
  }

};

import { character, wife } from "./apps/character.js";
import { userStat, rebuildCookie, userStatus, userCacheRebuild, mysUserCk } from "./apps/admin.js";

export { character, userStat, rebuildCookie, wife, userStatus, userCacheRebuild, mysUserCk };
