import { character, wife, wifeReg } from "./apps/character.js";
import { consStat, abyssPct } from "./apps/stat.js";
//import { wiki } from "./apps/wiki.js";

export { character, wife, consStat, abyssPct };


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
  consStat: {
    hrehash: true,
    reg: "^#角色(持有|持有率|命座|命之座|.命)(分布|统计)?$",
    priority: 200
  },
  abyssPct: {
    prehash: true,
    reg: "^#深渊(第?.{1,2}层)?(角色)?出场(率|统计)*$",
    priority: 200
  }
  /*
  wiki: {
    reg: "^#*.*(缓存)$",
    priority: 300
  }*/
};

