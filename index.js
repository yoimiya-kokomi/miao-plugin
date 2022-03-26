export const rule = {
  character: {
    reg: "^#(.*)(#.*)?$",
    priority: 208,
    describe: "【#刻晴】角色详情",
  },
  setCharacterImg: {
    reg: "^#(添加|更新)(.*)图片(#.*)?(上|右|下|左)?$",
    priority: 208,
  },

};

import { character, setCharacterImg } from "./apps/character.js";

export { character, setCharacterImg };
