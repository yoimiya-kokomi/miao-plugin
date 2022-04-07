import { character, wife, wifeReg } from "./apps/character.js";
import { consStat, abyssPct } from "./apps/stat.js";
import { wiki } from "./apps/wiki.js";
import lodash from "lodash";

export { character, wife, consStat, abyssPct, wiki };


let rule = {
  character: {
    reg: "^#(.*)?$",
    describe: "【#刻晴】角色详情",
  },
  wife: {
    reg: wifeReg,
    describe: "【#老婆，#老公，#女儿】角色详情",
  },
  consStat: {
    reg: "^#角色(持有|持有率|命座|命之座|.命)(分布|统计)?$",
  },
  abyssPct: {
    reg: "^#深渊(第?.{1,2}层)?(角色)?出场(率|统计)*$",
  },
  wiki: {
    reg: "^#.*(天赋|技能|命座|命之座|资料)$",
  }
};

lodash.forEach(rule, (r) => {
  r.priority = r.priority || 50;
  r.prehash = true;
});

export { rule };