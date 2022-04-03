import { character, wife, wifeReg } from "./apps/character.js";
import { userStat,  userStatus, userCacheRebuild, mysUserCk } from "./apps/admin.js";

export { character, userStat,  wife, userStatus, userCacheRebuild, mysUserCk };


export const rule = {
  character: {
    prehash: true,
    reg: "^#(.*)?$",
    priority: 203,
    describe: "【#刻晴】角色详情",
  },
  wife: {
    prehash: true,
    reg: wifeReg,
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

