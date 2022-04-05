import Base from "./Base.js";
import lodash from "lodash";
import fs from "fs";
import Data from "../Data.js";
import request from "request";


let characterMap = {};
const _path = process.cwd();

// 读取配置
let characterMeta = Data.readJSON("./plugins/miao-plugin/components/meta", "characters.json")// JSON.parse(fs.readFileSync(__dirname + "../meta/characters.json", "utf8"));
characterMeta = lodash.keyBy(characterMeta, (d) => d.Name);

const elemName = {
  pyro: "火",
  hydro: "水",
  dendro: "草",
  electro: "雷",
  anemo: "风",
  cryo: "冰",
  geo: "岩"
};

let genshin = await import(`file://${_path}/config/genshin/roleId.js`);


class Character extends Base {
  constructor(name) {
    super();
    this._name = name;
    this.sName = this.name;
    this.id = YunzaiApps.mysInfo['roleIdToName'](name);
    lodash.extend(this, getMetaData(name));
  }

  get name() {
    if (this.roleId) {
      if (this.roleId * 1 === 10000005) {
        this._name = "空";
      } else if (this.roleId * 1 === 10000007) {
        this._name = "荧";
      }
    }
    return this._name;
  }

  set name(name) {
    this._name = name;
  }

  async checkImgCache(resDir) {
    // 处理img信息
    let chcheDir = resDir + "/cache/";
  }

  async cacheImg() {
    let cacheDir = `${_path}/resources/cache`;
    Data.createDir(`${_path}/resources/`, `cache`)

    let fileList = [
      ...lodash.values(this.img),
      ...lodash.map(lodash.values(this.talents), (d) => d.icon),
      ...lodash.map(this.passiveTalents, (d) => d.icon),
      ...lodash.map(lodash.values(this.cons), (d) => d.icon)
    ];

    fileList = lodash.uniq(fileList);

    let fileMap = await Data.cacheFile(fileList, `${_path}/resources/cache/`);

    let path = Data.getUrlPath()

    lodash.forEach(this.img, (url, key) => {
      if (path[url]) {
        this.img[key] = path[url]
      }
    });
    console.log(this);
  }

}

let cacheImgFile = async function (url, cacheDir) {
  let ret = /^https:\/\/(.*)$/.exec(url);
  if (ret && ret[1] && /\.(png|jpg|gif|jpeg|webp)$/.test(ret[1])) {
    let fileName = ret[1];
    Data.createDir(cacheDir, fileName);
    request(imgUrl).pipe(fs.createWriteStream(cacheDir + fileName));
  }
}

// 获取指定角色的Meta信息
let getMetaData = function (name) {
  if (!characterMeta[name]) {
    return {};
  }
  const metaCfg = { lowerFirstKey: true },
    meta = characterMeta[name];

  // 处理基础信息
  let ret = Data.getData(meta, "Name,Key,Title,desc:Description,astro:AstrolabeName", metaCfg);

  ret.star = /4star/.test(meta.Star) ? 4 : 5;

  // 处理图像信息
  ret.img = Data.getData(meta, "Weapon,Element,City,Profile,GachaCard,GachaSplash,Source", metaCfg);

  // 处理元素
  let elemRet = /([a-z]*).png$/.exec(meta.Element);
  if (elemRet && elemRet[1]) {
    ret.elementType = ret[1];
    ret.element = elemName[ret.elementType];
  }

  // 处理属性
  ret.stat = Data.getData(meta, "BaseHP,BaseATK,BaseDEF,aStat:AscensionStat,aStatValue:AscensionStatValue", metaCfg);
  ret.lvStat = lodash.map(meta.CharStat, (d) => Data.getData(d, "Name,Values", metaCfg));

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
  ret.passive = lodash.map(meta.PassiveTalents, (d) => Data.getData(d, "Name,desc:Description,icon:Source", metaCfg))

  // 处理命座信息
  let cons = {};
  lodash.forEach(meta.Constellation, (data, key) => {
    cons[key.replace("Constellation", "")] = Data.getData(data, "Name,icon:Source,desc:Description", metaCfg);
  })
  ret.cons = cons;
  return ret;
}

// 获取Meta中的天赋信息
const getTalentData = function (data) {
  let ret = Data.getData(data, "Name,icon:Source,desc:Description", { lowerFirstKey: true });
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


Character.get = function (val) {
  let roleid;
  if (typeof (val) === "number") {
    roleid = val;
  } else {
    roleid = YunzaiApps.mysInfo['roleIdToName'](val);
  }
  let name = YunzaiApps.mysInfo['roleIdToName'](roleid, true);
  if (!name) {
    return false;
  }
  if (!characterMap[name]) {
    let character = new Character(name);
    characterMap[name] = character;
  }
  return characterMap[name];
};

Character.getAbbr = function () {
  return genshin.abbr;
}
Character.getMetaData = getMetaData;

export default Character;
