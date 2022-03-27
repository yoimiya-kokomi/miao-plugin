export const rule = {
  character: {
    prehash: true,
    reg: "^#(.*)(#.*)?$",
    priority: 208,
    describe: "【#刻晴】角色详情",
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

import { character, setCharacterImg } from "./apps/character.js";
import { userStat, rebuildCookie } from "./apps/admin.js";

export { character, setCharacterImg, userStat, rebuildCookie };
