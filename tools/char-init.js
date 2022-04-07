import Data from "../components/Data.js";
import lodash from "lodash";
import { Character } from "../components/models.js";
import fs from "fs";

import { roleId, abbr } from "../../../config/genshin/roleId.js";

let roleIdMap = {};
lodash.forEach(roleId, (names, id) => {
  roleIdMap[names[0]] = id;
})

let _root = process.cwd();
let characterMeta = Data.readJSON("./plugins/miao-plugin/components/meta", "characters.json");
let characters = {};
let pathName = process.cwd() + "/plugins/miao-plugin/resources/meta/character/";

// 获取指定角色的Meta信息
const getMetaData = function (name) {
  if (!characterMeta[name]) {
    return {};
  }
  const metaCfg = { lowerFirstKey: true },
    meta = characterMeta[name];

  // 处理基础信息
  let ret = Data.getData(meta, "Name,Key,Title,desc:Description,astro:AstrolabeName", metaCfg);

  ret.star = /4star/.test(meta.Star) ? 4 : 5;

  let weaponid = /s_(\d*).png$/.exec(meta.Weapon);
  if (weaponid) {
    ret.weapon = {
      233101: "长柄武器",
      33101: "单手剑",
      43101: "法器",
      163101: "双手剑",
      213101: "弓"
    }[weaponid[1]]
  }


  // 处理图像信息
  //ret.img = Data.getData(meta, "Weapon,Element,City,Profile,GachaCard,GachaSplash,Source", metaCfg);

  // 处理元素
  let elemRet = /([^\/]*).png$/.exec(meta.Element);
  console.log(elemRet[1]);
  if (elemRet && elemRet[1]) {
    ret.elem = elemRet[1];
    ret.element = elemName[ret.elem];
  }

  // 处理属性
  ret.stat = Data.getData(meta, "hp:BaseHP,atk:BaseATK,def:BaseDEF,growStat:AscensionStat,growValue:AscensionStatValue", metaCfg);
  ret.lvStat = lodash.map(meta.CharStat, (d) => Data.getData(d, "Name,Values", metaCfg));

  if (/Mende/.test(meta.City)) {
    ret.city = "蒙德"
  } else if (/Liyue/.test(meta.City)) {
    ret.city = "璃月";
  } else if (/Daoqi/.test(meta.City)) {
    ret.city = "稻妻";
  }

  // 处理材料
  let itemKey = lodash.map("talent,boss,gemStone,Local,monster,weekly".split(","), (a) => `${a}:${lodash.upperFirst(a)}.Name`);
  ret.item = Data.getData(meta, itemKey, metaCfg)

  // 处理天赋
  ret.talent = {
    a: getTalentData(meta.NormalAttack),
    e: getTalentData(meta.TalentE),
    q: getTalentData(meta.TalentQ),
  };

  // 处理其他天赋
  ret.passive = lodash.map(meta.PassiveTalents, (d) => Data.getData(d, "Name,desc:Description", metaCfg))

  // 处理命座信息
  let cons = {};
  lodash.forEach(meta.Constellation, (data, key) => {
    cons[key.replace("Constellation", "")] = Data.getData(data, "Name,desc:Description", metaCfg);
  })
  ret.cons = cons;
  return ret;
}

// 获取Meta中的天赋信息
const getTalentData = function (data) {
  let ret = Data.getData(data, "Name,desc:Description", { lowerFirstKey: true });
  let attr = [], table = [], tableKeys;

  lodash.forEach(data.Table, (tr) => {
    let tmp = { name: tr.Name }, isTable = true, isDef = false, lastVal;

    // 检查当前行是否是表格数据
    lodash.forEach(tr.Values, (v) => {
      // 如果为空则退出循环
      if (v === "") {
        isTable = false;
        return false;
      }

      if (typeof (lastVal) === "undefined") {
        // 设定初始值
        lastVal = v;
      } else if (lastVal != v) {
        // 如果与初始值不一样，则标记退出循环
        isDef = true;
        return false;
      }
    });

    if (isTable && isDef) {
      if (!tableKeys) {
        tableKeys = lodash.keys(tr.Values);
      }
      tmp.value = lodash.map(tableKeys, (k) => tr.Values[k])
      table.push(tmp);
    } else {
      tmp.value = lastVal;
      attr.push(tmp)
    }
  })
  ret.attr = attr;
  ret.table = table;
  ret.tableKeys = tableKeys;
  return ret;
}

lodash.forEach(characterMeta, (c) => {
  let meta = Character.getMetaData(c.Name);
  let data = {
    id: roleIdMap[meta.name],
    key: meta.key,
    name: meta.name,
    abbr: abbr[meta.name] || meta.name,
    city: meta.city
  };
  lodash.defaults(data, meta)
  Data.createDir(pathName, data.name)
  fs.writeFileSync(`${pathName}${data.name}/data.json`, JSON.stringify(data, "", "\t"));
  characters[data.id] = { id: data.id, key: data.key, name: meta.name };

})

fs.writeFileSync(`${pathName}index.json`, JSON.stringify(characters, "", "\t"));
