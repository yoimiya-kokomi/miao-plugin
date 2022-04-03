import { character, wife, wifeReg } from "./apps/character.js";
import { wiki } from "./apps/wiki.js";

export { character, wife, wiki };


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
  wiki: {
    reg: "^#*.*(天赋|技能|命座|命之座|详情)$",
    priority: 300
  }
};

