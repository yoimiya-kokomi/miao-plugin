export const rule = {
  character: {
    prehash: true,
    reg: "^#(.*)(#.*)?$",
    priority: 208,
    describe: "【#刻晴】角色详情",
  },
  wife: {
    reg: "^#(老婆|妻子|媳妇|娘子|女朋友|女友|女神|老公|丈夫|夫君|郎君|男朋友|男友|男神|女儿|儿子)(1|2)*$",
    priority: 206,
    describe: "【#老婆，#老公，#女儿】角色详情",
  },
  setCharacterImg: {
    prehash: true,
    reg: "^#(添加|更新)(.*)图片(#.*)?(上|右|下|左)?$",
    priority: 208,
  },

  userStat: {
    prehash: true,
    reg: "^#*user\s*\d*",
    priority: 200
  },
  rebuildCookie: {
    prehash: true,
    reg: "#rebuild"
  }

};

import { character, setCharacterImg, wife } from "./apps/character.js";
import { userStat, rebuildCookie } from "./apps/admin.js";

export { character, setCharacterImg, userStat, rebuildCookie, wife };
